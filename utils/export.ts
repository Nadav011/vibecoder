import { Platform } from "react-native";
import { Task, Todo, Note } from "../types";
import { logger } from "./logger";

export type ExportFormat = "json" | "csv" | "markdown";

export interface ExportOptions {
  format: ExportFormat;
  includeTasks: boolean;
  includeTodos: boolean;
  includeNotes: boolean;
  includeCompleted: boolean;
}

export interface ExportData {
  version: string;
  exportedAt: string;
  tasks?: Task[];
  todos?: Todo[];
  notes?: Note[];
}

// Export to JSON
export function exportToJson(data: ExportData): string {
  return JSON.stringify(data, null, 2);
}

// Export to CSV
export function exportTasksToCsv(tasks: Task[]): string {
  const headers = [
    "ID",
    "Title",
    "Description",
    "Status",
    "Priority",
    "Labels",
    "Subtasks",
    "Due Date",
    "AI Generated",
    "Created At",
    "Updated At",
  ];

  const rows = tasks.map((task) => [
    task.id,
    escapeCSV(task.title),
    escapeCSV(task.description || ""),
    task.status,
    task.priority,
    task.labels.join("; "),
    task.subtasks.map((s) => s.text).join("; "),
    task.dueDate ? new Date(task.dueDate).toISOString() : "",
    task.aiGenerated ? "Yes" : "No",
    new Date(task.createdAt).toISOString(),
    new Date(task.updatedAt).toISOString(),
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

export function exportTodosToCsv(todos: Todo[]): string {
  const headers = ["ID", "Text", "Completed", "Priority", "Created At"];

  const rows = todos.map((todo) => [
    todo.id,
    escapeCSV(todo.text),
    todo.completed ? "Yes" : "No",
    todo.priority || "",
    new Date(todo.createdAt).toISOString(),
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

// Export to Markdown
export function exportToMarkdown(data: ExportData): string {
  const lines: string[] = [];

  lines.push("# VibeCoder Export");
  lines.push("");
  lines.push(
    `> Exported on ${new Date(data.exportedAt).toLocaleString("he-IL")}`,
  );
  lines.push("");

  // Tasks
  if (data.tasks && data.tasks.length > 0) {
    lines.push("## משימות");
    lines.push("");

    // Group by status
    const byStatus = {
      todo: data.tasks.filter((t) => t.status === "todo"),
      in_progress: data.tasks.filter((t) => t.status === "in_progress"),
      complete: data.tasks.filter((t) => t.status === "complete"),
    };

    if (byStatus.todo.length > 0) {
      lines.push("### לביצוע");
      lines.push("");
      byStatus.todo.forEach((task) => {
        lines.push(formatTaskMarkdown(task));
      });
      lines.push("");
    }

    if (byStatus.in_progress.length > 0) {
      lines.push("### בתהליך");
      lines.push("");
      byStatus.in_progress.forEach((task) => {
        lines.push(formatTaskMarkdown(task));
      });
      lines.push("");
    }

    if (byStatus.complete.length > 0) {
      lines.push("### הושלם");
      lines.push("");
      byStatus.complete.forEach((task) => {
        lines.push(formatTaskMarkdown(task));
      });
      lines.push("");
    }
  }

  // Todos
  if (data.todos && data.todos.length > 0) {
    lines.push("## משימות מהירות");
    lines.push("");
    data.todos.forEach((todo) => {
      const checkbox = todo.completed ? "[x]" : "[ ]";
      lines.push(`- ${checkbox} ${todo.text}`);
    });
    lines.push("");
  }

  // Notes
  if (data.notes && data.notes.length > 0) {
    lines.push("## הערות");
    lines.push("");
    data.notes.forEach((note) => {
      const title = note.title || "ללא כותרת";
      lines.push(`### ${title}`);
      lines.push("");
      lines.push(note.content);
      lines.push("");
      lines.push("---");
      lines.push("");
    });
  }

  return lines.join("\n");
}

function formatTaskMarkdown(task: Task): string {
  const lines: string[] = [];

  // Priority emoji
  const priorityEmoji: Record<string, string> = {
    p0: "🔴",
    p1: "🟠",
    p2: "🔵",
    p3: "⚪",
  };

  lines.push(
    `#### ${priorityEmoji[task.priority] || ""} ${task.title}${task.aiGenerated ? " ✨" : ""}`,
  );

  if (task.description) {
    lines.push("");
    lines.push(task.description);
  }

  if (task.subtasks.length > 0) {
    lines.push("");
    lines.push("**תתי-משימות:**");
    task.subtasks.forEach((subtask) => {
      const checkbox = subtask.completed ? "[x]" : "[ ]";
      lines.push(`- ${checkbox} ${subtask.text}`);
    });
  }

  if (task.labels.length > 0) {
    lines.push("");
    lines.push(`**תגיות:** ${task.labels.join(", ")}`);
  }

  lines.push("");

  return lines.join("\n");
}

// Helper to escape CSV values
function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// Download file (web only)
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string,
): void {
  if (Platform.OS !== "web") {
    throw new Error("Download only supported on web platform");
  }

  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    logger.error("Download failed:", error);
    throw new Error(`Failed to download file: ${filename}`);
  }
}

// Export result type
export interface ExportResult {
  success: boolean;
  filesExported: number;
  error?: string;
}

// Main export function
export async function performExport(
  tasks: Task[],
  todos: Todo[],
  notes: Note[],
  options: ExportOptions,
): Promise<ExportResult> {
  try {
    const timestamp = new Date().toISOString().split("T")[0];
    let filesExported = 0;

    // Filter data based on options
    let filteredTasks = options.includeTasks ? tasks : [];
    const filteredTodos = options.includeTodos ? todos : [];
    const filteredNotes = options.includeNotes ? notes : [];

    if (!options.includeCompleted) {
      filteredTasks = filteredTasks.filter((t) => t.status !== "complete");
    }

    // Check if there's any data to export
    if (
      filteredTasks.length === 0 &&
      filteredTodos.length === 0 &&
      filteredNotes.length === 0
    ) {
      return {
        success: false,
        filesExported: 0,
        error: "No data to export. Select at least one category with data.",
      };
    }

    const data: ExportData = {
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
      tasks: filteredTasks.length > 0 ? filteredTasks : undefined,
      todos: filteredTodos.length > 0 ? filteredTodos : undefined,
      notes: filteredNotes.length > 0 ? filteredNotes : undefined,
    };

    switch (options.format) {
      case "json": {
        const content = exportToJson(data);
        downloadFile(
          content,
          `vibecoder-export-${timestamp}.json`,
          "application/json",
        );
        filesExported = 1;
        break;
      }
      case "csv": {
        // Export tasks to CSV
        if (filteredTasks.length > 0) {
          const tasksCSV = exportTasksToCsv(filteredTasks);
          downloadFile(
            tasksCSV,
            `vibecoder-tasks-${timestamp}.csv`,
            "text/csv",
          );
          filesExported++;
        }
        // Export todos to CSV
        if (filteredTodos.length > 0) {
          const todosCSV = exportTodosToCsv(filteredTodos);
          downloadFile(
            todosCSV,
            `vibecoder-todos-${timestamp}.csv`,
            "text/csv",
          );
          filesExported++;
        }
        break;
      }
      case "markdown": {
        const content = exportToMarkdown(data);
        downloadFile(
          content,
          `vibecoder-export-${timestamp}.md`,
          "text/markdown",
        );
        filesExported = 1;
        break;
      }
    }

    return { success: true, filesExported };
  } catch (error) {
    logger.error("Export failed:", error);
    return {
      success: false,
      filesExported: 0,
      error:
        error instanceof Error
          ? error.message
          : "Unknown export error occurred",
    };
  }
}
