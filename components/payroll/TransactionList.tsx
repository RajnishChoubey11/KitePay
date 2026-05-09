import { demoTransactions, formatUsd } from "@/lib/demoData";

export default function TransactionList() {
  return (
    <div className="stack">
      {demoTransactions.map((transaction) => (
        <div className="transaction-row" key={transaction.id}>
          <div>
            <strong>{transaction.employee}</strong>
            <span>
              {transaction.createdAt} - {transaction.hash}
            </span>
          </div>
          <div>
            <strong>{formatUsd(transaction.amountUsd)}</strong>
            <span>
              {transaction.token} to {transaction.payout}
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
