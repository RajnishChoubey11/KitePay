import DashboardNav from "@/components/dashboard/DashboardNav";
import TransactionList from "@/components/payroll/TransactionList";

export default function CompanyTransactionsPage() {
  return (
    <main className="dashboard-shell">
      <DashboardNav mode="company" />
      <section className="dash-main">
        <div className="dash-header">
          <div>
            <p className="mono badge">Ledger</p>
            <h1>Payroll transactions</h1>
            <p className="muted">Track stablecoin sends and off-ramp payouts in one view.</p>
          </div>
        </div>
        <div className="demo-card">
          <TransactionList />
        </div>
      </section>
    </main>
  );
}
