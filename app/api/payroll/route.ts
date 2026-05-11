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
  status: string;
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
      status: tx.status,
      time: tx.time,
      token: "USDC",
    }));

    return NextResponse.json({ employees, totalUsd, transactions });
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

    const timestamp = formatTimestamp();
    const payrollTransactions: Array<{
      id: string;
      employeeName: string;
      amount: number;
      status: string;
      time: string;
      token: string;
    }> = [];

    for (const employeeEntry of company.employees as CompanyEmployeeEntry[]) {
      const transaction = {
        employeeId: employeeEntry.employeeId,
        employeeName: employeeEntry.employeeName,
        email: employeeEntry.email,
        amount: employeeEntry.salaryUsd,
        status: "Completed",
        time: timestamp,
      };

      company.transactions.push(transaction);
      payrollTransactions.push({
        id: transaction.employeeId.toString(),
        employeeName: transaction.employeeName,
        amount: transaction.amount,
        status: transaction.status,
        time: transaction.time,
        token: "USDC",
      });

      const employee = await Employee.findById(employeeEntry.employeeId);
      if (employee) {
        employee.transactions.push({
          companyId: company._id,
          companyName: company.companyName,
          amount: employeeEntry.salaryUsd,
          status: "Completed",
          time: timestamp,
        });
        await employee.save();
      }
    }

    await company.save();

    const totalUsd = company.employees.reduce(
      (sum: number, emp: CompanyEmployeeEntry) => sum + (emp.salaryUsd || 0),
      0
    );

    return NextResponse.json({
      status: "success",
      message: "Payroll run completed",
      totalUsd,
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
