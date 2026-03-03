"use client";

import {
  Button,
  Group,
  TextInput,
  NumberInput,
  Select,
  Stack,
  Card,
  ActionIcon,
  Divider,
  Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon, TrashIcon } from "@heroicons/react/16/solid";

import { ProductsService } from "@/services/Products";
import { Product } from "@/types/Products";
import {
  CreatePurchaseOrderDTO,
  CreatePurchaseOrderItemDTO,
} from "@/types/Purchases";

interface PurchaseOrderFormProps {
  initialValues?: CreatePurchaseOrderDTO;
  onSubmit: (values: CreatePurchaseOrderDTO) => void;
  isLoading?: boolean;
}

export default function PurchaseOrderForm({
  initialValues,
  onSubmit,
  isLoading = false,
}: PurchaseOrderFormProps) {
  /* ============================================================
     Fetch Products
  ============================================================ */

  const { data: products = [], isLoading: loadingProducts } = useQuery<
    Product[]
  >({
    queryKey: ["products"],
    queryFn: ProductsService.getAll,
  });

  const productOptions = products.map((product) => ({
    value: product.id,
    label: `${product.name} (${product.sku})`,
  }));

  /* ============================================================
     Form Setup
  ============================================================ */

  const form = useForm<CreatePurchaseOrderDTO>({
    initialValues: initialValues ?? {
      supplier_name: "",
      order_date: new Date().toISOString().split("T")[0],
      items: [],
    },

    validate: {
      supplier_name: (value) =>
        value.trim().length === 0 ? "Supplier name is required" : null,

      order_date: (value) => (!value ? "Order date is required" : null),
    },
  });

  /* ============================================================
     Helpers
  ============================================================ */

  const addItem = () => {
    const newItem: CreatePurchaseOrderItemDTO = {
      product: "",
      quantity: 1,
      unit_cost: 0,
      lot_number: "",
      expiration_date: "",
    };

    form.insertListItem("items", newItem);
  };

  const removeItem = (index: number) => {
    form.removeListItem("items", index);
  };

  const calculateTotal = () => {
    return form.values.items.reduce(
      (acc, item) => acc + item.quantity * item.unit_cost,
      0,
    );
  };

  /* ============================================================
     Render
  ============================================================ */

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        if (values.items.length === 0) {
          form.setFieldError("items", "At least one item is required");
          return;
        }

        onSubmit(values);
      })}
    >
      <Stack gap="lg">
        <Text size="lg" fw={600}>
          Purchase Order Information
        </Text>

        <TextInput
          label="Supplier Name"
          placeholder="e.g. Acme Dairy"
          required
          {...form.getInputProps("supplier_name")}
        />

        {/* ✅ Mantine v7 returns string | null */}
        <DateInput
          label="Order Date"
          required
          value={form.values.order_date || null}
          onChange={(value) => form.setFieldValue("order_date", value ?? "")}
        />

        <Divider />

        <Group justify="space-between">
          <Text size="lg" fw={600}>
            Items
          </Text>

          <Button
            leftSection={<PlusIcon className="w-4 h-4" />}
            variant="light"
            onClick={addItem}
          >
            Add Item
          </Button>
        </Group>

        {form.values.items.map((_, index) => (
          <Card key={index} withBorder shadow="sm" radius="md">
            <Stack gap="md">
              <Group grow>
                <Select
                  label="Product"
                  placeholder="Select product"
                  data={productOptions}
                  searchable
                  required
                  disabled={loadingProducts}
                  {...form.getInputProps(`items.${index}.product`)}
                />

                <NumberInput
                  label="Quantity"
                  min={0}
                  required
                  {...form.getInputProps(`items.${index}.quantity`)}
                />

                <NumberInput
                  label="Unit Cost"
                  min={0}
                  decimalScale={2}
                  fixedDecimalScale
                  required
                  {...form.getInputProps(`items.${index}.unit_cost`)}
                />
              </Group>

              <Group grow>
                <TextInput
                  label="Lot Number"
                  placeholder="Optional"
                  {...form.getInputProps(`items.${index}.lot_number`)}
                />

                {/* ✅ No Date conversion needed */}
                <DateInput
                  label="Expiration Date"
                  value={form.values.items[index].expiration_date || null}
                  onChange={(value) =>
                    form.setFieldValue(
                      `items.${index}.expiration_date`,
                      value ?? "",
                    )
                  }
                />
              </Group>

              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Line Total: $
                  {(
                    form.values.items[index].quantity *
                    form.values.items[index].unit_cost
                  ).toFixed(2)}
                </Text>

                <ActionIcon
                  color="red"
                  variant="light"
                  onClick={() => removeItem(index)}
                >
                  <TrashIcon className="w-4 h-4" />
                </ActionIcon>
              </Group>
            </Stack>
          </Card>
        ))}

        <Divider />

        <Group justify="flex-end">
          <Text fw={600}>Total Amount: ${calculateTotal().toFixed(2)}</Text>
        </Group>

        <Group justify="flex-end">
          <Button type="submit" loading={isLoading}>
            Save Purchase Order
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
