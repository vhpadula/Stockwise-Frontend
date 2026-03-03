export const toNumber = (value: string) => Number(value);

export const formatCurrency = (value: string | number) => {
  return `$${Number(value).toFixed(2)}`;
};

export const formatPercentage = (value: string | number) => {
  return `${Number(value).toFixed(2)}%`;
};
