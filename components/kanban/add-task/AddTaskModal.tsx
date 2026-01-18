import React from "react";
import { Modal } from "../../ui/Modal";
import { Task } from "../../../types";
import { strings } from "../../../utils/strings";
import { AddTaskContent } from "./AddTaskContent";

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (task: Partial<Task> & { title: string }) => void;
}

export function AddTaskModal({
  visible,
  onClose,
  onSubmit,
}: AddTaskModalProps) {
  return (
    <Modal visible={visible} onClose={onClose} title={strings.newTask}>
      <AddTaskContent onClose={onClose} onSubmit={onSubmit} />
    </Modal>
  );
}
