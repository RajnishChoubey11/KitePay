import Link from "next/link";
import EmployeeSignupForm from "@/components/auth/EmployeeSignupForm";

export default function EmployeeSignupPage() {
  return (
    <main className="auth-shell">
      <Link className="brand auth-brand" href="/">
        <span className="logo-text">
          Kite<span className="logo-accent">Pay</span>
        </span>
      </Link>
      <EmployeeSignupForm />
    </main>
  );
}
