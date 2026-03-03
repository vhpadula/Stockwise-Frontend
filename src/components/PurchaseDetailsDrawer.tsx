import { Drawer, Stack, Group, Text, Badge, Divider } from "@mantine/core";

import { PurchaseOrder } from "@/types/Purchases";
import { formatCurrency } from "@/utils/utils";

interface Props {
  order: PurchaseOrder | null;
  opened: boolean;
  onClose: () => void;
}

export default function PurchaseDetailsDrawer({
  order,
  opened,
  onClose,
}: Props) {
  if (!order) return null;

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Purchase Order Details"
      position="right"
      size="lg"
    >
      <Stack>
        <Group justify="space-between">
          <Text fw={600}>Supplier</Text>
          <Text>{order.supplier_name}</Text>
        </Group>

        <Group justify="space-between">
          <Text fw={600}>Status</Text>
          <Badge>{order.status}</Badge>
        </Group>

        <Group justify="space-between">
          <Text fw={600}>Order Date</Text>
          <Text>{order.order_date}</Text>
        </Group>

        <Divider my="sm" />

        <Text fw={600}>Items</Text>

        {order.items.map((item) => (
          <Stack
            key={item.id}
            p="sm"
            style={{
              border: "1px solid #eee",
              borderRadius: 8,
            }}
          >
            <Text fw={500}>{item.product_name}</Text>

            <Group justify="space-between">
              <Text size="sm">Qty: {item.quantity}</Text>
              <Text size="sm">Unit Cost: {formatCurrency(item.unit_cost)}</Text>
            </Group>

            <Group justify="space-between">
              <Text size="sm">Lot: {item.lot_number || "-"}</Text>
              <Text size="sm">Exp: {item.expiration_date || "-"}</Text>
            </Group>

            <Text fw={600}>Total: {formatCurrency(item.total_cost)}</Text>
          </Stack>
        ))}

        <Divider my="sm" />

        <Group justify="space-between">
          <Text fw={700}>Total Purchase Cost</Text>
          <Text fw={700}>{formatCurrency(order.total_amount)}</Text>
        </Group>
      </Stack>
    </Drawer>
  );
}
