"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

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
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      localStorage.removeItem("userData");

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

  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="dash-sidebar">
      <div>
        <div className="dash-logo">
          <svg width="32" height="32" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <path d="M50 8 L80 45 L50 82 L20 45 Z" className="kite-fill-1" />
            <path d="M50 8 L80 45 L50 45 Z" className="kite-fill-2" />
            <path d="M50 45 L80 45 L50 82 Z" className="kite-fill-3" />
            <path d="M50 82 L47 95 Q50 88 53 95 Z" className="kite-tail" />
            <circle cx="50" cy="42" r="4" className="kite-dot" />
          </svg>
          Kite<span>Pay</span>
        </div>

        <nav className="dash-nav">
          {links.map(([label, href]) => {
            const isActive = pathname === href;
            return (
              <button
                key={href}
                className={`dash-nav-link ${isActive ? "active" : ""}`}
                onClick={() => router.push(href)}
              >
                {label}
              </button>
            );
          })}

          {/* Show wallet button only for company dashboard */}
          {mode === "company" && mounted && (
            <div className="wallet-button-container">
              <WalletMultiButton className="wallet-button" />
            </div>
          )}
        </nav>
      </div>

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