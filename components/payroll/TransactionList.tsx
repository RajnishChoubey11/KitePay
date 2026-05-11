import { formatUsd } from "@/lib/utils";

type Transaction = {
  id: string;
  employeeName: string;
  amount: number;
  status: string;
  time: string;
  token?: string;
  payout?: string;
};

export default function TransactionList({ transactions = [] }: { transactions?: Transaction[] }) {
  if (transactions.length === 0) {
    return <div className="muted p-4 text-center small">No recent transactions found.</div>;
  }

  return (
    <div className="stack">
      {transactions.map((transaction) => (
        <div className="transaction-row" key={transaction.id}>
          <div>
            <strong>{transaction.employeeName}</strong>
            <span>
              {transaction.time}
            </span>
          </div>
          <div>
            <strong>{formatUsd(transaction.amount)}</strong>
            <span>
              {transaction.token || "USDC"}
            </span>
          </div>
          <span className={transaction.status === "Completed" ? "pill success" : "pill warn"}>
            {transaction.status}
          </span>
        </div>
      ))}
    </div>
  );
}
