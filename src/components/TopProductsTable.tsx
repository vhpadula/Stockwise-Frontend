// components/finances/TopProductsTable.tsx
"use client";

import { Card, Group, Loader, Table, Text } from "@mantine/core";
import type { TopProduct } from "@/types/Finances";
import { moneyFromStringOrNumber, toNumber } from "@/utils/utils";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

interface Props {
  isLoading: boolean;
  items?: TopProduct[];
}

const PIE_COLORS = [
  "#7c3aed",
  "#9d4edd",
  "#5b21b6",
  "#a78bfa",
  "#6d28d9",
  "#c4b5fd",
  "#4c1d95",
  "#8b5cf6",
];

export function TopProductsTable({ isLoading, items }: Props) {
  const pieData =
    items?.map((tp) => ({
      name: tp.product_name,
      value: Math.abs(toNumber(tp.profit)), // profit can be negative; pie needs positive magnitudes
      profit: toNumber(tp.profit),
    })) ?? [];

  const hasAnyData = (items?.length ?? 0) > 0;

  return (
    <Card withBorder p="md">
      <Text fw={700} mb="sm">
        Top products
      </Text>

      {isLoading ? (
        <Group justify="center" py="xl">
          <Loader color="violet" />
        </Group>
      ) : !hasAnyData ? (
        <Text c="dimmed">No data yet.</Text>
      ) : (
        <>
          {/* ✅ Added pie chart (new) */}
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {pieData.map((_, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={PIE_COLORS[idx % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(_, __, payload) => {
                  const profit = payload?.payload?.profit ?? 0;
                  return moneyFromStringOrNumber(profit);
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          {/* ✅ Existing table (kept) */}
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
                <Table.Th ta="right">Profit</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {items!.map((tp: TopProduct) => (
                <Table.Tr key={tp.product_id}>
                  <Table.Td>{tp.product_name}</Table.Td>
                  <Table.Td ta="right" fw={700}>
                    {moneyFromStringOrNumber(tp.profit)}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </>
      )}
    </Card>
  );
}
