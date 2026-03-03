// services/Finances.ts
import { api } from "@/lib/api";
import {
  FinancialSummary,
  ProductFinancial,
  FinancialTimelineItem,
  TopProduct,
  TimelineGroupBy,
} from "@/types/Finances";

const BASE_URL = "/api/financials/";

export const FinancesService = {
  // Financial overview (note: API expects date_from / date_to)
  async getSummary(params?: {
    date_from?: string;
    date_to?: string;
  }): Promise<FinancialSummary> {
    const { data } = await api.get<FinancialSummary>(`${BASE_URL}summary/`, {
      params,
    });
    return data;
  },

  // Financials per product
  async getProducts(params?: {
    product?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<ProductFinancial[]> {
    const { data } = await api.get<ProductFinancial[]>(`${BASE_URL}products/`, {
      params,
    });
    return data;
  },

  // Timeline (note: API uses group_by instead of 'period')
  async getTimeline(params?: {
    group_by?: TimelineGroupBy;
    product?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<FinancialTimelineItem[]> {
    const { data } = await api.get<FinancialTimelineItem[]>(
      `${BASE_URL}timeline/`,
      { params },
    );
    return data;
  },

  // Top products
  async getTopProducts(params?: {
    limit?: number;
    date_from?: string;
    date_to?: string;
  }): Promise<TopProduct[]> {
    const { data } = await api.get<TopProduct[]>(`${BASE_URL}top-products/`, {
      params,
    });
    return data;
  },
};
