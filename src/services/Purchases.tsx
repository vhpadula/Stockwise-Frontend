import api from "@/lib/api"; // your axios instance
import {
  CreatePurchaseOrderDTO,
  CreatePurchaseOrderItemDTO,
  UpdatePurchaseOrderDTO,
} from "@/types/Purchases";

export const PurchasesService = {
  // Orders
  listOrders: async () => {
    const { data } = await api.get("/api/purchases/orders/");
    return data;
  },

  getOrder: async (id: string) => {
    const { data } = await api.get(`/api/purchases/orders/${id}/`);
    return data;
  },

  createOrder: async (payload: CreatePurchaseOrderDTO) => {
    const { data } = await api.post("/api/purchases/orders/", payload);
    return data;
  },

  updateOrder: async (id: string, payload: UpdatePurchaseOrderDTO) => {
    const { data } = await api.patch(`/api/purchases/orders/${id}/`, payload);
    return data;
  },

  confirmOrder: async (id: string) => {
    await api.post(`/api/purchases/orders/${id}/confirm/`);
  },

  receiveOrder: async (id: string) => {
    await api.post(`/api/purchases/orders/${id}/receive/`);
  },

  cancelOrder: async (id: string) => {
    await api.post(`/api/purchases/orders/${id}/cancel/`);
  },

  // Items
  listItems: async (orderId: string) => {
    const { data } = await api.get(
      `/api/purchases/items/?purchase_order=${orderId}`,
    );
    return data;
  },

  createItem: async (payload: CreatePurchaseOrderItemDTO) => {
    const { data } = await api.post("/api/purchases/items/", payload);
    return data;
  },

  deleteItem: async (id: string) => {
    await api.delete(`/api/purchases/items/${id}/`);
  },
};
