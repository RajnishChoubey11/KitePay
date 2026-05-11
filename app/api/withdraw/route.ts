import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";
import Company from "@/models/Company";

type JwtPayload = {
  id: string;
  type: string;
};

function formatTimestamp() {
  return new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    if (payload.type !== "EMPLOYEE") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const amount = Number(body.amount || 0);
    const method = String(body.method || "wallet transfer");

    if (!amount || amount <= 0) {
      return NextResponse.json({ message: "Invalid withdraw amount." }, { status: 400 });
    }

    await connectDB();

    const employee = await Employee.findById(payload.id);
    if (!employee) {
      return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    }

    if (!employee.walletAddress) {
      return NextResponse.json({ message: "Please register a wallet address before withdrawing." }, { status: 400 });
    }

    const company = await Company.findOne({ "employees.employeeId": employee._id });
    if (!company) {
      return NextResponse.json({ message: "No payroll company found for this employee." }, { status: 404 });
    }

    const available = (employee.transactions as Array<{ status: string; amount: number }>).reduce(
      (sum, tx) => sum + (tx.status === "Available in KitePay wallet" ? tx.amount : 0),
      0
    );

    const withdrawn = (employee.transactions as Array<{ status: string; amount: number }>).reduce(
      (sum, tx) => sum + (tx.status === "Withdrawn" ? tx.amount : 0),
      0
    );

    const balance = Math.max(available - withdrawn, 0);
    if (amount > balance) {
      return NextResponse.json({ message: "Insufficient available balance." }, { status: 400 });
    }

    const timestamp = formatTimestamp();
    employee.transactions.push({
      companyId: company._id,
      companyName: company.companyName,
      amount,
      status: "Withdrawn",
      token: "KITE",
      time: timestamp,
    });

    await employee.save();

    return NextResponse.json({
      status: "Completed",
      message: `Withdraw request submitted for $${amount} to ${employee.walletAddress} via ${method}.`,
      reference: `wd_${Date.now().toString(16)}`,
      walletAddress: employee.walletAddress,
      amount,
      method,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
