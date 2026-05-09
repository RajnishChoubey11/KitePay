import DashboardNav from "@/components/dashboard/DashboardNav";
import TransactionList from "@/components/payroll/TransactionList";

export default function EmployeePaymentsPage() {
  return (
    <main className="dashboard-shell">
      <DashboardNav mode="employee" />
      <section className="dash-main">
        <div className="dash-header">
          <div>
            <p className="mono badge">Payment history</p>
            <h1>Your salary payments</h1>
            <p className="muted">Demo ledger for stablecoin payroll and bank payout status.</p>
          </div>
        </div>
        <div className="demo-card">
          <TransactionList />
        </div>
      </section>
    </main>
  );
}
