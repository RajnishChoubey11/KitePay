export const currencyRates: Record<string, number> = {
  AED: 3.67,
  BRL: 4.91,
  INR: 95,
  USD: 1,
};

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

}
