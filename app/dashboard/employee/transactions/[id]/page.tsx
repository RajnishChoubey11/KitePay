"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { currencyRates, formatUsd, demoTransactions, PayrollTransaction } from "@/lib/demoData";

type Employee = {
  id?: string;
  name?: string;
};

export default function EmployeePaymentsPage() {
  const params = useParams<{ id: string }>();
  const employeeId = params.id;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [salary, setSalary] = useState(0);
  const [available, setAvailable] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Filter transactions for this demo - in a real app, this would be an API call
  const [transactions, setTransactions] = useState<PayrollTransaction[]>([]);

  useEffect(() => {
    if (!employeeId) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`/api/employee/${employeeId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token ?? ""}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch employee data");
        }

        const data = await response.json();
        setEmployee(data.employee);
        setSalary(data.salary ?? 0);
        setAvailable(data.available ?? 0);
        
        // Use demo transactions for the list
        // In a real app, we'd fetch transactions specifically for this employee
        setTransactions(demoTransactions);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  if (loading) {
    return (
      <div className="dashboard-shell">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <p className="mono badge">Loading history...</p>
        </div>
      </div>
    );
  }

  const totalReceived = transactions
    .filter(t => t.status === "Completed")
    .reduce((sum, t) => sum + t.amountUsd, 0);

  const lastPayment = transactions[0]?.amountUsd || 0;

  return (
    <main className="dashboard-shell">
      <DashboardNav mode="employee" employeeId={employeeId} />

      <section className="dash-main">
        <div className="dash-header">
          <div>
            <p className="mono badge">Payment History</p>
            <h1>Your Earnings</h1>
            <p className="muted">
              View your past payouts and track your upcoming earnings.
            </p>
          </div>
        </div>

        <div className="metric-grid">
          <div className="metric-card">
            <span>Total Received (All time)</span>
            <strong>{formatUsd(totalReceived)}</strong>
          </div>

          <div className="metric-card">
            <span>Last Payout</span>
            <strong>{formatUsd(lastPayment)}</strong>
          </div>

          <div className="metric-card">
            <span>Next Payout (Estimated)</span>
            <strong>{formatUsd(salary)}</strong>
            <span className="tiny teal">Scheduled for June 1st</span>
          </div>
        </div>

        <div className="dash-grid">
          <div className="demo-card wide">
            <h2>Transaction History</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Reference</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>
                        <div className="semibold">{tx.createdAt}</div>
                        <span className="tiny muted">Payroll Disbursement</span>
                      </td>
                      <td>
                        <code className="mono tiny">{tx.hash}</code>
                      </td>
                      <td>
                        <div className="small">{tx.payout}</div>
                        <span className="tiny muted">{tx.token}</span>
                      </td>
                      <td>
                        <strong className="white">{formatUsd(tx.amountUsd)}</strong>
                      </td>
                      <td>
                        <span className={`pill ${tx.status === "Completed" ? "success" : "warn"}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td>
                        <button className="link tiny">Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}