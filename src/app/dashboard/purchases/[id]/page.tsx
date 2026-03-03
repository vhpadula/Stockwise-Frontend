"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { Loader, Center } from "@mantine/core";

import { PurchaseOrderForm } from "@/components";
import { PurchasesService } from "@/services/Purchases";
import {
  CreatePurchaseOrderDTO,
  PurchaseOrderItem,
  UpdatePurchaseOrderDTO,
} from "@/types/Purchases";
import { AxiosError } from "axios";

export default function EditPurchaseOrderPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();

  const id = params.id as string;

  /* ============================================================
     Fetch Order
  ============================================================ */

  const { data: order, isLoading } = useQuery({
    queryKey: ["purchase-order", id],
    queryFn: () => PurchasesService.getOrder(id),
    enabled: !!id,
  });

  /* ============================================================
     Update Mutation
  ============================================================ */

  const updateMutation = useMutation({
    mutationFn: (data: UpdatePurchaseOrderDTO) =>
      PurchasesService.updateOrder(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      queryClient.invalidateQueries({ queryKey: ["purchase-order", id] });

      notifications.show({
        title: "Purchase Order Updated",
        message: "The purchase order was successfully updated.",
        color: "green",
      });

      router.push("/dashboard/purchases");
    },

    onError: (error: AxiosError<{ message: string }>) => {
      notifications.show({
        title: "Error",
        message:
          error?.response?.data?.message ||
          "Something went wrong while updating the purchase order.",
        color: "red",
      });
    },
  });

  /* ============================================================
     Loading State
  ============================================================ */

  if (isLoading || !order) {
    return (
      <Center h={400}>
        <Loader />
      </Center>
    );
  }

  /* ============================================================
     Prevent Editing If Not Draft (Optional Best Practice)
  ============================================================ */

  if (order.status !== "draft") {
    notifications.show({
      title: "Cannot Edit",
      message: "Only draft purchase orders can be edited.",
      color: "yellow",
    });

    router.push("/dashboard/purchases");
    return null;
  }

  /* ============================================================
     Map API Response → Form DTO
  ============================================================ */

  const mappedInitialValues: CreatePurchaseOrderDTO = {
    supplier_name: order.supplier_name,
    order_date: order.order_date,
    items: order.items.map((item: PurchaseOrderItem) => ({
      product: item.product,
      quantity: Number(item.quantity),
      unit_cost: Number(item.unit_cost),
      lot_number: item.lot_number || "",
      expiration_date: item.expiration_date || "",
    })),
  };

  /* ============================================================
     Render
  ============================================================ */

  return (
    <PurchaseOrderForm
      initialValues={mappedInitialValues}
      onSubmit={(values) => updateMutation.mutate(values)}
      isLoading={updateMutation.isPending}
    />
  );
}
