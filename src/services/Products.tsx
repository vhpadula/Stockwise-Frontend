// services/product.service.ts

import { api } from "@/lib/api";
import { Product, CreateProductDTO, UpdateProductDTO } from "@/types/Products";

const BASE_URL = "/api/inventory/products/";

export const ProductsService = {
  // GET all products
  async getAll(): Promise<Product[]> {
    const { data } = await api.get<Product[]>(BASE_URL);
    return data;
  },

  // GET single product
  async getById(id: string): Promise<Product> {
    const { data } = await api.get<Product>(`${BASE_URL}${id}/`);
    return data;
  },

  // CREATE
  async create(payload: CreateProductDTO): Promise<Product> {
    const { data } = await api.post<Product>(BASE_URL, payload);
    return data;
  },

  // UPDATE
  async update(id: string, payload: UpdateProductDTO): Promise<Product> {
    const { data } = await api.patch<Product>(`${BASE_URL}${id}/`, payload);
    return data;
  },

  // DELETE
  async delete(id: string): Promise<void> {
    await api.delete(`${BASE_URL}${id}/`);
  },
};
