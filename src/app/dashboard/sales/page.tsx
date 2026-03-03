"use client";

import { useState } from "react";
import { Button, Group, Stack, Title } from "@mantine/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { SalesService } from "@/services/Sales";
import { SalesOrder, SalesActionType } from "@/types/Sales";

import { SalesTable, SalesDetailsDrawer, SalesActionModal } from "@/components";
import { AxiosError } from "axios";

export default function SalesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [actionType, setActionType] = useState<SalesActionType | null>(null);
  const [actionOrderId, setActionOrderId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  /* ============================================================
     QUERY
  ============================================================ */

  const { data: orders, isLoading } = useQuery({
    queryKey: ["sales-orders"],
    queryFn: SalesService.listOrders,
  });

  /* ============================================================
     MUTATIONS
  ============================================================ */

  const confirmMutation = useMutation({
    mutationFn: SalesService.confirmOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      closeActionModal();
    },
    onError: (error: AxiosError<{ error: string }>) => {
      const message =
        error?.response?.data?.error || "Failed to confirm order.";
      setActionError(message);
    },
  });

  const fulfillMutation = useMutation({
    mutationFn: SalesService.fulfillOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      closeActionModal();
    },
    onError: (error: AxiosError<{ error: string }>) => {
      const message =
        error?.response?.data?.error || "Failed to fulfill order.";
      setActionError(message);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: SalesService.cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      closeActionModal();
    },
    onError: (error: AxiosError<{ error: string }>) => {
      const message = error?.response?.data?.error || "Failed to cancel order.";
      setActionError(message);
    },
  });

  /* ============================================================
     HANDLERS
  ============================================================ */

  const openDrawer = (order: SalesOrder) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setSelectedOrder(null);
    setDrawerOpen(false);
  };

  const openActionModal = (type: SalesActionType, id: string) => {
    setActionError(null); // clear previous error
    setActionType(type);
    setActionOrderId(id);
  };

  const closeActionModal = () => {
    setActionType(null);
    setActionOrderId(null);
    setActionError(null);
  };

  const handleConfirmAction = () => {
    if (!actionType || !actionOrderId) return;

    if (actionType === "confirm") {
      confirmMutation.mutate(actionOrderId);
    }

    if (actionType === "fulfill") {
      fulfillMutation.mutate(actionOrderId);
    }

    if (actionType === "cancel") {
      cancelMutation.mutate(actionOrderId);
    }
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Sales Orders</Title>

        <Button onClick={() => router.push("/dashboard/sales/new")}>
          New Sales Order
        </Button>
      </Group>

      <SalesTable
        orders={orders || []}
        onView={openDrawer}
        onAction={openActionModal}
      />

      <SalesDetailsDrawer
        opened={drawerOpen}
        onClose={closeDrawer}
        order={selectedOrder}
      />

      <SalesActionModal
        opened={!!actionType}
        onClose={closeActionModal}
        actionType={actionType}
        orderId={actionOrderId}
        error={actionError}
        onConfirm={handleConfirmAction}
        isLoading={
          confirmMutation.isPending ||
          fulfillMutation.isPending ||
          cancelMutation.isPending
        }
      />
    </Stack>
  );
}
