// components/finances/FinancesTimelineChart.tsx
"use client";

import { Card, Group, Loader, Text } from "@mantine/core";
import type { FinancialTimelineItem } from "@/types/Finances";
import { toNumber } from "@/utils/utils";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

interface Props {
  isLoading: boolean;
  productId: string | null;
  items?: FinancialTimelineItem[];
}

export function FinancesTimelineChart({ isLoading, productId, items }: Props) {
  const data =
    items?.map((it) => ({
      period: it.period,
      revenue: toNumber(it.sales_value),
      costs: toNumber(it.purchase_value),
      profit: toNumber(it.profit),
    })) ?? [];

  return (
    <Card withBorder p="md">
      <Group justify="apart" mb="sm">
        <Text fw={700}>Timeline</Text>
        <Text c="dimmed" size="sm">
          {productId ? "Filtered by product" : "All products"}
        </Text>
      </Group>

      {isLoading ? (
        <Group justify="center" py="xl">
          <Loader color="violet" />
        </Group>
      ) : data.length === 0 ? (
        <Text c="dimmed">No timeline data for this range.</Text>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 10, bottom: 20 }}>
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" name="Sales" fill="#7c3aed" />
              <Bar dataKey="costs" name="Purchases" fill="#ef4444" />
              <Bar dataKey="profit" name="Profit" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data} margin={{ top: 10, right: 20, bottom: 20 }}>
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Sales"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="costs"
                name="Purchases"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="profit"
                name="Profit"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </Card>
  );
}
