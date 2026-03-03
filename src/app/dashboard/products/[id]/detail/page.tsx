"use client";

import {
  Stack,
  Title,
  Paper,
  Loader,
  Center,
  Text,
  Group,
} from "@mantine/core";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ProductsService } from "@/services/Products";
import { StocksService } from "@/services/Stocks";
import { FinancesService } from "@/services/Finances";
import { ProductFinancials, ProductDetailStocksTable } from "@/components";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

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
        <Title order={4}>Stock Lots</Title>
        <ProductDetailStocksTable stocks={stocks || []} />
      </Paper>
    </Stack>
  );
}
