import api from "@/lib/api";
import { CreateSalesOrderDTO, UpdateSalesOrderDTO } from "@/types/Sales";

export const SalesService = {
  listOrders: async () => {
    const { data } = await api.get("/api/sales/orders/");
    return data;
  },

  getOrder: async (id: string) => {
    const { data } = await api.get(`/api/sales/orders/${id}/`);
    return data;
  },

  createOrder: async (payload: CreateSalesOrderDTO) => {
    const { data } = await api.post("/api/sales/orders/", payload);
    return data;
  },

  updateOrder: async (id: string, payload: UpdateSalesOrderDTO) => {
    const { data } = await api.patch(`/api/sales/orders/${id}/`, payload);
    return data;
  },

  confirmOrder: async (id: string) => {
    await api.post(`/api/sales/orders/${id}/confirm/`);
  },

  fulfillOrder: async (id: string) => {
    await api.post(`/api/sales/orders/${id}/fulfill/`);
  },

  cancelOrder: async (id: string) => {
    await api.post(`/api/sales/orders/${id}/cancel/`);
  },
};
