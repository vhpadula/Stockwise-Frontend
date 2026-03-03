export const formatCurrency = (value: string | number) => {
  return `$${Number(value).toFixed(2)}`;
};

export const formatPercentage = (value: string | number) => {
  return `${Number(value).toFixed(2)}%`;
};

export function dateToIso(value?: Date | null) {
  if (!value) return "";
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, "0");
  const d = String(value.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function toNumber(v?: string | number | null) {
  return Number(v ?? 0);
}

export function moneyFromStringOrNumber(v?: string | number | null) {
  const n = Number(v ?? 0);
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
