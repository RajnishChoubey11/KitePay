"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { formatUsd } from "@/lib/utils";

type EmployeeTransaction = {
  id: string;
  companyName?: string;
  amount: number;
  status: string;
  time: string;
};

type EmployeeApiTransaction = {
  _id?: { toString: () => string };
  id?: string;
  companyName?: string;
  amount: number;
  status: string;
  time: string;
};

export default function EmployeePaymentsPage() {
  const params = useParams<{ id: string }>();
  const employeeId = params.id;

  const [salary, setSalary] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<EmployeeTransaction[]>([]);

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
        setSalary(data.salary ?? 0);
        setTransactions(
          (data.employee.transactions || []).map((tx: EmployeeApiTransaction) => ({
            id: tx._id?.toString() ?? tx.id ?? `${tx.companyName}-${tx.time}`,
            companyName: tx.companyName,
            amount: tx.amount,
            status: tx.status,
            time: tx.time,
          }))
        );
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
    .filter((t) => t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const lastPayment = transactions[0]?.amount || 0;

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
                    <th>Company Name</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>
                        <div className="semibold">{tx.time}</div>
                        <span className="tiny muted">Payroll Disbursement</span>
                      </td>
                      <td>{tx.companyName}</td>
                      <td>
                        <strong className="white">{formatUsd(tx.amount)}</strong>
                      </td>
                      <td>
                        <span className={`pill ${tx.status === "Completed" ? "success" : "warn"}`}>
                          {tx.status}
                        </span>
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