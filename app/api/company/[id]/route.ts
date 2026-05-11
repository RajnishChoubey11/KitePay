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
  position?: string;
  country: string;
  salaryUsd: number;
};

type CompanyTransactionEntry = {
  _id?: { toString: () => string };
  employeeId: { toString: () => string };
  employeeName: string;
  amount: number;
  status: string;
  token?: string;
  time: string;
};

export async function GET(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  try {
    const params = await paramsPromise;
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { message: "No authorization token provided" },
        { status: 401 }
      );
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    if (payload.type !== "COMPANY" || payload.id !== params.id) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }

    await connectDB();

    const company = await Company.findById(params.id);
    if (!company) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 }
      );
    }

    const employeeDocs = await Employee.find({
      _id: { $in: (company.employees as CompanyEmployeeEntry[]).map((emp) => emp.employeeId) },
    });

    const walletByEmployeeId = new Map(
      employeeDocs.map((emp) => [emp._id.toString(), emp.walletAddress])
    );

    const employees = (company.employees as CompanyEmployeeEntry[]).map((emp) => ({
      employeeId: emp.employeeId.toString(),
      employeeName: emp.employeeName,
      email: emp.email,
      position: emp.position || "",
      country: emp.country,
      salaryUsd: emp.salaryUsd,
      walletAddress: walletByEmployeeId.get(emp.employeeId.toString()) || null,
    }));

    const transactions = (company.transactions as CompanyTransactionEntry[]).map((tx) => ({
      id: tx._id?.toString() ?? "",
      employeeId: tx.employeeId.toString(),
      employeeName: tx.employeeName,
      amount: tx.amount,
      status: tx.status,
      time: tx.time,
      token: (tx as any).token || "USDC",
    }));

    return NextResponse.json({
      company: {
        id: company._id.toString(),
        companyName: company.companyName,
        ownerName: company.ownerName,
        email: company.email,
        createdAt: company.createdAt,
      },
      employees,
      transactions,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
