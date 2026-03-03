// types/Finances.ts

// Summary returned by backend (note field names)
export interface FinancialSummary {
  total_purchased_quantity: string; // decimal as string
  total_purchase_value: string; // monetary string
  total_sold_quantity: string;
  total_sales_value: string;
  total_profit: string;
  profit_margin_percent: string; // percent as string e.g. "-1.90"
}

// Per-product financial breakdown (fields as returned)
export interface ProductFinancial {
  product_id: string;
  product_name: string;
  quantity_sold: string; // decimal string
  sales_revenue: string; // monetary string
  cogs: string; // monetary string
  profit: string; // monetary string
  profit_margin_percent: string; // percent string
}

// Timeline grouping (API uses purchased_*, purchase_*, sold_*, sales_*, profit)
export type TimelineGroupBy = "day" | "week" | "month";

export interface FinancialTimelineItem {
  period: string; // e.g. "2026-03-02" or "2025-W10"
  purchased_quantity: string;
  purchase_value: string;
  sold_quantity: string;
  sales_value: string;
  profit: string;
}

// Top product item (API sometimes returns numeric profit, be permissive)
export interface TopProduct {
  product_id: string;
  product_name: string;
  revenue?: string | number;
  profit: number | string;
}
