"use client";

import {
  Title,
  Group,
  Button,
  TextInput,
  Paper,
  Stack,
  Loader,
  Center,
  Text,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ProductsService } from "@/services/Products";
import ProductsTable from "@/components/Products/ProductsTable";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/16/solid";

export default function ProductsPage() {
  const [search, setSearch] = useState("");

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: ProductsService.getAll,
  });

  // 🔎 Client-side filtering (can later move to backend)
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  return (
    <Stack>
      {/* Header */}
      <Group justify="space-between">
        <Title order={2}>Products</Title>

        <Link href="/dashboard/products/new">
          <Button leftSection={<PlusIcon />}>Create Product</Button>
        </Link>
      </Group>

      {/* Search */}
      <Paper p="md" radius="md" withBorder>
        <TextInput
          placeholder="Search by name or SKU..."
          leftSection={<MagnifyingGlassIcon />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      </Paper>

      {/* Content */}
      <Paper p="md" radius="md" withBorder>
        {isLoading ? (
          <Center py="xl">
            <Loader />
          </Center>
        ) : filteredProducts.length === 0 ? (
          <Center py="xl">
            <Text c="dimmed">
              No products found. Create your first product.
            </Text>
          </Center>
        ) : (
          <ProductsTable products={filteredProducts} />
        )}
      </Paper>
    </Stack>
  );
}
