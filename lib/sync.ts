// ============================================
// VIBECODER - Supabase Sync Service
// Offline-first: Local is source of truth, sync to cloud
// ============================================

import { supabase, type Database } from "./supabase";
import type { Task, Todo, Note, Label, Subtask } from "../types";

// Database row types
type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];
type SubtaskRow = Database["public"]["Tables"]["subtasks"]["Row"];
type LabelRow = Database["public"]["Tables"]["labels"]["Row"];
type TodoRow = Database["public"]["Tables"]["todos"]["Row"];
type NoteRow = Database["public"]["Tables"]["notes"]["Row"];
type WorkflowProgressRow =
  Database["public"]["Tables"]["workflow_progress"]["Row"];

// ============================================
// Type Converters (Local <-> Supabase)
// ============================================

function taskToSupabase(task: Task): Record<string, unknown> {
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? null,
    status: task.status,
    priority: task.priority,
    labels: task.labels,
    due_date: task.dueDate ? new Date(task.dueDate).toISOString() : null,
    estimated_minutes: task.estimatedMinutes ?? null,
    ai_generated: task.aiGenerated ?? false,
    code_snippet: task.codeSnippet ?? null,
    created_at: new Date(task.createdAt).toISOString(),
    updated_at: new Date(task.updatedAt).toISOString(),
  };
}

function taskFromSupabase(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    status: row.status,
    priority: row.priority,
    labels: row.labels ?? [],
    subtasks: [], // Will be loaded separately
    dueDate: row.due_date ? new Date(row.due_date).getTime() : undefined,
    estimatedMinutes: row.estimated_minutes ?? undefined,
    aiGenerated: row.ai_generated,
    codeSnippet: row.code_snippet ?? undefined,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
  };
}

function subtaskToSupabase(
  subtask: Subtask,
  taskId: string
): Record<string, unknown> {
  return {
    id: subtask.id,
    task_id: taskId,
    text: subtask.text,
    completed: subtask.completed,
  };
}

function subtaskFromSupabase(row: SubtaskRow): Subtask {
  return {
    id: row.id,
    text: row.text,
    completed: row.completed,
  };
}

function todoToSupabase(todo: Todo): Record<string, unknown> {
  return {
    id: todo.id,
    text: todo.text,
    completed: todo.completed,
    priority: todo.priority ?? null,
    created_at: new Date(todo.createdAt).toISOString(),
  };
}

function todoFromSupabase(row: TodoRow): Todo {
  return {
    id: row.id,
    text: row.text,
    completed: row.completed,
    priority: row.priority ?? undefined,
    createdAt: new Date(row.created_at).getTime(),
  };
}

function noteToSupabase(note: Note): Record<string, unknown> {
  return {
    id: note.id,
    title: note.title ?? null,
    content: note.content,
    pinned: note.pinned ?? false,
    updated_at: new Date(note.updatedAt).toISOString(),
    created_at: new Date(note.updatedAt).toISOString(), // Use updatedAt as fallback
  };
}

function noteFromSupabase(row: NoteRow): Note {
  return {
    id: row.id,
    title: row.title ?? undefined,
    content: row.content,
    pinned: row.pinned,
    updatedAt: new Date(row.updated_at).getTime(),
  };
}

function labelToSupabase(label: Label): Record<string, unknown> {
  return {
    id: label.id,
    name: label.name,
    color: label.color,
  };
}

function labelFromSupabase(row: LabelRow): Label {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
  };
}

// ============================================
// Sync Status
// ============================================

type SyncStatus = "idle" | "syncing" | "error" | "offline";

let syncStatus: SyncStatus = "idle";
let lastSyncError: string | null = null;

export function getSyncStatus(): { status: SyncStatus; error: string | null } {
  return { status: syncStatus, error: lastSyncError };
}

// ============================================
// Tasks Sync
// ============================================

export async function syncTasksToCloud(
  tasks: Task[],
  labels: Label[]
): Promise<boolean> {
  syncStatus = "syncing";
  try {
    // Upsert tasks
    if (tasks.length > 0) {
      const tasksData = tasks.map(taskToSupabase);
      const { error: tasksError } = await supabase
        .from("tasks")
        .upsert(tasksData as never[], { onConflict: "id" });

      if (tasksError) throw tasksError;
    }

    // Upsert labels
    if (labels.length > 0) {
      const labelsData = labels.map(labelToSupabase);
      const { error: labelsError } = await supabase
        .from("labels")
        .upsert(labelsData as never[], { onConflict: "id" });

      if (labelsError) throw labelsError;
    }

    // Sync subtasks
    for (const task of tasks) {
      if (task.subtasks.length > 0) {
        const subtasksData = task.subtasks.map((st) =>
          subtaskToSupabase(st, task.id)
        );

        const { error: subtasksError } = await supabase
          .from("subtasks")
          .upsert(subtasksData as never[], { onConflict: "id" });

        if (subtasksError) throw subtasksError;
      }
    }

    syncStatus = "idle";
    lastSyncError = null;
    return true;
  } catch (error) {
    syncStatus = "error";
    lastSyncError = error instanceof Error ? error.message : "Sync failed";
    console.error("[Sync] Tasks sync failed:", lastSyncError);
    return false;
  }
}

