"use client";

import { Card, Grid, Text } from "@mantine/core";
import type { FinancialSummary } from "@/types/Finances";
import { moneyFromStringOrNumber, toNumber } from "@/utils/utils";

interface Props {
  summary?: FinancialSummary;
}

export function FinancesKpis({ summary }: Props) {
  return (
    <Grid gutter="md">
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card withBorder p="md">
          <Text c="dimmed" size="sm">
            Total purchased
          </Text>
          <Text fw={700} size="lg">
            {toNumber(summary?.total_purchased_quantity).toLocaleString()}
          </Text>
          <Text c="dimmed" size="xs">
            {moneyFromStringOrNumber(summary?.total_purchase_value)}
          </Text>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card withBorder p="md">
          <Text c="dimmed" size="sm">
            Total sold
          </Text>
          <Text fw={700} size="lg">
            {toNumber(summary?.total_sold_quantity).toLocaleString()}
          </Text>
          <Text c="dimmed" size="xs">
            {moneyFromStringOrNumber(summary?.total_sales_value)}
          </Text>
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <Card withBorder p="md">
          <Text c="dimmed" size="sm">
            Profit
          </Text>
          <Text fw={700} size="lg">
            {moneyFromStringOrNumber(summary?.total_profit)}
          </Text>
          <Text c="dimmed" size="xs">
            Margin: {toNumber(summary?.profit_margin_percent).toFixed(2)}%
          </Text>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
