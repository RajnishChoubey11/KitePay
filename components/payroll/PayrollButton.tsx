"use client";

import { Send } from "lucide-react";
import { useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { createSolanaConnection, transferUsdcPayrollBatch } from "@/lib/solana";

type PayrollButtonProps = {
  total: number;
  companyId: string;
};

export default function PayrollButton({ total, companyId }: PayrollButtonProps) {
  const [status, setStatus] = useState<"idle" | "running" | "sent">("idle");
  const { publicKey, connected, sendTransaction } = useWallet();
  const connection = useMemo(() => createSolanaConnection(), []);

  async function runPayroll() {
    if (!connected || !publicKey || !sendTransaction) {
      alert("Connect your Solana wallet before running payroll.");
      return;
    }

    if (!companyId) {
      alert("Company ID is required to run payroll.");
      return;
    }

    setStatus("running");
    try {
      const token = localStorage.getItem("token");
      const companyResponse = await fetch(`/api/company/${companyId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!companyResponse.ok) {
        const errorData = await companyResponse.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to fetch company payroll data.");
      }

      const companyData = await companyResponse.json();
      const employees = companyData.employees || [];
      if (!employees.length) {
        throw new Error("No employees available for payroll.");
      }

      const employeePayments = employees.map((employee: any) => {
        if (!employee.walletAddress) {
          throw new Error(`Employee ${employee.employeeName || employee.email} does not have a wallet address.`);
        }
        const gross = Number(employee.salaryUsd || 0);
        const net = parseFloat((gross * 0.995).toFixed(6));
        return {
          walletAddress: employee.walletAddress,
          amountUsd: net,
          employeeName: employee.employeeName,
        };
      });

      const totalFeeUsd = employees.reduce(
        (sum: number, employee: any) => sum + Number(employee.salaryUsd || 0) * 0.005,
        0
      );

      const signature = await transferUsdcPayrollBatch(
        connection,
        publicKey,
        sendTransaction,
        employeePayments,
        totalFeeUsd
      );

      await fetch("/api/payroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          total,
          walletPublicKey: publicKey.toBase58(),
          transferSignature: signature,
        }),
      });

      setStatus("sent");
    } catch (error) {
      console.error("Payroll transfer failed:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Payroll transfer failed. Make sure your wallet has enough USDC on Devnet."
      );
      setStatus("idle");
    }
  }

  return (
    <button className="cta-btn dash-action" disabled={status === "running"} onClick={runPayroll}>
      <Send className="icon" />
      {status === "idle" && "Run payroll"}
      {status === "running" && "Sending payroll..."}
      {status === "sent" && "Payroll completed"}
    </button>
  );
}
