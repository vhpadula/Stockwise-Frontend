"use client";

import { Stack, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { SalesService } from "@/services/Sales";
import { CreateSalesOrderDTO } from "@/types/Sales";
import { SalesOrderForm } from "@/components";

export default function NewSalesOrderPage() {
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: (payload: CreateSalesOrderDTO) =>
      SalesService.createOrder(payload),
    onSuccess: (data) => {
      router.push(`/dashboard/sales/${data.id}`);
    },
  });

  return (
    <Stack>
      <Title order={2}>New Sales Order</Title>

      <SalesOrderForm
        onSubmit={(values) => createMutation.mutate(values)}
        isLoading={createMutation.isPending}
      />
    </Stack>
  );
}
