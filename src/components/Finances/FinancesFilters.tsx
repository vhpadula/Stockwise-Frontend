"use client";

import {
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Select,
  Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";

import type { TimelineGroupBy } from "@/types/Finances";

type ProductOption = { value: string; label: string };

interface Props {
  startDate: Date | null;
  endDate: Date | null;
  groupBy: TimelineGroupBy;
  productId: string | null;

  productOptions: ProductOption[];
  loadingProducts?: boolean;

  onStartDateChange: (d: Date | null) => void;
  onEndDateChange: (d: Date | null) => void;
  onGroupByChange: (g: TimelineGroupBy) => void;
  onProductChange: (productId: string | null) => void;

  onReset: () => void;
}

export function FinancesFilters({
  startDate,
  endDate,
  groupBy,
  productId,
  productOptions,
  loadingProducts,
  onStartDateChange,
  onEndDateChange,
  onGroupByChange,
  onProductChange,
  onReset,
}: Props) {
  return (
    <Card withBorder radius="md" p="md">
      <Grid gutter="md" align="end">
        <Grid.Col span={{ base: 12, md: 3 }}>
          <DateInput
            value={startDate}
            onChange={(value) =>
              onStartDateChange(value ? new Date(value) : null)
            }
            label="From"
            valueFormat="MMM D, YYYY"
            clearable
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3 }}>
          <DateInput
            value={endDate}
            onChange={(value) =>
              onEndDateChange(value ? new Date(value) : null)
            }
            label="To"
            valueFormat="MMM D, YYYY"
            clearable
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3 }}>
          <Select
            label="Group by"
            data={[
              { value: "day", label: "Day" },
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
            ]}
            value={groupBy}
            onChange={(v) => onGroupByChange((v as TimelineGroupBy) ?? "month")}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3 }}>
          <Select
            label="Product"
            data={productOptions}
            value={productId ?? ""}
            onChange={(v) => onProductChange(v && v.length > 0 ? v : null)}
            searchable
            disabled={loadingProducts}
          />
        </Grid.Col>
      </Grid>

      <Divider my="md" />

      <Group justify="apart">
        <Text c="dimmed" size="sm">
          Use filters to refine the results.
        </Text>

        <Button variant="light" onClick={onReset}>
          Reset
        </Button>
      </Group>
    </Card>
  );
}
