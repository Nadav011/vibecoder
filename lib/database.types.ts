// ============================================
// VIBECODER - Database Types (Auto-generated style)
// Run `supabase gen types typescript` to regenerate
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          status: "todo" | "in_progress" | "complete";
          priority: "p0" | "p1" | "p2" | "p3";
          labels: string[];
          due_date: string | null;
          estimated_minutes: number | null;
          ai_generated: boolean;
          code_snippet: string | null;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          status?: "todo" | "in_progress" | "complete";
          priority?: "p0" | "p1" | "p2" | "p3";
          labels?: string[];
          due_date?: string | null;
          estimated_minutes?: number | null;
          ai_generated?: boolean;
          code_snippet?: string | null;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          status?: "todo" | "in_progress" | "complete";
          priority?: "p0" | "p1" | "p2" | "p3";
          labels?: string[];
          due_date?: string | null;
          estimated_minutes?: number | null;
          ai_generated?: boolean;
          code_snippet?: string | null;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subtasks: {
        Row: {
          id: string;
          task_id: string;
          text: string;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          text: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          text?: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      labels: {
        Row: {
          id: string;
          name: string;
          color: string;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color?: string;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      todos: {
        Row: {
          id: string;
          text: string;
          completed: boolean;
          priority: "p0" | "p1" | "p2" | "p3" | null;
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          text: string;
          completed?: boolean;
          priority?: "p0" | "p1" | "p2" | "p3" | null;
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          text?: string;
          completed?: boolean;
          priority?: "p0" | "p1" | "p2" | "p3" | null;
          user_id?: string | null;
          created_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          title: string | null;
          content: string;
          pinned: boolean;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title?: string | null;
          content?: string;
          pinned?: boolean;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string | null;
          content?: string;
          pinned?: boolean;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      workflow_progress: {
        Row: {
          id: string;
          user_id: string | null;
          flow_id: string;
          step_number: number;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          flow_id: string;
          step_number: number;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          flow_id?: string;
          step_number?: number;
          completed_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Convenience types
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
