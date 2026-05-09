"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CompanySignupForm() {
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
        companyName: form.get("companyName"),
        email,
        password,
        role: "COMPANY",
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error ?? "Signup failed");
      setLoading(false);
      return;
    }

    await signIn("credentials", { email, password, redirect: false });
    router.push("/dashboard/company");
  }

  return (
    <form className="auth-card" onSubmit={handleSignup}>
      <p className="mono badge">Company account</p>
      <h1>Create payroll workspace</h1>
      <p className="muted small">Demo login: company@kitepay.demo / demo123</p>

      <input name="name" placeholder="Your name" required />
      <input name="companyName" placeholder="Company name" required />
      <input name="email" type="email" placeholder="company@kitepay.demo" required />
      <input name="password" type="password" placeholder="Password" required />

      {error && <p className="form-error">{error}</p>}

      <button className="cta-btn full" disabled={loading} type="submit">
        {loading ? "Creating..." : "Create company"}
      </button>
      <Link className="link center small" href="/company/login">
        Already have an account?
      </Link>
    </form>
  );
}
