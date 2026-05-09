import Link from "next/link";
import CompanySignupForm from "@/components/auth/CompanySignupForm";

export default function CompanySignupPage() {
  return (
    <main className="auth-shell">
      <Link className="brand auth-brand" href="/">
        <span className="logo-text">
          Kite<span className="logo-accent">Pay</span>
        </span>
      </Link>
      <CompanySignupForm />
    </main>
  );
}
