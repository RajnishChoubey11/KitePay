"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EmployeeSignupForm() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [walletAddress, setWalletAddress] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                name,
                email,
                password,
                walletAddress,
                role: "EMPLOYEE",
            }),
        });

        setLoading(false);

        if (!response.ok) {
            const data = await response.json().catch(() => null);

            setError(data?.error || "Signup failed");

            return;
        }

        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        router.push("/dashboard/employee");
    };

    return (
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
            <h1 className="mb-2 text-3xl font-bold text-white">
                Employee Signup
            </h1>

            <p className="mb-6 text-zinc-400">
                Create your employee account
            </p>

            <form onSubmit={handleSignup} className="space-y-4">
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                />

                <input
                    type="text"
                    placeholder="Solana Wallet Address (optional)"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none"
                />

                {error && (
                    <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                    {loading ? "Creating account..." : "Create Employee Account"}
                </button>
            </form>

            <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-zinc-700" />
                <span className="text-sm text-zinc-500">OR</span>
                <div className="h-px flex-1 bg-zinc-700" />
            </div>

            <button
                onClick={() =>
                    signIn("google", {
                        callbackUrl: "/dashboard/employee",
                    })
                }
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-950 py-3 text-white transition hover:bg-zinc-800"
            >
                Continue with Google
            </button>
        </div>
    );
}