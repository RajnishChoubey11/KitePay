export const currencyRates: Record<string, number> = {
  AED: 3.67,
  BRL: 5.12,
  INR: 83.4,
  USD: 1,
};

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
