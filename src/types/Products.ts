export type BaseUnit = "kg" | "g" | "L" | "ml" | "unit";

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  base_unit: BaseUnit;
  created_at: string;
  updated_at: string;
}

export interface CreateProductDTO {
  name: string;
  description?: string;
  sku: string;
  base_unit: BaseUnit;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  sku?: string;
  base_unit?: BaseUnit;
}
