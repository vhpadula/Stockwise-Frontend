"use client";

import { Card, Group, Text, Badge } from "@mantine/core";
import { ProductFinancial } from "@/types/Finances";

interface Props {
  financial: ProductFinancial;
}

export default function ProductFinancials({ financial }: Props) {
  const revenue = Number(financial.sales_revenue);
  const cogs = Number(financial.cogs);
  const profit = Number(financial.profit);
  const margin = Number(financial.profit_margin_percent);
  const quantity_sold = Number(financial.quantity_sold);

  return (
    <Card shadow="sm" p="md" radius="md" withBorder>
      <Group justify="space-between">
        <Text>Quantity Sold: {quantity_sold}</Text>
        <Text>Total Revenue: ${revenue.toFixed(2)}</Text>
        <Text>Total COGS: ${cogs.toFixed(2)}</Text>
        <Text>
          Profit: ${profit.toFixed(2)}{" "}
          <Badge color={margin < 20 ? "red" : "green"} size="sm">
            {margin.toFixed(2)}%
          </Badge>
        </Text>
      </Group>
    </Card>
  );
}
