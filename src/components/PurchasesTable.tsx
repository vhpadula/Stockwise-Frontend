import { Table } from "@mantine/core";
import { PurchaseOrder } from "@/types/Purchases";
import { PurchaseRow } from "@/components/PurchaseRow";
import { ActionType } from "@/types/Purchases";

interface Props {
  orders: PurchaseOrder[];
  onView: (order: PurchaseOrder) => void;
  onAction: (type: ActionType, orderId: string) => void;
}

export default function PurchasesTable({ orders, onView, onAction }: Props) {
  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>ID</Table.Th>
          <Table.Th>Supplier</Table.Th>
          <Table.Th>Items</Table.Th>
          <Table.Th>Total Cost</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Date</Table.Th>
          <Table.Th style={{ width: 50 }} />
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {orders.map((order) => (
          <PurchaseRow
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
