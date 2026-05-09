export type Employee = {
  id: string;
  name: string;
  email: string;
  country: string;
  currency: string;
  salaryUsd: number;
  payoutMethod: "Crypto" | "Local currency";
  wallet: string;
  bank: string;
  status: "Ready" | "Needs review";
};

export type PayrollTransaction = {
  id: string;
  employee: string;
  amountUsd: number;
  token: "USDC" | "USDT";
  payout: string;
  status: "Completed" | "Processing" | "Queued";
  hash: string;
  createdAt: string;
};

export const demoEmployees: Employee[] = [
  {
    id: "emp_001",
    name: "Aisha Khan",
    email: "aisha@kitepay.demo",
    country: "United Arab Emirates",
    currency: "AED",
    salaryUsd: 4200,
    payoutMethod: "Local currency",
    wallet: "7v9...Kite",
    bank: "Emirates NBD",
    status: "Ready",
  },
  {
    id: "emp_002",
    name: "Mateo Silva",
    email: "mateo@kitepay.demo",
    country: "Brazil",
    currency: "BRL",
    salaryUsd: 3800,
    payoutMethod: "Crypto",
    wallet: "9Br...Pay",
    bank: "Nubank",
    status: "Ready",
  },
  {
    id: "emp_003",
    name: "Priya Nair",
    email: "priya@kitepay.demo",
    country: "India",
    currency: "INR",
    salaryUsd: 5200,
    payoutMethod: "Local currency",
    wallet: "5Nq...Sol",
    bank: "HDFC Bank",
    status: "Ready",
  },
  {
    id: "emp_004",
    name: "Noah Williams",
    email: "noah@kitepay.demo",
    country: "United States",
    currency: "USD",
    salaryUsd: 6100,
    payoutMethod: "Crypto",
    wallet: "2Hb...Usd",
    bank: "Chase",
    status: "Needs review",
  },
];

export const demoTransactions: PayrollTransaction[] = [
  {
    id: "tx_1001",
    employee: "Aisha Khan",
    amountUsd: 4200,
    token: "USDC",
    payout: "AED bank payout",
    status: "Completed",
    hash: "kp_8f2a91c4",
    createdAt: "Today, 10:14 AM",
  },
  {
    id: "tx_1002",
    employee: "Mateo Silva",
    amountUsd: 3800,
    token: "USDC",
    payout: "Crypto wallet",
    status: "Completed",
    hash: "kp_6d77a0ef",
    createdAt: "Today, 10:14 AM",
  },
  {
    id: "tx_1003",
    employee: "Priya Nair",
    amountUsd: 5200,
    token: "USDC",
    payout: "INR bank payout",
    status: "Processing",
    hash: "kp_3c54b21a",
    createdAt: "Today, 10:15 AM",
  },
];

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

export function getPayrollTotal() {
  return demoEmployees.reduce((sum, employee) => sum + employee.salaryUsd, 0);
}
