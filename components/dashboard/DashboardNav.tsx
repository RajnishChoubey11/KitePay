"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type DashboardNavProps = {
  mode: "company" | "employee";
  companyId?: string;
  employeeId?: string;
};

export default function DashboardNav({
  mode,
  companyId,
  employeeId,
}: DashboardNavProps) {
  const router = useRouter();

  const links =
    mode === "company"
      ? [
          ["Overview", `/dashboard/company/overview/${companyId ?? ""}`],
          ["Payroll", `/dashboard/company/payroll/${companyId ?? ""}`],
          ["Employees", `/dashboard/company/employees/${companyId ?? ""}`],
          ["Transactions", `/dashboard/company/transactions/${companyId ?? ""}`],
          ["Settings", `/dashboard/company/settings/${companyId ?? ""}`],
        ]
      : [
          ["Overview", `/dashboard/employee/overview/${employeeId ?? ""}`],
          ["Payments", `/dashboard/employee/payments/${employeeId ?? ""}`],
          ["Withdraw", `/dashboard/employee/withdraw/${employeeId ?? ""}`],
          ["Settings", `/dashboard/employee/settings/${employeeId ?? ""}`],
        ];

  return (
    <aside className="dash-sidebar">
      <Link className="dash-logo" href="/">
        Kite<span>Pay</span>
      </Link>

      <nav>
        {links.map(([label, href]) => (
          <button
            key={href}
            className="dash-nav-link"
            onClick={() => router.push(href)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="demo-login-box">
        <p className="tiny mono">Demo mode</p>
        <p className="small">No real funds move. API returns simulated settlement.</p>
      </div>
    </aside>
  );
}