"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
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
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email,
        password,
        walletAddress: form.get("walletAddress"),
        role: "EMPLOYEE",
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error ?? "Signup failed");
      setLoading(false);
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    router.push("/dashboard/employee");
  }

  return (
    <form className="auth-card" onSubmit={handleSignup}>
      <p className="mono badge">Employee account</p>
      <h1>Choose your payout</h1>
      <p className="muted small">Demo login: employee@kitepay.demo / demo123</p>

      <input name="name" placeholder="Full name" required />
      <input name="email" type="email" placeholder="employee@kitepay.demo" required />
      <input name="password" type="password" placeholder="Password" required />
      <input name="walletAddress" placeholder="Wallet address optional" />

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
