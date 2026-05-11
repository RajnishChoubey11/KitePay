"use client";

import { useEffect, useState, use } from "react";
import DashboardNav from "@/components/dashboard/DashboardNav";
import EmployeeTable from "@/components/payroll/EmployeeTable";
import PayrollButton from "@/components/payroll/PayrollButton";
import TransactionList from "@/components/payroll/TransactionList";
import { formatUsd } from "@/lib/utils";

interface Company {
  id: string;
  companyName: string;
  ownerName: string;
  email: string;
  createdAt: string;
}

interface Employee {
  employeeId?: string;
  employeeName?: string;
  email: string;
  country: string;
  salaryUsd: number;
}

interface Transaction {
  id: string;
  employeeName: string;
  amount: number;
  status: string;
  time: string;
}

export default function CompanyDashboardPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const [company, setCompany] = useState<Company | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/company/${params.id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || "Failed to fetch company data");
        }

        const data = await response.json();
        setCompany(data.company);
        setEmployees(data.employees || []);
        setTransactions(data.transactions || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error loading dashboard");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <main className="dashboard-shell">
        <DashboardNav mode="company" companyId={params.id} />
        <section className="dash-main">
          <div className="dash-header">
            <p className="mono badge">Company dashboard</p>
            <h1>Loading...</h1>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-shell">
        <DashboardNav mode="company" companyId={params.id} />
        <section className="dash-main">
          <div className="dash-header">
            <p className="mono badge">Company dashboard</p>
            <h1>Error</h1>
            <p className="muted form-error">{error}</p>
          </div>
        </section>
      </main>
    );
  }

  const total = employees.reduce((sum, emp) => sum + (emp.salaryUsd || 0), 0);

  return (
    <main className="dashboard-shell">
      <DashboardNav mode="company" companyId={params.id} />
      <section className="dash-main">
        <div className="dash-header">
          <div>
            <p className="mono badge">Company dashboard</p>
            <h1>Pay global employees in one run</h1>
            <p className="muted">
              Welcome, {company?.companyName || "Company"}! Fund payroll in USDC and track payouts directly from the database.
            </p>
          </div>
          <PayrollButton total={total} />
        </div>

        <div className="metric-grid">
          <div className="metric-card">
            <span>Payroll due</span>
            <strong>{formatUsd(total)}</strong>
          </div>
          <div className="metric-card">
            <span>Active employees</span>
            <strong>{employees.length}</strong>
          </div>
          <div className="metric-card">
            <span>Countries</span>
            <strong>{new Set(employees.map((e) => e.country)).size}</strong>
          </div>
        </div>

        <div className="dash-grid">
          <div className="demo-card wide">
            <h2>Employees</h2>
            <EmployeeTable companyId={params.id} onEmployeesChange={setEmployees} />
          </div>
          <div className="demo-card">
            <h2>Recent payouts</h2>
            <TransactionList transactions={transactions} />
          </div>
        </div>
      </section>
    </main>
  );
}
