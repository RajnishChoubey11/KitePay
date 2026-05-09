import Link from "next/link";
import CompanyLoginForm from "@/components/auth/CompanyLoginForm";

export default function CompanyLoginPage() {
  return (
    <main className="auth-shell">
      <Link className="brand auth-brand" href="/">
        <span className="logo-text">
          Kite<span className="logo-accent">Pay</span>
        </span>
      </Link>
      <CompanyLoginForm />
    </main>
  );
}
