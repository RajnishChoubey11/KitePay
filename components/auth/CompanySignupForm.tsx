"use client";

import Link from "next/link";
import { useState } from "react";
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
    const companyName = String(form.get("companyName"));
    const ownerName = String(form.get("ownerName"));
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    const response = await fetch("/api/auth/company/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName,
        ownerName,
        email,
        password,
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
    localStorage.setItem("userType", "COMPANY");
    localStorage.setItem("userData", JSON.stringify(data.company));

    router.push(`/dashboard/company/overview/${data.company.id}`);
  }

  return (
    <form className="auth-card" onSubmit={handleSignup}>
      <p className="mono badge">Company account</p>
      <h1>Create payroll workspace</h1>
      <p className="muted small">Demo login: company@kitepay.demo / demo123</p>

      <input name="companyName" placeholder="Company name" required />
      <input name="ownerName" placeholder="Owner name" required />
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
