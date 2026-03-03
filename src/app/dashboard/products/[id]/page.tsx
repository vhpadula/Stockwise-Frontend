"use client";

import {
  Title,
  Paper,
  Stack,
  Loader,
  Center,
  Text,
  Button,
  Group,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { ProductsService } from "@/services/Products";
import { ProductForm } from "@/components";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => ProductsService.getById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (isError || !product) {
    return (
      <Center py="xl">
        <Text c="red">Product not found.</Text>
      </Center>
    );
  }

  return (
    <Stack>
      {/* Header */}
      <Group justify="space-between">
        <Title order={2}>Edit Product</Title>

        <Button
          variant="subtle"
          leftSection={<ArrowLeftIcon className="w-4 h-4" />}
          onClick={() => router.push("/dashboard/products")}
        >
          Back
        </Button>
      </Group>

      {/* Form */}
      <Paper p="lg" radius="md" withBorder>
        <ProductForm initialValues={product} productId={product.id} />
      </Paper>
    </Stack>
  );
}
