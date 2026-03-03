import { Table, Badge, Stack, Text, Menu, ActionIcon } from "@mantine/core";
import {
  EllipsisHorizontalIcon,
  EyeIcon,
  CheckIcon,
  TruckIcon,
  XMarkIcon,
  PencilIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";

import { SalesOrder, SalesActionType } from "@/types/Sales";
import { formatCurrency } from "@/utils/utils";

interface Props {
  order: SalesOrder;
  onView: (order: SalesOrder) => void;
  onAction: (type: SalesActionType, orderId: string) => void;
}

export function SalesRow({ order, onView, onAction }: Props) {
  return (
    <Table.Tr>
      <Table.Td>{order.id.slice(0, 8)}</Table.Td>

      <Table.Td>{order.customer_name}</Table.Td>

      <Table.Td>
        <Stack gap={2}>
          <Text size="sm" fw={500}>
            {order.items.length} items
          </Text>

          {order.items.slice(0, 2).map((item) => (
            <Text key={item.id} size="xs" c="dimmed">
              {item.product_name} ({Number(item.quantity).toFixed(2)})
            </Text>
          ))}

          {order.items.length > 2 && (
            <Text size="xs" c="dimmed">
              +{order.items.length - 2} more
            </Text>
          )}
        </Stack>
      </Table.Td>

      <Table.Td>{formatCurrency(order.total_revenue)}</Table.Td>

      <Table.Td>
        <Badge>{order.status}</Badge>
      </Table.Td>

      <Table.Td>{order.order_date}</Table.Td>

      <Table.Td>
        <Menu shadow="md" width={180}>
          <Menu.Target>
            <ActionIcon variant="subtle">
              <EllipsisHorizontalIcon width={18} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<EyeIcon className="w-4 h-4" />}
              onClick={() => onView(order)}
            >
              View Details
            </Menu.Item>

            {order.status === "draft" && (
              <>
                <Menu.Item
                  leftSection={<CheckIcon className="w-4 h-4" />}
                  onClick={() => onAction("confirm", order.id)}
                >
                  Confirm
                </Menu.Item>

                <Menu.Item
                  leftSection={<PencilIcon className="w-4 h-4" />}
                  component={Link}
                  href={`/dashboard/sales/${order.id}`}
                >
                  Edit
                </Menu.Item>
              </>
            )}

            {order.status === "confirmed" && (
              <Menu.Item
                leftSection={<TruckIcon className="w-4 h-4" />}
                onClick={() => onAction("fulfill", order.id)}
              >
                Fulfill
              </Menu.Item>
            )}

            {(order.status === "draft" || order.status === "confirmed") && (
              <Menu.Item
                color="red"
                leftSection={<XMarkIcon className="w-4 h-4" />}
                onClick={() => onAction("cancel", order.id)}
              >
                Cancel
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  );
}
