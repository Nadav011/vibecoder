import React from "react";
import { Modal } from "../../ui/Modal";
import { AnalyticsContent } from "./AnalyticsContent";

interface AnalyticsProps {
  compact?: boolean;
  visible?: boolean;
  onClose?: () => void;
}

export function Analytics({
  compact = false,
  visible,
  onClose,
}: AnalyticsProps) {
  // If used as modal, wrap in Modal component
  if (visible !== undefined && onClose) {
    return (
      <Modal visible={visible} onClose={onClose} title="סטטיסטיקות">
        <AnalyticsContent compact={compact} />
      </Modal>
    );
  }

  return <AnalyticsContent compact={compact} />;
}
