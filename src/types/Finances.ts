// 🔹 Financial Summary
export interface FinancialSummary {
  total_revenue: string; // Decimal from backend
  total_costs: string; // COGS
  total_profit: string;
  profit_margin: string; // percentage
}

// 🔹 Product Financial Breakdown
export interface ProductFinancial {
  product_id: string;
  product_name: string;
  revenue: string;
  cogs: string;
  profit: string;
  profit_margin: string;
}

// 🔹 Timeline Data
export type TimelinePeriod = "daily" | "weekly" | "monthly";

export interface FinancialTimelineItem {
  period: string; // e.g. 2025-03-01 or 2025-W10
  revenue: string;
  costs: string;
  profit: string;
}

// 🔹 Top Products
export interface TopProduct {
  product_id: string;
  product_name: string;
  revenue: string;
  profit: string;
}
