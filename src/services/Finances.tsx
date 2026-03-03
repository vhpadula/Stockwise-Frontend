// services/finance.service.ts

import { api } from "@/lib/api";
import {
  FinancialSummary,
  ProductFinancial,
  FinancialTimelineItem,
  TopProduct,
  TimelinePeriod,
} from "@/types/Finances";

const BASE_URL = "/api/financials/";

export const FinancesService = {
  // 🔹 Financial Overview
  async getSummary(params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<FinancialSummary> {
    const { data } = await api.get<FinancialSummary>(`${BASE_URL}summary/`, {
      params,
    });
    return data;
  },

  // 🔹 Financials per Product
  async getProducts(params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<ProductFinancial[]> {
    const { data } = await api.get<ProductFinancial[]>(`${BASE_URL}products/`, {
      params,
    });
    return data;
  },

  // 🔹 Timeline
  async getTimeline(params?: {
    period?: TimelinePeriod;
    product?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<FinancialTimelineItem[]> {
    const { data } = await api.get<FinancialTimelineItem[]>(
      `${BASE_URL}timeline/`,
      { params },
    );
    return data;
  },

  // 🔹 Top Products
  async getTopProducts(params?: {
    limit?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<TopProduct[]> {
    const { data } = await api.get<TopProduct[]>(`${BASE_URL}top-products/`, {
      params,
    });
    return data;
  },
};
