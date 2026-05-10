"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompanyLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    const response = await fetch("/api/auth/company/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Login failed");
      setLoading(false);
      return;
    }

    // Store token in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("userType", "COMPANY");
    localStorage.setItem("userData", JSON.stringify(data.company));

    router.push("/dashboard/company");
  }

  return (
    <form className="auth-card" onSubmit={handleLogin}>
      <p className="mono badge">Company login</p>
      <h1>Run global payroll</h1>
      <p className="muted small">Demo login: company@kitepay.demo / demo123</p>

      <input name="email" type="email" placeholder="company@kitepay.demo" required />
      <input name="password" type="password" placeholder="demo123" required />

      {error && <p className="form-error">{error}</p>}

      <button className="cta-btn full" disabled={loading} type="submit">
        {loading ? "Signing in..." : "Open company dashboard"}
      </button>
      <Link className="link center small" href="/company/signup">
        Create company account
      </Link>
    </form>
  );
}
