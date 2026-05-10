"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeeSignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name"));
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const position = String(form.get("position") || "");
    const walletAddress = String(form.get("walletAddress") || "");

    const response = await fetch("/api/auth/employee/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        position,
        walletAddress: walletAddress || undefined,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Signup failed");
      setLoading(false);
      return;
    }

    // Store token in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("userType", "EMPLOYEE");
    localStorage.setItem("userData", JSON.stringify(data.employee));

    router.push(`/dashboard/employee/overview/${data.employee.id}`);
  }

  return (
    <form className="auth-card" onSubmit={handleSignup}>
      <p className="mono badge">Employee account</p>
      <h1>Choose your payout</h1>
      <p className="muted small">Demo login: employee@kitepay.demo / demo123</p>

      <input name="name" placeholder="Full name" required />
      <input name="email" type="email" placeholder="employee@kitepay.demo" required />
      <input name="password" type="password" placeholder="Password" required />
      <input name="position" placeholder="Position" required />
      <input name="walletAddress" placeholder="Wallet address" required />

      {error && <p className="form-error">{error}</p>}

      <button className="cta-btn full" disabled={loading} type="submit">
        {loading ? "Creating..." : "Create employee"}
      </button>
      <Link className="link center small" href="/employee/login">
        Already have an account?
      </Link>
    </form>
  );
}
