"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      // Call logout API
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      localStorage.removeItem("userData");

      // Redirect to home
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  };

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
      <div>
        <Link className="dash-logo" href="/">
          Kite<span>Pay</span>
        </Link>

        <nav className="dash-nav">
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
          <p className="small">
            No real funds move. API returns simulated settlement.
          </p>
        </div>
      </div>

      {/* Logout Button */}
      <button
        className="logout-btn"
        onClick={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    </aside>
  );
}