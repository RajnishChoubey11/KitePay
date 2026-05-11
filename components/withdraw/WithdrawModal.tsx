"use client";

import { useState, useEffect } from "react";

type WithdrawModalProps = {
  availableAmount: number;
  onSuccess?: () => void;
};

export default function WithdrawModal({ availableAmount, onSuccess }: WithdrawModalProps) {
  const [status, setStatus] = useState("");
  const [rate, setRate] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [signature, setSignature] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch("/api/exchange");
        const data = await res.json();
        setRate(data.rate);
      } catch (err) {
        console.error("Failed to fetch exchange rate", err);
      } finally {
        setLoadingRate(false);
      }
    }
    fetchRate();
  }, []);

  async function handleWithdraw(method: "INR bank transfer" | "crypto wallet transfer") {
    if (availableAmount <= 0) {
      alert("No available balance to withdraw.");
      return;
    }

    setStatus(`Processing ${method === "crypto wallet transfer" ? "crypto" : "bank"} payout...`);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: availableAmount, method }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Withdrawal failed");
      }

      setSuccessMessage(data.message);
      setSignature(data.signature);
      setShowSuccess(true);
      setStatus("");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Withdraw error:", error);
      alert(error instanceof Error ? error.message : "Something went wrong. Please try again.");
      setStatus("");
    }
  }

  return (
    <div className="demo-card">
      <h2>Withdraw salary</h2>
      <p className="muted small">Transfer your earnings to your bank account or crypto wallet.</p>

      <div className="stack" style={{ marginTop: "1.5rem" }}>
        <div style={{
          background: "rgba(255,255,255,0.03)",
          padding: "1.25rem",
          borderRadius: "0.75rem",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <p style={{ fontSize: "0.75rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Best Exchange Rate</p>
            {loadingRate ? (
              <p style={{ fontSize: "1.125rem", color: "#fff" }}>Loading...</p>
            ) : (
              <p style={{ fontSize: "1.125rem", color: "#fff", fontWeight: "600" }}>
                1 USDC = <span style={{ color: "#2dd4bf" }}>₹{rate}</span>
              </p>
            )}
          </div>
          <div style={{ padding: "0.5rem", borderRadius: "0.5rem", background: "rgba(45, 212, 191, 0.1)", color: "#2dd4bf" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
          </div>
        </div>

        <div className="grid-2" style={{ gap: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <button
            className="cta-btn full"
            onClick={() => handleWithdraw("INR bank transfer")}
            type="button"
            disabled={!!status || loadingRate || availableAmount <= 0}
            style={{ fontSize: "0.9rem", padding: "0.75rem" }}
          >
            Bank Transfer
          </button>
          <button
            className="cta-btn full"
            onClick={() => handleWithdraw("crypto wallet transfer")}
            type="button"
            disabled={!!status || loadingRate || availableAmount <= 0}
            style={{ fontSize: "0.9rem", padding: "0.75rem", background: "linear-gradient(90deg, #1d4ed8, #2563eb, #1d4ed8)" }}
          >
            Crypto Transfer
          </button>
        </div>
      </div>

      {status && <p className="status-note" style={{ marginTop: "1rem", textAlign: "center", color: "#2dd4bf" }}>{status}</p>}

      {showSuccess && (
        <div className="modal-backdrop">
          <div className="modal" style={{ textAlign: "center", padding: "2rem" }}>
            <div className="success-icon-wrap" style={{
              width: "4rem",
              height: "4rem",
              background: "rgba(45, 212, 191, 0.1)",
              border: "1px solid #2dd4bf",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 1.5rem",
              color: "#2dd4bf"
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 style={{ color: "#fff", marginBottom: "0.5rem" }}>Transfer Successful!</h2>
            <p className="muted" style={{ marginBottom: "1.5rem" }}>
              {successMessage}
            </p>

            {signature && (
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>Transaction Signature</p>
                <a
                  href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#2dd4bf", fontSize: "0.8rem", wordBreak: "break-all" }}
                >
                  {signature}
                </a>
              </div>
            )}

            <div style={{
              background: "rgba(245, 158, 11, 0.1)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              padding: "1rem",
              borderRadius: "0.75rem",
              marginBottom: "1.5rem",
              textAlign: "left"
            }}>
              <p style={{ color: "#fbbf24", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.25rem" }}>
                ⚠️ Devnet Notice
              </p>
              <p style={{ color: "#d1d5db", fontSize: "0.8125rem", lineHeight: "1.4" }}>
                Since you are on <strong>Solana Devnet</strong>, real-world currency exchange is simulated.
                However, crypto transfers are executed on the Devnet blockchain.
              </p>
            </div>

            <button className="cta-btn full" onClick={() => setShowSuccess(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
