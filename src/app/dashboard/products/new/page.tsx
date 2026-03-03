"use client";

import { Title, Paper, Stack, Button, Group } from "@mantine/core";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components";
import ArrowLeftIcon from "@heroicons/react/24/solid/esm/ArrowLeftIcon";

export default function CreateProductPage() {
  const router = useRouter();

  return (
    <Stack>
      {/* Header */}
      <Group justify="space-between">
        <Title order={2}>Create Product</Title>

        <Button
          variant="subtle"
          leftSection={<ArrowLeftIcon className="w-4 h-4" />}
          onClick={() => router.push("/dashboard/products")}
        >
          Back
        </Button>
      </Group>

      {/* Form Container */}
      <Paper p="lg" radius="md" withBorder>
        <ProductForm />
      </Paper>
    </Stack>
  );
}
