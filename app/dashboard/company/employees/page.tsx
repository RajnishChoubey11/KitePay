import DashboardNav from "@/components/dashboard/DashboardNav";
import EmployeeTable from "@/components/payroll/EmployeeTable";

export default function EmployeesPage() {
  return (
    <main className="dashboard-shell">
      <DashboardNav mode="company" />
      <section className="dash-main">
        <div className="dash-header">
          <div>
            <p className="mono badge">Employee directory</p>
            <h1>Team payout preferences</h1>
            <p className="muted">Each employee can choose wallet payout or local bank off-ramp.</p>
          </div>
        </div>
        <div className="demo-card">
          <EmployeeTable />
        </div>
      </section>
    </main>
  );
}