export async function fetchTasksFromCloud(): Promise<{
  tasks: Task[];
  labels: Label[];
} | null> {
  try {
    // Fetch tasks
    const { data: tasksData, error: tasksError } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (tasksError) throw tasksError;

    // Fetch labels
    const { data: labelsData, error: labelsError } = await supabase
      .from("labels")
      .select("*");

    if (labelsError) throw labelsError;

    // Fetch subtasks
    const { data: subtasksData, error: subtasksError } = await supabase
      .from("subtasks")
      .select("*");

    if (subtasksError) throw subtasksError;

    // Map subtasks to tasks
    const subtasksByTask = new Map<string, Subtask[]>();
    for (const st of (subtasksData ?? []) as SubtaskRow[]) {
      const existing = subtasksByTask.get(st.task_id) ?? [];
      existing.push(subtaskFromSupabase(st));
      subtasksByTask.set(st.task_id, existing);
    }

    const tasks: Task[] = ((tasksData ?? []) as TaskRow[]).map((row) => {
      const task = taskFromSupabase(row);
      task.subtasks = subtasksByTask.get(row.id) ?? [];
      return task;
    });

    const labels: Label[] = ((labelsData ?? []) as LabelRow[]).map(
      labelFromSupabase
    );

    return { tasks, labels };
  } catch (error) {
    console.error("[Sync] Fetch tasks failed:", error);
    return null;
  }
}

export async function deleteTaskFromCloud(taskId: string): Promise<boolean> {
  try {
    // Delete subtasks first
    await supabase.from("subtasks").delete().eq("task_id", taskId);

    // Delete task
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("[Sync] Delete task failed:", error);
    return false;
  }
}

export async function deleteSubtaskFromCloud(
  subtaskId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("subtasks")
      .delete()
      .eq("id", subtaskId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("[Sync] Delete subtask failed:", error);
    return false;
  }
}

export async function deleteLabelFromCloud(labelId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("labels").delete().eq("id", labelId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("[Sync] Delete label failed:", error);
    return false;
  }
}

// ============================================
// Todos Sync
// ============================================

export async function syncTodosToCloud(todos: Todo[]): Promise<boolean> {
  syncStatus = "syncing";
  try {
    if (todos.length > 0) {
      const todosData = todos.map(todoToSupabase);
      const { error } = await supabase
        .from("todos")
        .upsert(todosData as never[], { onConflict: "id" });

      if (error) throw error;
    }

    syncStatus = "idle";
    lastSyncError = null;
    return true;
  } catch (error) {
    syncStatus = "error";
    lastSyncError = error instanceof Error ? error.message : "Sync failed";
    console.error("[Sync] Todos sync failed:", lastSyncError);
    return false;
  }
}

export async function fetchTodosFromCloud(): Promise<Todo[] | null> {
  try {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return ((data ?? []) as TodoRow[]).map(todoFromSupabase);
  } catch (error) {
    console.error("[Sync] Fetch todos failed:", error);
    return null;
  }
}

export async function deleteTodoFromCloud(todoId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("todos").delete().eq("id", todoId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("[Sync] Delete todo failed:", error);
    return false;
  }
}

// ============================================
// Notes Sync
// ============================================

export async function syncNotesToCloud(notes: Note[]): Promise<boolean> {
  syncStatus = "syncing";
  try {
    if (notes.length > 0) {
      const notesData = notes.map(noteToSupabase);
      const { error } = await supabase
        .from("notes")
        .upsert(notesData as never[], { onConflict: "id" });

      if (error) throw error;
    }

    syncStatus = "idle";
    lastSyncError = null;
    return true;
  } catch (error) {
    syncStatus = "error";
    lastSyncError = error instanceof Error ? error.message : "Sync failed";
    console.error("[Sync] Notes sync failed:", lastSyncError);
    return false;
  }
}

export async function fetchNotesFromCloud(): Promise<Note[] | null> {
  try {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return ((data ?? []) as NoteRow[]).map(noteFromSupabase);
  } catch (error) {
    console.error("[Sync] Fetch notes failed:", error);
    return null;
  }
}

export async function deleteNoteFromCloud(noteId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("notes").delete().eq("id", noteId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("[Sync] Delete note failed:", error);
    return false;
  }
}

// ============================================
// Workflow Progress Sync
// ============================================

export async function syncWorkflowProgressToCloud(
  flowId: string,
  completedSteps: number[]
): Promise<boolean> {
  try {
    // Delete existing progress for this flow
    await supabase.from("workflow_progress").delete().eq("flow_id", flowId);

    // Insert new progress
    if (completedSteps.length > 0) {
      const progressData = completedSteps.map((step) => ({
        flow_id: flowId,
        step_number: step,
      }));

      const { error } = await supabase
        .from("workflow_progress")
        .insert(progressData as never[]);

      if (error) throw error;
    }

    return true;
  } catch (error) {
    console.error("[Sync] Workflow progress sync failed:", error);
    return false;
  }
}

export async function fetchWorkflowProgressFromCloud(): Promise<Map<
  string,
  number[]
> | null> {
  try {
    const { data, error } = await supabase
      .from("workflow_progress")
      .select("*");

    if (error) throw error;

    const progressMap = new Map<string, number[]>();
    for (const row of (data ?? []) as WorkflowProgressRow[]) {
      const existing = progressMap.get(row.flow_id) ?? [];
      existing.push(row.step_number);
      progressMap.set(row.flow_id, existing);
    }

    return progressMap;
  } catch (error) {
    console.error("[Sync] Fetch workflow progress failed:", error);
    return null;
  }
}

// ============================================
// Connection Test
// ============================================

export async function testConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from("tasks").select("id").limit(1);
    return !error;
  } catch {
    return false;
  }
}
