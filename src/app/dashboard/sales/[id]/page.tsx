"use client";

import { useParams, useRouter } from "next/navigation";
import { Stack, Title, Loader, Center } from "@mantine/core";
import { useQuery, useMutation } from "@tanstack/react-query";

import { SalesService } from "@/services/Sales";
import { UpdateSalesOrderDTO } from "@/types/Sales";
import { SalesOrderForm } from "@/components";
import { SalesOrderItem } from "@/types/Sales";

export default function EditSalesOrderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  /* ============================================================
     FETCH ORDER
  ============================================================ */

  const { data: order, isLoading } = useQuery({
    queryKey: ["sales-order", id],
    queryFn: () => SalesService.getOrder(id),
    enabled: !!id,
  });

  /* ============================================================
     UPDATE
  ============================================================ */

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateSalesOrderDTO) =>
      SalesService.updateOrder(id, payload),
    onSuccess: () => {
      router.push("/dashboard/sales");
    },
  });

  /* ============================================================
     LOADING
  ============================================================ */

  if (isLoading || !order) {
    return (
      <Center h={300}>
        <Loader />
      </Center>
    );
  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <Stack>
      <Title order={2}>Edit Sales Order</Title>

      <SalesOrderForm
        initialValues={{
          customer_name: order.customer_name,
          order_date: order.order_date,
          items: order.items.map((item: SalesOrderItem) => ({
            product: item.product,
            quantity: Number(item.quantity),
            unit_price: Number(item.unit_price),
          })),
        }}
        onSubmit={(values) => updateMutation.mutate(values)}
        isLoading={updateMutation.isPending}
      />
    </Stack>
  );
}
