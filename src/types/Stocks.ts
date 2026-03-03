export interface Stock {
  id: string;
  product: string; // product UUID
  purchase_order_item?: string | null;
  initial_quantity: string; // Decimal from backend
  remaining_quantity: string;
  unit_cost: string;
  lot_number?: string | null;
  expiration_date?: string | null;
  created_at: string;
}

export interface StockMovement {
  id: string;
  stock: string; // stock UUID
  sales_order_item?: string | null;
  quantity: string;
  cost_per_unit: string;
  created_at: string;
}

export interface StockFilters {
  product?: string;
  expiration_date?: string;
}
