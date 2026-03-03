import { Modal, Stack, Text, Group, Button } from "@mantine/core";
import { ActionType } from "@/types/Purchases";

interface Props {
  opened: boolean;
  actionType: ActionType | null;
  orderId: string | null;
  onClose: () => void;
  onConfirm: (type: ActionType, orderId: string) => void;
  isLoading: boolean;
}

export default function PurchaseActionModal({
  opened,
  actionType,
  orderId,
  onClose,
  onConfirm,
  isLoading,
}: Props) {
  const handleConfirm = () => {
    if (!actionType || !orderId) return;
    onConfirm(actionType, orderId);
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Are you sure?" centered>
      <Stack>
        <Text>
          {actionType === "confirm" &&
            "This action is irreversible. Do you want to confirm this purchase order?"}

          {actionType === "receive" &&
            "Receiving this order will create stock entries and affect inventory. Continue?"}

          {actionType === "cancel" &&
            "Do you want to cancel this purchase order?"}
        </Text>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Back
          </Button>

          <Button
            color={actionType === "cancel" ? "red" : "purple"}
            loading={isLoading}
            onClick={handleConfirm}
          >
            {actionType === "confirm" && "Confirm"}
            {actionType === "receive" && "Receive"}
            {actionType === "cancel" && "Cancel"}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
