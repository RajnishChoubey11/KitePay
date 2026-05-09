import Link from "next/link";

type DashboardNavProps = {
  mode: "company" | "employee";
};

export default function DashboardNav({ mode }: DashboardNavProps) {
  const links =
    mode === "company"
      ? [
          ["Overview", "/dashboard/company"],
          ["Payroll", "/dashboard/company/payroll"],
          ["Employees", "/dashboard/company/employees"],
          ["Transactions", "/dashboard/company/transactions"],
        ]
      : [
          ["Overview", "/dashboard/employee"],
          ["Payments", "/dashboard/employee/payments"],
          ["Withdraw", "/dashboard/employee/withdraw"],
          ["Settings", "/dashboard/employee/settings"],
        ];

  return (
    <aside className="dash-sidebar">
      <Link className="dash-logo" href="/">
        Kite<span>Pay</span>
      </Link>
      <nav>
        {links.map(([label, href]) => (
          <Link className="dash-nav-link" href={href} key={href}>
            {label}
          </Link>
        ))}
      </nav>
      <div className="demo-login-box">
        <p className="tiny mono">Demo mode</p>
        <p className="small">No real funds move. API returns simulated settlement.</p>
      </div>
    </aside>
  );
}
