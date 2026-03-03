"use client";

import {
  Stack,
  Title,
  Paper,
  Loader,
  Center,
  Text,
  Group,
  Button,
} from "@mantine/core";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductsService } from "@/services/Products";
import { StocksService } from "@/services/Stocks";
import { FinancesService } from "@/services/Finances";
import { ProductFinancials, ProductDetailStocksTable } from "@/components";
import { StockMovementsDrawer } from "@/components";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [movementsDrawerOpen, setMovementsDrawerOpen] = useState(false);

  // 🔹 Fetch product
  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: () => ProductsService.getById(id),
    enabled: !!id,
  });

  // 🔹 Fetch stocks for this product
  const { data: stocks, isLoading: loadingStocks } = useQuery({
    queryKey: ["stocks", id],
    queryFn: () => StocksService.getAll({ product: id }),
    enabled: !!id,
  });

  // 🔹 Fetch product financials
  const { data: productFinancials, isLoading: loadingFinance } = useQuery({
    queryKey: ["financials", "product", id],
    queryFn: async () => {
      const allProducts = await FinancesService.getProducts();
      return allProducts.find((p) => p.product_id === id);
    },
    enabled: !!id,
  });

  const isLoading = loadingProduct || loadingStocks || loadingFinance;

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (!product) {
    return (
      <Center py="xl">
        <Text c="red">Product not found.</Text>
      </Center>
    );
  }

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between">
        <Title order={2}>{product.name}</Title>
        <Text c="dimmed">SKU: {product.sku}</Text>
      </Group>
      {product.description && <Text>{product.description}</Text>}

      {/* Financial Overview */}
      {productFinancials && <ProductFinancials financial={productFinancials} />}

      {/* Stocks Table */}
      <Paper p="md" radius="md" withBorder>
        <Group justify="apart" mb="sm">
          <Title order={4}>Stock Lots</Title>
          <Button
            size="xs"
            variant="outline"
            onClick={() => setMovementsDrawerOpen(true)}
          >
            View All Movements
          </Button>
        </Group>

        <ProductDetailStocksTable stocks={stocks || []} />
      </Paper>

      {/* Stock Movements Drawer for the entire product */}
      {id && (
        <StockMovementsDrawer
          productId={id}
          opened={movementsDrawerOpen}
          onClose={() => setMovementsDrawerOpen(false)}
        />
      )}
    </Stack>
  );
}
