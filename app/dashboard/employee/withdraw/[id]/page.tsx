"use client";

import { use } from "react";
import DashboardNav from "@/components/dashboard/DashboardNav";
import WithdrawModal from "@/components/withdraw/WithdrawModal";

export default function WithdrawPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  return (
    <main className="dashboard-shell">
      <DashboardNav mode="employee" employeeId={params.id} />
      <section className="dash-main">
        <div className="dash-header">
          <div>
            <p className="mono badge">Withdraw</p>
            <h1>Cash out or keep crypto</h1>
            <p className="muted">This demo simulates an off-ramp request and returns instant status.</p>
          </div>
        </div>
        <WithdrawModal />
      </section>
    </main>
  );
}
