"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

import { PurchaseOrderForm } from "@/components";
import { PurchasesService } from "@/services/Purchases";
import { CreatePurchaseOrderDTO } from "@/types/Purchases";
import { AxiosError } from "axios";

export default function CreatePurchaseOrderPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  /* ============================================================
     Mutation
  ============================================================ */

  const createMutation = useMutation({
    mutationFn: (data: CreatePurchaseOrderDTO) =>
      PurchasesService.createOrder(data),

    onSuccess: () => {
      // Refresh purchase orders list
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });

      notifications.show({
        title: "Purchase Order Created",
        message: "The purchase order was successfully created.",
        color: "green",
      });

      router.push("/dashboard/purchases");
    },

    onError: (error: AxiosError<{ message: string }>) => {
      notifications.show({
        title: "Error",
        message:
          error?.response?.data?.message ||
          "Something went wrong while creating the purchase order.",
        color: "red",
      });
    },
  });

  /* ============================================================
     Render
  ============================================================ */

  return (
    <div>
      <PurchaseOrderForm
        onSubmit={(values: CreatePurchaseOrderDTO) =>
          createMutation.mutate(values)
        }
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
