"use client";

import { useEffect, useState, use } from "react";
import DashboardNav from "@/components/dashboard/DashboardNav";
import PayrollButton from "@/components/payroll/PayrollButton";
import EmployeeTable from "@/components/payroll/EmployeeTable";
import { formatUsd } from "@/lib/utils";

export default function PayrollPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const [total, setTotal] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);


  useEffect(() => {
    async function fetchPayrollInfo() {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/payroll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return;

      const data = await response.json();
      setTotal(data.totalUsd || 0);
      setTotalFees(data.totalFees || 0);
      setEmployeeCount(data.employees?.length || 0);

    }

    fetchPayrollInfo();
  }, []);

  return (
    <main className="dashboard-shell">
      <DashboardNav mode="company" companyId={params.id} />
      <section className="dash-main">
        <div className="dash-header">
          <div>
            <p className="mono badge">Payroll run</p>
            <h1>Current payroll</h1>
            <p className="muted">
              Batch total: {formatUsd(total)} | Fees: {formatUsd(totalFees)}
            </p>
            <p className="muted small">
              Processing {employeeCount} employees.
            </p>

          </div>
          <PayrollButton total={total} companyId={params.id} />
        </div>
        <div className="demo-card">
          <h2>Payout queue</h2>
          <EmployeeTable companyId={params.id} />
        </div>
      </section>
    </main>
  );
}
