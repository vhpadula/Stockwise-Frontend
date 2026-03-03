/* ============================================================
   SALES ORDER STATUS & ACTIONS
============================================================ */

export type SalesOrderStatus =
  | "draft"
  | "confirmed"
  | "fulfilled"
  | "cancelled";

export type SalesActionType = "confirm" | "fulfill" | "cancel";

/* ============================================================
   API RESPONSE MODELS
============================================================ */

export interface SalesOrder {
  id: string;
  status: SalesOrderStatus;

  customer_name: string;

  total_revenue: string;

  order_date: string;
  created_at: string;

  items: SalesOrderItem[];
}

export interface SalesOrderItem {
  id: string;

  sales_order: string;

  product: string;
  product_name: string;

  quantity: string;
  unit_price: string;
  total_price: string;

  created_at: string;
}

/* ============================================================
   DTOs
============================================================ */

export interface CreateSalesOrderItemDTO {
  product: string;
  quantity: number;
  unit_price: number;
}

export interface CreateSalesOrderDTO {
  customer_name: string;
  order_date: string;
  items: CreateSalesOrderItemDTO[];
}

export interface UpdateSalesOrderDTO {
  customer_name: string;
  order_date: string;
  items: CreateSalesOrderItemDTO[];
}
