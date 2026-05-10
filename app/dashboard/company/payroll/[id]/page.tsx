import DashboardNav from "@/components/dashboard/DashboardNav";
import PayrollButton from "@/components/payroll/PayrollButton";
import EmployeeTable from "@/components/payroll/EmployeeTable";
import { formatUsd, getPayrollTotal } from "@/lib/demoData";

export default function PayrollPage({
  params,
}: {
  params: { id: string };
}) {
  const total = getPayrollTotal();

  return (
    <main className="dashboard-shell">
      <DashboardNav mode="company" companyId={params.id} />
      <section className="dash-main">
        <div className="dash-header">
          <div>
            <p className="mono badge">Payroll run</p>
            <h1>May 2026 payroll</h1>
            <p className="muted">Demo batch total: {formatUsd(total)} in USDC on Solana.</p>
          </div>
          <PayrollButton total={total} />
        </div>
        <div className="demo-card">
          <h2>Payout queue</h2>
          <EmployeeTable />
        </div>
      </section>
    </main>
  );
}
