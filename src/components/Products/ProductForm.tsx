"use client";

import { TextInput, Select, Button, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductsService } from "@/services/Products";
import {
  CreateProductDTO,
  UpdateProductDTO,
  Product,
  BaseUnit,
} from "@/types/Products";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

interface Props {
  initialValues?: Product;
  productId?: string;
}

export default function ProductForm({ initialValues, productId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      sku: "",
      base_unit: "unit" as BaseUnit,
    },
  });

  // 👇 Populate form once data is loaded
  useEffect(() => {
    if (initialValues) {
      form.setValues({
        name: initialValues.name,
        description: initialValues.description || "",
        sku: initialValues.sku,
        base_unit: initialValues.base_unit as BaseUnit,
      });
    }
  }, [initialValues]);

  const mutation = useMutation({
    mutationFn: (values: CreateProductDTO | UpdateProductDTO) =>
      productId
        ? ProductsService.update(productId, values)
        : ProductsService.create(values as CreateProductDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      router.push("/dashboard/products");
    },
    onError: (error: AxiosError) => {
      const data = error?.response?.data as { message?: string[] };

      if (data?.message) {
        form.setFieldError("sku", data.message);
      }
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
      <Stack>
        <TextInput label="Name" required {...form.getInputProps("name")} />

        <TextInput label="SKU" required {...form.getInputProps("sku")} />

        <TextInput label="Description" {...form.getInputProps("description")} />

        <Select
          label="Base Unit"
          data={["kg", "g", "L", "ml", "unit"]}
          {...form.getInputProps("base_unit")}
        />

        <Button type="submit" loading={mutation.isPending}>
          {productId ? "Update Product" : "Create Product"}
        </Button>
      </Stack>
    </form>
  );
}
