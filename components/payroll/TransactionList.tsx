import { formatUsd } from "@/lib/utils";

type Transaction = {
  id: string;
  employeeName: string;
  amount: number;
  grossAmount?: number;
  fee?: number;
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
          <div style={{ flex: 1 }}>
            <strong>{transaction.employeeName}</strong>
            <span className="tiny muted" style={{ display: "block" }}>
              {transaction.time}
            </span>
          </div>
          
          <div style={{ textAlign: "right", marginRight: "1rem" }}>
            <strong style={{ display: "block" }}>{formatUsd(transaction.grossAmount || transaction.amount)}</strong>
            <span className="tiny muted">Gross Sent</span>
          </div>

          <div style={{ textAlign: "right", marginRight: "1rem" }}>
            <strong style={{ display: "block", color: "#fca5a5" }}>-{formatUsd(transaction.fee || 0)}</strong>
            <span className="tiny muted">Fees (0.5%)</span>
          </div>

          <div style={{ textAlign: "right", marginRight: "1rem" }}>
            <strong style={{ display: "block", color: "#2dd4bf" }}>{formatUsd(transaction.amount)}</strong>
            <span className="tiny muted">Received</span>
          </div>

          <span className={transaction.status === "Completed" ? "pill success" : "pill warn"}>
            {transaction.status}
          </span>
        </div>
      ))}
    </div>
  );
}
