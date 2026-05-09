import { NextResponse } from "next/server";
import { demoEmployees, demoTransactions, getPayrollTotal } from "@/lib/demoData";

export async function GET() {
  return NextResponse.json({
    employees: demoEmployees,
    totalUsd: getPayrollTotal(),
    transactions: demoTransactions,
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  return NextResponse.json({
    status: "success",
    message: "Demo payroll simulated. No crypto was transferred.",
    token: body.token ?? "USDC",
    totalUsd: body.total ?? getPayrollTotal(),
    transactionHash: `demo_${Date.now().toString(16)}`,
  });
}
