-- ============================================
-- VIBECODER - Initial Database Schema
-- Created: 2026-01-15
-- ============================================

-- ============================================
-- LABELS TABLE
-- ============================================
CREATE TABLE labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6366F1',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default labels (will be inserted per user)
-- These match the DEFAULT_LABELS from the app

-- ============================================
-- TASKS TABLE
-- Main Kanban board tasks
-- ============================================
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'complete')),
  priority TEXT NOT NULL DEFAULT 'p2' CHECK (priority IN ('p0', 'p1', 'p2', 'p3')),
  labels TEXT[] DEFAULT '{}', -- Array of label IDs
  due_date TIMESTAMPTZ,
  estimated_minutes INTEGER,
  ai_generated BOOLEAN DEFAULT FALSE,
  code_snippet TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SUBTASKS TABLE
-- Subtasks linked to main tasks
-- ============================================
CREATE TABLE subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TODOS TABLE
-- Quick lightweight tasks
-- ============================================
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'p2' CHECK (priority IN ('p0', 'p1', 'p2', 'p3')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTES TABLE
-- Documentation and notes
-- ============================================
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  content TEXT NOT NULL DEFAULT '',
  pinned BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WORKFLOW PROGRESS TABLE
-- Track completed steps in workflow guides
-- ============================================
CREATE TABLE workflow_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  flow_id TEXT NOT NULL,
  step_number INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, flow_id, step_number)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);

CREATE INDEX idx_subtasks_task_id ON subtasks(task_id);

CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_completed ON todos(completed);

CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_pinned ON notes(pinned);

CREATE INDEX idx_workflow_progress_user_id ON workflow_progress(user_id);
CREATE INDEX idx_labels_user_id ON labels(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_progress ENABLE ROW LEVEL SECURITY;

-- Tasks policies
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Subtasks policies (through task ownership)
CREATE POLICY "Users can view subtasks of own tasks"
  ON subtasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks WHERE tasks.id = subtasks.task_id AND tasks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create subtasks for own tasks"
  ON subtasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks WHERE tasks.id = subtasks.task_id AND tasks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update subtasks of own tasks"
  ON subtasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM tasks WHERE tasks.id = subtasks.task_id AND tasks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete subtasks of own tasks"
  ON subtasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM tasks WHERE tasks.id = subtasks.task_id AND tasks.user_id = auth.uid()
    )
  );

-- Labels policies
CREATE POLICY "Users can view own labels"
  ON labels FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own labels"
  ON labels FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own labels"
  ON labels FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own labels"
  ON labels FOR DELETE
  USING (auth.uid() = user_id);

-- Todos policies
CREATE POLICY "Users can view own todos"
  ON todos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own todos"
  ON todos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos"
  ON todos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos"
  ON todos FOR DELETE
  USING (auth.uid() = user_id);

-- Notes policies
CREATE POLICY "Users can view own notes"
  ON notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON notes FOR DELETE
  USING (auth.uid() = user_id);

-- Workflow progress policies
CREATE POLICY "Users can view own workflow progress"
  ON workflow_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own workflow progress"
  ON workflow_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own workflow progress"
  ON workflow_progress FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER subtasks_updated_at
  BEFORE UPDATE ON subtasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER labels_updated_at
  BEFORE UPDATE ON labels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
