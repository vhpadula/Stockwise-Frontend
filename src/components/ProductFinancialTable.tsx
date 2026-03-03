"use client";

import { Badge, Card, Group, Loader, Table, Text } from "@mantine/core";
import type { ProductFinancial } from "@/types/Finances";
import { moneyFromStringOrNumber, toNumber } from "@/utils/utils";

interface Props {
  isLoading: boolean;
  items?: ProductFinancial[];
}

export function ProductFinancialTable({ isLoading, items }: Props) {
  return (
    <Card withBorder p="md">
      <Group justify="apart" mb="sm">
        <Text fw={700}>By product</Text>
        <Text c="dimmed" size="sm">
          Revenue / COGS / Profit
        </Text>
      </Group>

      {isLoading ? (
        <Group justify="center" py="xl">
          <Loader color="violet" />
        </Group>
      ) : (items?.length ?? 0) === 0 ? (
        <Text c="dimmed">No product financial data yet.</Text>
      ) : (
        <Table
          striped
          highlightOnHover
          verticalSpacing="sm"
          withTableBorder
          withColumnBorders
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Product</Table.Th>
              <Table.Th ta="right">Qty</Table.Th>
              <Table.Th ta="right">Revenue</Table.Th>
              <Table.Th ta="right">COGS</Table.Th>
              <Table.Th ta="right">Profit</Table.Th>
              <Table.Th ta="right">Margin</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {items!.map((p) => (
              <Table.Tr key={p.product_id}>
                <Table.Td>{p.product_name}</Table.Td>
                <Table.Td ta="right">
                  {toNumber(p.quantity_sold).toLocaleString()}
                </Table.Td>
                <Table.Td ta="right">
                  {moneyFromStringOrNumber(p.sales_revenue)}
                </Table.Td>
                <Table.Td ta="right">
                  {moneyFromStringOrNumber(p.cogs)}
                </Table.Td>
                <Table.Td ta="right" fw={700}>
                  {moneyFromStringOrNumber(p.profit)}
                </Table.Td>
                <Table.Td ta="right">
                  <Badge
                    color={toNumber(p.profit) >= 0 ? "green" : "red"}
                    variant="light"
                  >
                    {toNumber(p.profit_margin_percent).toFixed(1)}%
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Card>
  );
}
