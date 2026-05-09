"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EmployeeLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Use employee@kitepay.demo and demo123 for the demo.");
      return;
    }

    router.push("/dashboard/employee");
  }

  return (
    <form className="auth-card" onSubmit={handleLogin}>
      <p className="mono badge">Employee login</p>
      <h1>Manage salary payouts</h1>
      <p className="muted small">Demo login: employee@kitepay.demo / demo123</p>

      <input name="email" type="email" defaultValue="employee@kitepay.demo" required />
      <input name="password" type="password" defaultValue="demo123" required />

      {error && <p className="form-error">{error}</p>}

      <button className="cta-btn full" disabled={loading} type="submit">
        {loading ? "Signing in..." : "Open employee dashboard"}
      </button>
      <Link className="link center small" href="/employee/signup">
        Create employee account
      </Link>
    </form>
  );
}
