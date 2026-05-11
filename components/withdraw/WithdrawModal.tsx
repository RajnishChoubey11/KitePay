"use client";

import { useState } from "react";

export default function WithdrawModal() {
  const [method, setMethod] = useState("INR bank transfer");
  const [status, setStatus] = useState("");

  const [amount, setAmount] = useState("1200");

  async function withdraw() {
    const withdrawAmount = Number(amount);
    if (!withdrawAmount || withdrawAmount <= 0) {
      setStatus("Enter a valid withdraw amount.");
      return;
    }

    setStatus("Processing payout...");
    const token = localStorage.getItem("token");
    const response = await fetch("/api/withdraw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: withdrawAmount, method }),
    });
    const data = await response.json();
    setStatus(`${data.status}: ${data.message}`);
  }

  return (
    <div className="demo-card">
      <h2>Withdraw salary</h2>
      <p className="muted small">Convert stablecoins to your native currency or keep crypto.</p>

      <div className="stack" style={{ marginTop: "1.5rem" }}>
        <input
          type="number"
          min="0"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Withdraw amount"
          style={{ padding: "0.75rem 1rem", borderRadius: "0.75rem", border: "1px solid #263244" }}
        />

        <select value={method} onChange={(event) => setMethod(event.target.value)}>
          <option>INR bank transfer</option>
          <option>USDC wallet</option>
          <option>AED bank transfer</option>
        </select>

        <button className="cta-btn full" onClick={withdraw} type="button">
          Request Payout
        </button>
      </div>

      {status && <p className="status-note">{status}</p>}
    </div>
  );
}
