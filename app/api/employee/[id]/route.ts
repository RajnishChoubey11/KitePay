import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";
import Company from "@/models/Company";

type JwtPayload = {
  id: string;
  type: string;
};

type CompanyEmployeeEntry = {
  employeeId: { toString: () => string };
  salaryUsd: number;
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
    if (payload.type !== "EMPLOYEE" || payload.id !== params.id) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }

    await connectDB();
    const employee = await Employee.findById(params.id);

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    const company = await Company.findOne({
      "employees.employeeId": employee._id,
    });

    const matchedEmployee = company?.employees.find(
      (emp: CompanyEmployeeEntry) =>
        emp.employeeId.toString() === employee._id.toString()
    );

    const salary = matchedEmployee?.salaryUsd || 0;
    const totalReceived = employee.transactions.reduce(
      (sum: number, tx: { status: string; amount: number }) =>
        sum + (tx.status === "Completed" ? tx.amount : 0),
      0
    );
    const available = Math.max(salary - totalReceived, 0);

    return NextResponse.json({
      employee: {
        id: employee._id.toString(),
        name: employee.name,
        email: employee.email,
        position: employee.position,
        walletAddress: employee.walletAddress,
        country: employee.country,
        bankName: employee.bankName,
        accountNumber: employee.accountNumber,
        ifscCode: employee.ifscCode,
        transactions: employee.transactions || [],
        createdAt: employee.createdAt,
      },
      salary,
      available,
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

export async function PATCH(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  try {
    const params = await paramsPromise;
    const body = await req.json();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "No authorization token provided" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    if (payload.type !== "EMPLOYEE" || payload.id !== params.id) {
      return NextResponse.json({ message: "Unauthorized access" }, { status: 403 });
    }

    await connectDB();

    const updatedEmployee = await Employee.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    );

    if (!updatedEmployee) {
      return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      employee: updatedEmployee,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
