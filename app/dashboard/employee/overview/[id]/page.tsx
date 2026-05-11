"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardNav from "@/components/dashboard/DashboardNav";
import WithdrawModal from "@/components/withdraw/WithdrawModal";
import { currencyRates, formatUsd } from "@/lib/utils";

type Employee = {
  name?: string;
};

export default function EmployeeDashboardPage() {
  const params = useParams<{ id: string }>();
  const employeeId = params.id;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [salary, setSalary] = useState(0);
  const [available, setAvailable] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!employeeId) return;
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [employeeId]);

  if (loading) {
    return (
      <div className="dashboard-shell">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <p className="mono badge">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="dashboard-shell">
      <DashboardNav mode="employee" employeeId={employeeId} />

      <section className="dash-main">
        <div className="dash-header">
          <div>
            <p className="mono badge">Employee dashboard</p>
            <h1>Welcome, {employee?.name || "Employee"}!</h1>
            <p className="muted">
              Choose how you get paid. Keep your salary in USDC or cash out to native currency.
            </p>
          </div>
        </div>

        <div className="metric-grid">
          <div className="metric-card">
            <span>Total Earnings</span>
            <strong>{formatUsd(salary)}</strong>
          </div>

          <div className="metric-card">
            <span>Available</span>
            <strong>{formatUsd(available)}</strong>
          </div>

          <div className="metric-card">
            <span>INR estimate</span>
            <strong>
              ₹{Math.round(available * currencyRates.INR).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <div className="dash-grid">
          <WithdrawModal availableAmount={available} onSuccess={fetchData} />
        </div>

      </section>
    </main>
  );
}