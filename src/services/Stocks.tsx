// services/stock.service.ts

import { api } from "@/lib/api";
import { Stock, StockMovement, StockFilters } from "@/types/Stocks";

const STOCK_URL = "/api/inventory/stocks/";
const MOVEMENTS_URL = "/api/inventory/stock-movements/";

export const StocksService = {
  // GET all stocks (with optional filters)
  async getAll(filters?: StockFilters): Promise<Stock[]> {
    const { data } = await api.get<Stock[]>(STOCK_URL, {
      params: filters,
    });
    return data;
  },

  // GET stock by ID
  async getById(id: string): Promise<Stock> {
    const { data } = await api.get<Stock>(`${STOCK_URL}${id}/`);
    return data;
  },

  // UPDATE stock metadata (lot number / expiration)
  async updateMetadata(
    id: string,
    payload: Partial<Pick<Stock, "lot_number" | "expiration_date">>,
  ): Promise<Stock> {
    const { data } = await api.patch<Stock>(`${STOCK_URL}${id}/`, payload);
    return data;
  },

  // GET stock movements
  async getMovements(params?: {
    product?: string;
    stock?: string;
    sales_order_item?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<StockMovement[]> {
    const { data } = await api.get<StockMovement[]>(MOVEMENTS_URL, { params });
    return data;
  },
};
