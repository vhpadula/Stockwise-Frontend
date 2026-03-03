import { Table } from "@mantine/core";
import { SalesOrder, SalesActionType } from "@/types/Sales";
import { SalesRow } from "./SalesRow";

interface Props {
  orders: SalesOrder[];
  onView: (order: SalesOrder) => void;
  onAction: (type: SalesActionType, orderId: string) => void;
}

export default function SalesTable({ orders, onView, onAction }: Props) {
  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>ID</Table.Th>
          <Table.Th>Customer</Table.Th>
          <Table.Th>Items</Table.Th>
          <Table.Th>Total Revenue</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Date</Table.Th>
          <Table.Th style={{ width: 50 }} />
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {orders.map((order) => (
          <SalesRow
            key={order.id}
            order={order}
            onView={onView}
            onAction={onAction}
          />
        ))}
      </Table.Tbody>
    </Table>
  );
}
