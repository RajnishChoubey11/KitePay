import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Company from "@/models/Company";
import Employee from "@/models/Employee";

type JwtPayload = {
  id: string;
  type: string;
};

type CompanyEmployeeEntry = {
  employeeId: { toString: () => string };
  employeeName: string;
  email: string;
  country: string;
  salaryUsd: number;
};

type CompanyTransactionEntry = {
  _id?: { toString: () => string };
  employeeId: { toString: () => string };
  employeeName: string;
  amount: number;
  grossAmount?: number;
  fee?: number;
  status: string;

  token?: string;
  time: string;
};

function formatTimestamp() {
  return new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    if (payload.type !== "COMPANY") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const company = await Company.findById(payload.id);
    if (!company) {
      return NextResponse.json({ message: "Company not found" }, { status: 404 });
    }

    const employees = (company.employees as CompanyEmployeeEntry[]).map((emp) => ({
      employeeId: emp.employeeId.toString(),
      employeeName: emp.employeeName,
      email: emp.email,
      country: emp.country,
      salaryUsd: emp.salaryUsd,
    }));

    const totalUsd = employees.reduce((sum, employee) => sum + (employee.salaryUsd || 0), 0);

    const transactions = (company.transactions as CompanyTransactionEntry[]).map((tx) => ({
      id: tx._id?.toString() ?? "",
      employeeId: tx.employeeId.toString(),
      employeeName: tx.employeeName,
      amount: tx.amount,
      grossAmount: tx.grossAmount || tx.amount,
      fee: tx.fee || 0,
      status: tx.status,
      time: tx.time,

      token: tx.token || "USDC",
    }));

    const totalFees = transactions.reduce((sum, tx) => sum + (tx.fee || 0), 0);
    return NextResponse.json({ employees, totalUsd, totalFees, transactions });

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

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    if (payload.type !== "COMPANY") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const walletPublicKey = String(body.walletPublicKey || "").trim();

    if (!walletPublicKey) {
      return NextResponse.json(
        { message: "Solana wallet must be connected before running payroll" },
        { status: 400 }
      );
    }

    await connectDB();

    const company = await Company.findById(payload.id);
    if (!company) {
      return NextResponse.json({ message: "Company not found" }, { status: 404 });
    }

    if (!company.employees.length) {
      return NextResponse.json(
        { message: "No employees available for payroll" },
        { status: 400 }
      );
    }

    const treasuryWallet = "DTqCbfDUjY7H5V3qyF7DcnvmrzymyKombTNwNjvYV17a";
    const timestamp = formatTimestamp();
    const totalUsd = company.employees.reduce(
      (sum: number, emp: CompanyEmployeeEntry) => sum + (emp.salaryUsd || 0),
      0
    );
    const fee = parseFloat((totalUsd * 0.005).toFixed(6));
    const netMultiplier = 1 - 0.005;

    const payrollTransactions: {
      id: string;
      employeeName: string;
      amount: number;
      grossAmount: number;
      fee: number;
      status: string;
      time: string;
      token: string;
    }[] = [];




    for (const employeeEntry of company.employees as CompanyEmployeeEntry[]) {
      const grossAmount = employeeEntry.salaryUsd;
      const employeeFee = parseFloat((grossAmount * 0.005).toFixed(6));
      const netAmount = parseFloat((grossAmount - employeeFee).toFixed(6));

      const transaction = {
        employeeId: employeeEntry.employeeId,
        employeeName: employeeEntry.employeeName,
        email: employeeEntry.email,
        amount: netAmount,
        grossAmount: grossAmount,
        fee: employeeFee,
        status: "Available",
        token: "USDC",
        time: timestamp,
      };



      company.transactions.push(transaction);
      payrollTransactions.push({
        id: transaction.employeeId.toString(),
        employeeName: transaction.employeeName,
        amount: transaction.amount,
        grossAmount: transaction.grossAmount,
        fee: transaction.fee,
        status: transaction.status,
        time: transaction.time,
        token: transaction.token,
      });


      const employee = await Employee.findById(employeeEntry.employeeId);
      if (employee) {
        employee.transactions.push({
          companyId: company._id,
          companyName: company.companyName,
          amount: netAmount,
          grossAmount: grossAmount,
          fee: employeeFee,
          status: "Available",
          token: "USDC",
          time: timestamp,
        });


        await employee.save();
      }
    }

    await company.save();

    return NextResponse.json({
      status: "success",
      message: "Payroll run completed and funds deposited to KitePay treasury wallet.",
      totalUsd,
      fee,
      treasuryWallet,
      walletPublicKey,
      transactions: payrollTransactions,
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
