import DashboardNav from "@/components/dashboard/DashboardNav";

export default function EmployeeSettingsPage() {
  return (
    <main className="dashboard-shell">
      <DashboardNav mode="employee" />
      <section className="dash-main">
        <div className="dash-header">
          <div>
            <p className="mono badge">Settings</p>
            <h1>Payout profile</h1>
            <p className="muted">Demo bank and wallet details used for routing salary payouts.</p>
          </div>
        </div>
        <div className="settings-grid">
          <div className="demo-card">
            <h2>Bank account</h2>
            <p className="muted small">HDFC Bank ending 2042</p>
            <span className="pill success">Verified</span>
          </div>
          <div className="demo-card">
            <h2>Wallet</h2>
            <p className="muted small">5Nq...Sol</p>
            <span className="pill success">Connected</span>
          </div>
        </div>
      </section>
    </main>
  );
}
