"use client";

import { useMemo, useState } from "react";
import { Grid, Group, Stack, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

import { FinancesService } from "@/services/Finances";
import { ProductsService } from "@/services/Products";

import type { Product } from "@/types/Products";
import type {
  FinancialSummary,
  ProductFinancial,
  FinancialTimelineItem,
  TimelineGroupBy,
  TopProduct,
} from "@/types/Finances";

import { dateToIso } from "@/utils/utils";

import {
  FinancesFilters,
  FinancesKpis,
  FinancesTimelineChart,
  ProductFinancialTable,
  TopProductsTable,
} from "@/components";

export default function FinancesPage() {
  // filters
  const [groupBy, setGroupBy] = useState<TimelineGroupBy>("month");
  const [productId, setProductId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const date_from = dateToIso(startDate) || undefined;
  const date_to = dateToIso(endDate) || undefined;

  // products for filter
  const { data: products = [], isLoading: loadingProducts } = useQuery<
    Product[]
  >({
    queryKey: ["products"],
    queryFn: ProductsService.getAll,
    staleTime: 60_000,
  });

  const productOptions = useMemo(
    () => [
      { value: "", label: "All products" },
      ...products.map((p) => ({ value: p.id, label: `${p.name} (${p.sku})` })),
    ],
    [products],
  );

  // summary
  const summaryQuery = useQuery<FinancialSummary>({
    queryKey: ["financialsSummary", date_from, date_to],
    queryFn: () => FinancesService.getSummary({ date_from, date_to }),
    staleTime: 60_000,
  });

  // products breakdown
  const productsQuery = useQuery<ProductFinancial[]>({
    queryKey: ["financialsProducts", date_from, date_to],
    queryFn: () => FinancesService.getProducts({ date_from, date_to }),
    staleTime: 60_000,
  });

  // timeline
  const timelineQuery = useQuery<FinancialTimelineItem[]>({
    queryKey: ["financialsTimeline", groupBy, productId, date_from, date_to],
    queryFn: () =>
      FinancesService.getTimeline({
        group_by: groupBy,
        product: productId ?? undefined,
        date_from,
        date_to,
      }),
    staleTime: 60_000,
  });

  // top products
  const topQuery = useQuery<TopProduct[]>({
    queryKey: ["financialsTopProducts", date_from, date_to],
    queryFn: () =>
      FinancesService.getTopProducts({ limit: 8, date_from, date_to }),
    staleTime: 60_000,
  });

  const isLoading =
    summaryQuery.isLoading ||
    productsQuery.isLoading ||
    timelineQuery.isLoading ||
    topQuery.isLoading;

  return (
    <Stack gap="lg">
      <Group justify="apart" align="flex-end">
        <Stack gap={2}>
          <Title order={2}>Finances</Title>
          <Text c="dimmed">
            Revenue, purchase vs sales, profit and top products
          </Text>
        </Stack>
      </Group>

      <FinancesFilters
        startDate={startDate}
        endDate={endDate}
        groupBy={groupBy}
        productId={productId}
        productOptions={productOptions}
        loadingProducts={loadingProducts}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onGroupByChange={setGroupBy}
        onProductChange={setProductId}
        onReset={() => {
          setStartDate(null);
          setEndDate(null);
          setProductId(null);
          setGroupBy("month");
        }}
      />

      <FinancesKpis summary={summaryQuery.data} />

      <FinancesTimelineChart
        isLoading={timelineQuery.isLoading}
        productId={productId}
        items={timelineQuery.data}
      />

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <ProductFinancialTable
            isLoading={productsQuery.isLoading}
            items={productsQuery.data}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <TopProductsTable
            isLoading={topQuery.isLoading}
            items={topQuery.data}
          />
        </Grid.Col>
      </Grid>

      {isLoading && (
        <Text c="dimmed" size="sm">
          Loading financial data…
        </Text>
      )}
    </Stack>
  );
}
