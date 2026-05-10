"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { currencyRates, formatUsd } from "@/lib/demoData";

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
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  if (loading) {
    return <p>Loading...</p>;
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
            <span>Monthly salary</span>
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
          <div className="demo-card">
            <h2>Current payout choice</h2>
            <div className="choice-list">
              <label>
                <input defaultChecked name="payout" type="radio" />
                Local currency to HDFC Bank
              </label>
              <label>
                <input name="payout" type="radio" />
                Keep USDC in wallet
              </label>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}