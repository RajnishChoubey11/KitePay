import Link from "next/link";
import EmployeeLoginForm from "@/components/auth/EmployeeLoginForm";

export default function EmployeeLoginPage() {
  return (
    <main className="auth-shell">
      <Link className="brand auth-brand" href="/">
        <span className="logo-text">
          Kite<span className="logo-accent">Pay</span>
        </span>
      </Link>
      <EmployeeLoginForm />
    </main>
  );
}
