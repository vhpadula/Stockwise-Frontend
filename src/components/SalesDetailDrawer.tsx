import { Drawer, Stack, Group, Text, Badge, Divider } from "@mantine/core";

import { SalesOrder } from "@/types/Sales";
import { formatCurrency } from "@/utils/utils";

interface Props {
  order: SalesOrder | null;
  opened: boolean;
  onClose: () => void;
}

export default function SalesDetailsDrawer({ order, opened, onClose }: Props) {
  if (!order) return null;

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Sales Order Details"
      position="right"
      size="lg"
    >
      <Stack>
        <Group justify="space-between">
          <Text fw={600}>Customer</Text>
          <Text>{order.customer_name}</Text>
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
              <Text size="sm">Qty: {Number(item.quantity).toFixed(2)}</Text>
              <Text size="sm">
                Unit Price: {formatCurrency(item.unit_price)}
              </Text>
            </Group>

            <Text fw={600}>Total: {formatCurrency(item.total_price)}</Text>
          </Stack>
        ))}

        <Divider my="sm" />

        <Group justify="space-between">
          <Text fw={700}>Total Revenue</Text>
          <Text fw={700}>{formatCurrency(order.total_revenue)}</Text>
        </Group>
      </Stack>
    </Drawer>
  );
}
