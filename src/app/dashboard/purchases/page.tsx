"use client";

import { Button, Center, Loader } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { PurchasesService } from "@/services/Purchases";
import { PurchaseOrder } from "@/types/Purchases";
import { useRouter } from "next/navigation";
import {
  PurchaseActionModal,
  PurchaseDetailsDrawer,
  PurchasesTable,
} from "@/components";
import { ActionType } from "@/types/Purchases";

export default function PurchasesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(
    null,
  );

  const [drawerOpened, drawerHandlers] = useDisclosure(false);
  const [modalOpened, modalHandlers] = useDisclosure(false);

  const [actionType, setActionType] = useState<ActionType | null>(null);

  const [actionOrderId, setActionOrderId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["purchase-orders"],
    queryFn: PurchasesService.listOrders,
  });

  const orders = data ?? [];

  const confirmMutation = useMutation({
    mutationFn: PurchasesService.confirmOrder,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] }),
  });

  const receiveMutation = useMutation({
    mutationFn: PurchasesService.receiveOrder,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] }),
  });

  const cancelMutation = useMutation({
    mutationFn: PurchasesService.cancelOrder,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] }),
  });

  const handleView = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    drawerHandlers.open();
  };

  const handleActionRequest = (type: ActionType, orderId: string) => {
    setActionType(type);
    setActionOrderId(orderId);
    modalHandlers.open();
  };

  const handleConfirmAction = (type: ActionType, orderId: string) => {
    if (type === "confirm") confirmMutation.mutate(orderId);
    if (type === "receive") receiveMutation.mutate(orderId);
    if (type === "cancel") cancelMutation.mutate(orderId);

    modalHandlers.close();
  };

  if (isLoading)
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );

  return (
    <>
      <Button mb="lg" onClick={() => router.push("/dashboard/purchases/new")}>
        New Purchase Order
      </Button>
      <PurchasesTable
        orders={orders}
        onView={handleView}
        onAction={handleActionRequest}
      />

      <PurchaseDetailsDrawer
        order={selectedOrder}
        opened={drawerOpened}
        onClose={drawerHandlers.close}
      />

      <PurchaseActionModal
        opened={modalOpened}
        actionType={actionType}
        orderId={actionOrderId}
        onClose={modalHandlers.close}
        onConfirm={handleConfirmAction}
        isLoading={
          confirmMutation.isPending ||
          receiveMutation.isPending ||
          cancelMutation.isPending
        }
      />
    </>
  );
}
