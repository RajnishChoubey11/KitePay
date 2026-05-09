import DashboardNav from "@/components/dashboard/DashboardNav";
import EmployeeTable from "@/components/payroll/EmployeeTable";
import PayrollButton from "@/components/payroll/PayrollButton";
import TransactionList from "@/components/payroll/TransactionList";
import { demoEmployees, formatUsd, getPayrollTotal } from "@/lib/demoData";

export default function CompanyDashboardPage() {
  const total = getPayrollTotal();
  const ready = demoEmployees.filter((employee) => employee.status === "Ready").length;

  return (
    <main className="dashboard-shell">
      <DashboardNav mode="company" />
      <section className="dash-main">
        <div className="dash-header">
          <div>
            <p className="mono badge">Company dashboard</p>
            <h1>Pay global employees in one run</h1>
            <p className="muted">Fund payroll in USDC. Employees can receive crypto or local currency.</p>
          </div>
          <PayrollButton total={total} />
        </div>

        <div className="metric-grid">
          <div className="metric-card">
            <span>Payroll due</span>
            <strong>{formatUsd(total)}</strong>
          </div>
          <div className="metric-card">
            <span>Ready employees</span>
            <strong>
              {ready}/{demoEmployees.length}
            </strong>
          </div>
          <div className="metric-card">
            <span>Countries</span>
            <strong>4</strong>
          </div>
        </div>

        <div className="dash-grid">
          <div className="demo-card wide">
            <h2>Employees</h2>
            <EmployeeTable />
          </div>
          <div className="demo-card">
            <h2>Recent payouts</h2>
            <TransactionList />
          </div>
        </div>
      </section>
    </main>
  );
}
