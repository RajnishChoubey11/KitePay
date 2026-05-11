"use client";

import { useEffect, useState, use } from "react";
import DashboardNav from "@/components/dashboard/DashboardNav";

type Employee = {
  name?: string;
  email?: string;
  walletAddress?: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
  ifscCode?: string | null;
};

export default function EmployeeSettingsPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`/api/employee/${params.id}`, {
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
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [params.id]);

  if (loading) {
    return (
      <main className="dashboard-shell">
        <DashboardNav mode="employee" employeeId={params.id} />
        <section className="dash-main">
          <div className="dash-header">
            <p className="mono badge">Settings</p>
            <h1>Loading...</h1>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-shell">
      <DashboardNav mode="employee" employeeId={params.id} />
      <section className="dash-main">
        <div className="dash-header">
          <div>
            <p className="mono badge">Settings</p>
            <h1>Payout profile</h1>
            <p className="muted">Your bank and wallet details used for routing salary payouts.</p>
          </div>
        </div>
        <div className="settings-grid">
          <div className="demo-card">
            <h2>Bank account</h2>
            <p className="muted small">{employee?.bankName || "Not connected"}</p>
            <span className="pill success">{employee?.bankName ? "Connected" : "Not Connected"}</span>
          </div>
          <div className="demo-card">
            <h2>Wallet</h2>
            <p className="muted small">{employee?.walletAddress || "Not connected"}</p>
            <span className={`pill ${employee?.walletAddress ? "success" : "warn"}`}>
              {employee?.walletAddress ? "Connected" : "Not Connected"}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
