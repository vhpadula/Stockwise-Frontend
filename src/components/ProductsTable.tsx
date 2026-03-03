"use client";

import { Table, ActionIcon, Group, Badge, Menu } from "@mantine/core";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductsService } from "@/services/Products";
import { Product } from "@/types/Products";
import {
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";

interface Props {
  products: Product[];
}

export default function ProductsTable({ products }: Props) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: ProductsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Description</Table.Th>
          <Table.Th>SKU</Table.Th>
          <Table.Th>Unit</Table.Th>
          <Table.Th style={{ width: 50 }} />
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {products.map((product) => (
          <Table.Tr key={product.id}>
            <Table.Td>{product.name}</Table.Td>
            <Table.Td>{product.description}</Table.Td>
            <Table.Td>{product.sku}</Table.Td>
            <Table.Td>
              <Badge variant="light">{product.base_unit}</Badge>
            </Table.Td>

            <Table.Td>
              <Menu shadow="md" width={150}>
                <Menu.Target>
                  <ActionIcon variant="subtle">
                    <EllipsisHorizontalIcon />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<PencilIcon className="w-4 h-4" />}
                    component={Link}
                    href={`/dashboard/products/${product.id}`}
                  >
                    Edit
                  </Menu.Item>

                  <Menu.Item
                    color="red"
                    leftSection={<TrashIcon className="w-4 h-4" />}
                    onClick={() => deleteMutation.mutate(product.id)}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
