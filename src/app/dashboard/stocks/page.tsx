"use client";

import {
  Title,
  Stack,
  Group,
  Paper,
  Select,
  Loader,
  Center,
  Text,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { StocksService } from "@/services/Stocks";
import { ProductsService } from "@/services/Products";
import { StocksTable } from "@/components";

export default function StocksPage() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: ProductsService.getAll,
  });

  const { data: stocks, isLoading } = useQuery({
    queryKey: ["stocks", selectedProduct],
    queryFn: () =>
      StocksService.getAll(
        selectedProduct ? { product: selectedProduct } : undefined,
      ),
  });

  return (
    <Stack>
      <Title order={2}>Stocks</Title>

      {/* Filters */}
      <Paper p="md" withBorder radius="md">
        <Group>
          <Select
            placeholder="Filter by product"
            data={
              products?.map((p) => ({
                value: p.id,
                label: p.name,
              })) || []
            }
            value={selectedProduct}
            onChange={setSelectedProduct}
            clearable
          />
        </Group>
      </Paper>

      {/* Table */}
      <Paper p="md" withBorder radius="md">
        {isLoading ? (
          <Center py="xl">
            <Loader />
          </Center>
        ) : !stocks || stocks.length === 0 ? (
          <Center py="xl">
            <Text c="dimmed">No stock found.</Text>
          </Center>
        ) : (
          <StocksTable stocks={stocks} products={products || []} />
        )}
      </Paper>
    </Stack>
  );
}
