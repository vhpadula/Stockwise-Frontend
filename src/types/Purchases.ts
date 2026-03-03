/* ============================================================
   PURCHASE ORDER STATUS & ACTIONS
   ============================================================ */

export type PurchaseOrderStatus =
  | "draft"
  | "confirmed"
  | "received"
  | "cancelled";

export type ActionType = "confirm" | "receive" | "cancel";

/* ============================================================
   API RESPONSE MODELS (WHAT BACKEND RETURNS)
   ============================================================ */

export interface PurchaseOrder {
  id: string;
  status: PurchaseOrderStatus;

  supplier_name: string;

  // Backend returns monetary values as string
  total_amount: string;

  order_date: string; // YYYY-MM-DD
  created_at: string;

  items: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;

  purchase_order: string; // UUID of purchase order

  product: string; // UUID
  product_name: string;

  lot_number: string;
  expiration_date: string;

  // Backend returns numbers as string
  quantity: string;
  unit_cost: string;
  total_cost: string;

  created_at: string;
}

/* ============================================================
   CREATE / UPDATE DTOs (WHAT FRONTEND SENDS TO BACKEND)
   ============================================================ */

export interface CreatePurchaseOrderItemDTO {
  product: string; // UUID of product
  quantity: number;
  unit_cost: number;
  lot_number?: string;
  expiration_date?: string;
}

export interface CreatePurchaseOrderDTO {
  supplier_name: string;
  order_date: string; // YYYY-MM-DD
  items: CreatePurchaseOrderItemDTO[];
}

export interface UpdatePurchaseOrderDTO {
  supplier_name: string;
  order_date: string;
  items: CreatePurchaseOrderItemDTO[];
}
