"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EmployerLoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError("Invalid employer credentials");
            return;
        }

        router.push("/dashboard/employer");
    };

    return (
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
            <h1 className="mb-2 text-3xl font-bold text-white">Employer Login</h1>
            <p className="mb-6 text-zinc-400">Sign in to manage payroll</p>

            <form onSubmit={handleLogin} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="company@example.com"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                />

                {error && <div className="text-sm text-red-400">{error}</div>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                >
                    {loading ? "Logging in..." : "Login as Employer"}
                </button>
            </form>

            <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-zinc-700" />
                <span className="text-sm text-zinc-500">OR</span>
                <div className="h-px flex-1 bg-zinc-700" />
            </div>

            <button
                onClick={() =>
                    signIn("google", { callbackUrl: "/dashboard/employer" })
                }
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 text-white hover:bg-zinc-800"
            >
}