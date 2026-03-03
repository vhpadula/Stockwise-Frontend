"use client";

import {
  Drawer,
  Table,
  Text,
  Badge,
  Group,
  Loader,
  Center,
  Stack,
  Divider,
} from "@mantine/core";
import { useMemo } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";

import { StocksService } from "@/services/Stocks";
import { SalesService } from "@/services/Sales";

import { StockMovement, Stock } from "@/types/Stocks";
import { SalesOrderItem } from "@/types/Sales";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  stockId?: string;
  productId?: string;
  opened: boolean;
  onClose: () => void;
}

type MovementRow = {
  movement: StockMovement;
  item?: SalesOrderItem;
  quantity: number;
  costPerUnit: number;
  unitPrice?: number;
  cogs: number;
  revenue?: number;
  profit?: number;
  marginPct?: number;
};

export default function StockMovementsDrawer({
  stockId,
  productId,
  opened,
  onClose,
}: Props) {
  // Fetch stock movements (sales deductions ledger)
  const { data: movements, isLoading: loadingMovements } = useQuery({
    queryKey: ["stockMovements", stockId || productId],
    queryFn: () =>
      StocksService.getMovements({
        stock: stockId,
        stock__product: productId,
      }),
    enabled: opened,
  });

  // Fetch stocks for purchase/remaining summary
  const { data: stocks, isLoading: loadingStocks } = useQuery({
    queryKey: ["stocks", stockId || productId],
    queryFn: async () => {
      if (stockId) {
        const stock = await StocksService.getById(stockId);
        return [stock];
      }
      if (productId) {
        return await StocksService.getAll({ product: productId });
      }
      return [];
    },
    enabled: opened,
  });

  // Collect unique SalesOrderItem ids referenced by movements
  const salesOrderItemIds = useMemo(() => {
    const ids =
      movements
        ?.map((m) => m.sales_order_item)
        .filter((id): id is string => Boolean(id)) ?? [];
    return Array.from(new Set(ids));
  }, [movements]);

  // Fetch each SalesOrderItem (parallel)
  const itemQueries = useQueries({
    queries: salesOrderItemIds.map((id) => ({
      queryKey: ["salesOrderItem", id],
      queryFn: () => SalesService.getItem(id),
      enabled: opened && salesOrderItemIds.length > 0,
      staleTime: 60_000,
    })),
  });

  const loadingItems = itemQueries.some((q) => q.isLoading);

  const itemsById = useMemo(() => {
    const map: Record<string, SalesOrderItem> = {};
    itemQueries.forEach((q, idx) => {
      const id = salesOrderItemIds[idx];
      if (q.data && id) map[id] = q.data;
    });
    return map;
  }, [itemQueries, salesOrderItemIds]);

  const isLoading = loadingMovements || loadingStocks || loadingItems;

  // Inventory summary
  const totalPurchased = stocks
    ? stocks.reduce((acc, s: Stock) => acc + Number(s.initial_quantity), 0)
    : 0;

  const totalSold = movements
    ? movements.reduce((acc, m: StockMovement) => acc + Number(m.quantity), 0)
    : 0;

  const remaining = totalPurchased - totalSold;

  // Prepare movement rows with finance
  const rows: MovementRow[] = useMemo(() => {
    if (!movements) return [];

    return movements.map((m) => {
      const quantity = Number(m.quantity);
      const costPerUnit = Number(m.cost_per_unit);
      const cogs = quantity * costPerUnit;

      const item = m.sales_order_item
        ? itemsById[m.sales_order_item]
        : undefined;
      const unitPrice = item ? Number(item.unit_price) : undefined;

      const revenue =
        unitPrice !== undefined ? quantity * unitPrice : undefined;
      const profit = revenue !== undefined ? revenue - cogs : undefined;

      const marginPct =
        revenue && revenue > 0 && profit !== undefined
          ? (profit / revenue) * 100
          : undefined;

      return {
        movement: m,
        item,
        quantity,
        costPerUnit,
        unitPrice,
        cogs,
        revenue,
        profit,
        marginPct,
      };
    });
  }, [movements, itemsById]);

  // Totals for finance summary
  const totals = useMemo(() => {
    const totalCogs = rows.reduce((acc, r) => acc + r.cogs, 0);
    const totalRevenue = rows.reduce((acc, r) => acc + (r.revenue ?? 0), 0);
    const totalProfit = totalRevenue - totalCogs;
    const marginPct = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    return { totalCogs, totalRevenue, totalProfit, marginPct };
  }, [rows]);

  // Prepare chart data (group by day) - keep your purchased vs sold chart
  const chartData: { date: string; purchased: number; sold: number }[] = [];
  if (stocks && movements) {
    const purchaseMap: Record<string, number> = {};
    stocks.forEach((s: Stock) => {
      const date = new Date(s.created_at).toLocaleDateString("en-US");
      purchaseMap[date] = (purchaseMap[date] || 0) + Number(s.initial_quantity);
    });

    const soldMap: Record<string, number> = {};
    movements.forEach((m: StockMovement) => {
      const date = new Date(m.created_at).toLocaleDateString("en-US");
      soldMap[date] = (soldMap[date] || 0) + Number(m.quantity);
    });

    const allDates = Array.from(
      new Set([...Object.keys(purchaseMap), ...Object.keys(soldMap)]),
    );
    allDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    allDates.forEach((date) => {
      chartData.push({
        date,
        purchased: purchaseMap[date] || 0,
        sold: soldMap[date] || 0,
      });
    });
  }

  return (
    <Drawer
      opened={opened}
      position="right"
      onClose={onClose}
      title="Stock Movements"
      size="xl"
      padding="md"
      overlayProps={{ blur: 3 }}
    >
      {isLoading ? (
        <Center py="xl">
          <Loader color="violet" />
        </Center>
      ) : (
        <Stack gap="md">
          {/* Inventory summary */}
          <Group justify="space-between" mb="sm">
            <Badge color="violet" variant="filled">
              Purchased: {totalPurchased}
            </Badge>
            <Badge color="grape" variant="filled">
              Sold: {totalSold}
            </Badge>
            <Badge color="purple" variant="filled">
              Remaining: {remaining}
            </Badge>
          </Group>

          {/* Finance summary */}
          <Group justify="space-between">
            <Badge color="indigo" variant="light">
              Revenue: ${totals.totalRevenue.toFixed(2)}
            </Badge>
            <Badge color="red" variant="light">
              COGS: ${totals.totalCogs.toFixed(2)}
            </Badge>
            <Badge color="green" variant="filled">
              Profit: ${totals.totalProfit.toFixed(2)}
            </Badge>
            <Badge color="teal" variant="light">
              Margin: {totals.marginPct.toFixed(1)}%
            </Badge>
          </Group>

          <Divider />

          {/* Chart */}
          {chartData.length > 0 && (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} margin={{ top: 10, bottom: 20 }}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="purchased" name="Purchased" fill="#7c3aed" />
                <Bar dataKey="sold" name="Sold" fill="#9d4edd" />
              </BarChart>
            </ResponsiveContainer>
          )}

          <Divider />

          {/* Table */}
          {(!movements || movements.length === 0) && (
            <Text c="dimmed">No stock movements yet.</Text>
          )}

          {movements && movements.length > 0 && (
            <Table
              striped
              highlightOnHover
              verticalSpacing="sm"
              withTableBorder
              withColumnBorders
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Reference</Table.Th>
                  <Table.Th ta="right">Qty</Table.Th>
                  <Table.Th ta="right">Cost / Unit</Table.Th>
                  <Table.Th ta="right">Unit Price</Table.Th>
                  <Table.Th ta="right">COGS</Table.Th>
                  <Table.Th ta="right">Revenue</Table.Th>
                  <Table.Th ta="right">Profit</Table.Th>
                  <Table.Th ta="right">Date</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {rows.map((r) => {
                  const m = r.movement;

                  const reference = m.sales_order_item
                    ? `SO Item #${m.sales_order_item.slice(0, 8)}`
                    : "Manual/Other";

                  return (
                    <Table.Tr key={m.id}>
                      <Table.Td>
                        <Badge color="grape" variant="light">
                          {reference}
                        </Badge>
                      </Table.Td>

                      <Table.Td ta="right" fw={500}>
                        {r.quantity}
                      </Table.Td>

                      <Table.Td ta="right">
                        ${r.costPerUnit.toFixed(2)}
                      </Table.Td>

                      <Table.Td ta="right">
                        {r.unitPrice !== undefined
                          ? `$${r.unitPrice.toFixed(2)}`
                          : "—"}
                      </Table.Td>

                      <Table.Td ta="right" fw={600}>
                        ${r.cogs.toFixed(2)}
                      </Table.Td>

                      <Table.Td ta="right" fw={600}>
                        {r.revenue !== undefined
                          ? `$${r.revenue.toFixed(2)}`
                          : "—"}
                      </Table.Td>

                      <Table.Td ta="right" fw={700}>
                        {r.profit !== undefined
                          ? `$${r.profit.toFixed(2)}`
                          : "—"}
                      </Table.Td>

                      <Table.Td ta="right">
                        {new Date(m.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          )}

          {/* Optional: show warning if some movements couldn't resolve sales items */}
          {rows.some((r) => r.movement.sales_order_item && !r.item) && (
            <Text c="dimmed" size="sm">
              Some sales references couldn’t be loaded (missing permissions,
              deleted items, or API issue).
            </Text>
          )}
        </Stack>
      )}
    </Drawer>
  );
}
