"use client";

import { Table, Badge, Group, Text } from "@mantine/core";
import { Stock } from "@/types/Stocks";

interface Props {
  stocks: Stock[];
}

export default function ProductDetailStocksTable({ stocks }: Props) {
  if (!stocks.length) {
    return <Text c="dimmed">No stock available for this product.</Text>;
  }

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Lot</Table.Th>
          <Table.Th>Remaining</Table.Th>
          <Table.Th>Unit Cost</Table.Th>
          <Table.Th>Value</Table.Th>
          <Table.Th>Expiration</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {stocks.map((stock) => {
          const remaining = Number(stock.remaining_quantity);
          const unitCost = Number(stock.unit_cost);
          const value = remaining * unitCost;

          const isLow = remaining <= 10;

          return (
            <Table.Tr key={stock.id}>
              <Table.Td>
                {stock.lot_number ? (
                  <Badge variant="light">{stock.lot_number}</Badge>
                ) : (
                  "-"
                )}
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Text>{remaining}</Text>
                  {isLow && (
                    <Badge color="red" size="xs">
                      Low
                    </Badge>
                  )}
                </Group>
              </Table.Td>
              <Table.Td>${unitCost.toFixed(2)}</Table.Td>
              <Table.Td>${value.toFixed(2)}</Table.Td>
              <Table.Td>{stock.expiration_date || "-"}</Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
}
