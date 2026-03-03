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
import { useQuery } from "@tanstack/react-query";
import { StocksService } from "@/services/Stocks";
import { StockMovement, Stock } from "@/types/Stocks";
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

export default function StockMovementsDrawer({
  stockId,
  productId,
  opened,
  onClose,
}: Props) {
  // Fetch stock movements (sales)
  const { data: movements, isLoading: loadingMovements } = useQuery({
    queryKey: ["stockMovements", stockId || productId],
    queryFn: () =>
      StocksService.getMovements({
        stock: stockId,
        product: productId,
      }),
    enabled: opened,
  });

  // Fetch stocks for summary and purchase history
  const { data: stocks, isLoading: loadingStocks } = useQuery({
    queryKey: ["stocks", stockId || productId],
    queryFn: async () => {
      if (stockId) {
        const stock = await StocksService.getById(stockId);
        return [stock];
      } else if (productId) {
        return await StocksService.getAll({ product: productId });
      }
      return [];
    },
    enabled: opened,
  });

  const isLoading = loadingMovements || loadingStocks;

  // Compute summary
  const totalPurchased = stocks
    ? stocks.reduce((acc, s: Stock) => acc + Number(s.initial_quantity), 0)
    : 0;
  const totalSold = movements
    ? movements.reduce((acc, m: StockMovement) => acc + Number(m.quantity), 0)
    : 0;
  const remaining = totalPurchased - totalSold;

  // Prepare chart data (group by day)
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
          {/* 🔹 Summary */}
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

          <Divider />

          {/* 🔹 Chart */}
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
          {/* 🔹 Table */}
          {(!movements || movements.length === 0) && (
            <Text c="dimmed">No sales movements yet.</Text>
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
                  <Table.Th ta="right">Quantity</Table.Th>
                  <Table.Th ta="right">Cost / Unit</Table.Th>
                  <Table.Th ta="right">Total Cost</Table.Th>
                  <Table.Th ta="right">Date</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {movements.map((m: StockMovement) => {
                  const quantity = Number(m.quantity);
                  const costPerUnit = Number(m.cost_per_unit);
                  const totalCost = quantity * costPerUnit;
                  const reference = `SO #${m.sales_order_item}`;

                  return (
                    <Table.Tr key={m.id}>
                      <Table.Td>
                        <Badge color="grape" variant="light">
                          {reference}
                        </Badge>
                      </Table.Td>

                      <Table.Td ta="right" fw={500}>
                        {quantity}
                      </Table.Td>

                      <Table.Td ta="right">${costPerUnit.toFixed(2)}</Table.Td>

                      <Table.Td ta="right" fw={600}>
                        ${totalCost.toFixed(2)}
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
        </Stack>
      )}
    </Drawer>
  );
}
