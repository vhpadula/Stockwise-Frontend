"use client";

import { Modal, Button, Group, Text, Alert } from "@mantine/core";
import { SalesActionType } from "@/types/Sales";

interface Props {
  opened: boolean;
  onClose: () => void;
  actionType: SalesActionType | null;
  orderId: string | null;
  onConfirm: (type: SalesActionType, orderId: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function SalesActionModal({
  opened,
  onClose,
  actionType,
  orderId,
  onConfirm,
  isLoading = false,
  error = null,
}: Props) {
  const getMessage = () => {
    if (actionType === "confirm") {
      return "Are you sure you want to confirm this sales order?";
    }

    if (actionType === "fulfill") {
      return "Fulfilling this order will deduct stock using FIFO. Continue?";
    }

    if (actionType === "cancel") {
      return "Are you sure you want to cancel this sales order?";
    }

    return "";
  };

  const handleConfirm = () => {
    if (!actionType || !orderId) return;
    onConfirm(actionType, orderId);
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Confirm Action" centered>
      <Text>{getMessage()}</Text>

      {error && (
        <Alert color="red" mt="md">
          {error}
        </Alert>
      )}

      <Group justify="flex-end" mt="lg">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>

        <Button onClick={handleConfirm} loading={isLoading}>
          Confirm
        </Button>
      </Group>
    </Modal>
  );
}
