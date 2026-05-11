"use client";

import { use, useEffect, useState } from "react";
import DashboardNav from "@/components/dashboard/DashboardNav";
import TransactionList from "@/components/payroll/TransactionList";

export default function CompanyTransactionsPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/company/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTransactions(data.transactions || []);
        }
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, [params.id]);

  return (
    <main className="dashboard-shell">
      <DashboardNav mode="company" companyId={params.id} />
      <section className="dash-main">
        <div className="dash-header">
          <div>
            <p className="mono badge">Ledger</p>
            <h1>Payroll transactions</h1>
            <p className="muted">Track stablecoin sends and off-ramp payouts in one view.</p>
          </div>
        </div>
        <div className="demo-card">
          {loading ? (
            <p className="p-4 text-center">Loading transactions...</p>
          ) : (
            <TransactionList transactions={[...transactions].reverse()} />
          )}
        </div>
      </section>
    </main>
  );
}
