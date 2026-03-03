// services/Sales.ts
import api from "@/lib/api";
import {
  CreateSalesOrderDTO,
  UpdateSalesOrderDTO,
  SalesOrderItem,
  SalesOrderItemFilters,
} from "@/types/Sales";

export const SalesService = {
  // Orders
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

  // Items
  listItems: async (filters?: SalesOrderItemFilters) => {
    const { data } = await api.get<SalesOrderItem[]>("/api/sales/items/", {
      params: filters,
    });
    return data;
  },

  getItem: async (id: string) => {
    const { data } = await api.get<SalesOrderItem>(`/api/sales/items/${id}/`);
    return data;
  },

  listItemsByOrder: async (salesOrderId: string) => {
    const { data } = await api.get<SalesOrderItem[]>(
      `/api/sales/items/by-order/${salesOrderId}/`,
    );
    return data;
  },

  updateItem: async (
    id: string,
    payload: Partial<Pick<SalesOrderItem, "quantity" | "unit_price">>,
  ) => {
    const { data } = await api.patch<SalesOrderItem>(
      `/api/sales/items/${id}/`,
      payload,
    );
    return data;
  },

  deleteItem: async (id: string) => {
    await api.delete(`/api/sales/items/${id}/`);
  },
};
