import React from "react";
import { Modal } from "../ui/Modal";
import { Task } from "../../types";
import { EditTaskContent } from "./edit-task";
import { strings } from "../../utils/strings";

interface EditTaskModalProps {
  visible: boolean;
  task: Task;
  onClose: () => void;
  onSubmit: (id: string, updates: Partial<Task>) => void;
}

export function EditTaskModal({
  visible,
  task,
  onClose,
  onSubmit,
}: EditTaskModalProps) {
  return (
    <Modal visible={visible} onClose={onClose} title={strings.editTask}>
      <EditTaskContent task={task} onClose={onClose} onSubmit={onSubmit} />
    </Modal>
  );
}
