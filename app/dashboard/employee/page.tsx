import DashboardNav from "@/components/dashboard/DashboardNav";
import WithdrawModal from "@/components/withdraw/WithdrawModal";
import { currencyRates, formatUsd } from "@/lib/demoData";

export default function EmployeeDashboardPage() {
  const salary = 5200;
  const available = 1200;

  return (
    <main className="dashboard-shell">
      <DashboardNav mode="employee" />
      <section className="dash-main">
        <div className="dash-header">
          <div>
            <p className="mono badge">Employee dashboard</p>
            <h1>Choose how you get paid</h1>
            <p className="muted">Keep your salary in USDC or cash out to native currency.</p>
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
            <strong>₹{Math.round(available * currencyRates.INR).toLocaleString("en-IN")}</strong>
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
          <WithdrawModal />
        </div>
      </section>
    </main>
  );
}
