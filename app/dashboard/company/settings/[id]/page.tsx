import DashboardNav from "@/components/dashboard/DashboardNav";

export default function CompanySettingsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="dashboard-shell">
      <DashboardNav mode="company" companyId={params.id} />
      <section className="dash-main">
        <div className="dash-header">
          <div>
            <p className="mono badge">Settings</p>
            <h1>Company payout setup</h1>
            <p className="muted">Demo treasury wallet, token preference, and compliance checks.</p>
          </div>
        </div>
        <div className="settings-grid">
          <div className="demo-card">
            <h2>Treasury wallet</h2>
            <p className="muted small">USDC Solana balance</p>
            <strong className="big-number">$48,900</strong>
          </div>
          <div className="demo-card">
            <h2>Default token</h2>
            <p className="muted small">USDC, low fee network settlement.</p>
            <span className="pill success">Active</span>
          </div>
        </div>
      </section>
    </main>
  );
}
