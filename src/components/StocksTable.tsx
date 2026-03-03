"use client";

import { useState } from "react";
import {
  Table,
  Badge,
  Group,
  Text,
  ActionIcon,
  Center,
  Loader,
} from "@mantine/core";
import { Stock } from "@/types/Stocks";
import { Product } from "@/types/Products";
import { StockMovementsDrawer } from "@/components";
import { EyeIcon } from "@heroicons/react/16/solid";

interface Props {
  stocks: Stock[];
  products: Product[];
}

export default function StocksTable({ stocks, products }: Props) {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  const getProductName = (productId: string) =>
    products.find((p) => p.id === productId)?.name || "Unknown";

  return (
    <>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product</Table.Th>
            <Table.Th>Lot</Table.Th>
            <Table.Th>Remaining</Table.Th>
            <Table.Th>Unit Cost</Table.Th>
            <Table.Th>Value</Table.Th>
            <Table.Th>Expiration</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {stocks.map((stock) => {
            const remaining = Number(stock.remaining_quantity);
            const unitCost = Number(stock.unit_cost);
            const value = remaining * unitCost;
            const isLow = remaining <= 10; // simple threshold example

            return (
              <Table.Tr key={stock.id}>
                <Table.Td>{getProductName(stock.product)}</Table.Td>

                <Table.Td>
                  {stock.lot_number ? (
                    <Badge variant="light">{stock.lot_number}</Badge>
                  ) : (
                    "-"
                  )}
                </Table.Td>

                <Table.Td>
                  <Group gap="xs">
                    <Text>{remaining}</Text>
                    {isLow && (
                      <Badge color="red" size="xs">
                        Low
                      </Badge>
                    )}
                  </Group>
                </Table.Td>

                <Table.Td>${unitCost.toFixed(2)}</Table.Td>

                <Table.Td>${value.toFixed(2)}</Table.Td>

                <Table.Td>{stock.expiration_date || "-"}</Table.Td>

                {/* Actions */}
                <Table.Td>
                  <ActionIcon
                    color="purple"
                    onClick={() => setSelectedStock(stock.id)}
                  >
                    <EyeIcon className="w-4 h-4" />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>

      {/* Stock Movements Drawer */}
      {selectedStock && (
        <StockMovementsDrawer
          stockId={selectedStock}
          opened={!!selectedStock}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </>
  );
}
