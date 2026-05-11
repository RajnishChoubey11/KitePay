import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Company from "@/models/Company";
import Employee from "@/models/Employee";
import jwt from "jsonwebtoken";

type CompanyEmployeeEntry = {
  employeeId: { toString: () => string };
  position?: string;
};

export async function POST(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  try {
    const params = await paramsPromise;
    const { employeeId, salaryUsd } = await req.json();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET as string);
    await connectDB();

    const company = await Company.findById(params.id);
    const employee = await Employee.findById(employeeId);

    if (!company || !employee) {
      return NextResponse.json({ message: "Company or Employee not found" }, { status: 404 });
    }

    // Check if already added
    const exists = (company.employees as CompanyEmployeeEntry[]).find(
      (e) => e.employeeId.toString() === employeeId
    );
    if (exists) {
      return NextResponse.json({ message: "Employee already in team" }, { status: 400 });
    }

    company.employees.push({
      employeeId: employee._id,
      employeeName: employee.name,
      email: employee.email,
      position: employee.position || "",
      walletAddress: employee.walletAddress || null,
      country: employee.country || "Unknown",
      salaryUsd: salaryUsd || 0,
    });

    await company.save();

    return NextResponse.json({ message: "Employee added successfully", employees: company.employees });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  try {
    const params = await paramsPromise;
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET as string);
    await connectDB();

    const company = await Company.findById(params.id);
    if (!company) {
      return NextResponse.json({ message: "Company not found" }, { status: 404 });
    }

    company.employees = (company.employees as CompanyEmployeeEntry[]).filter(
      (e) => e.employeeId.toString() !== employeeId
    );
    await company.save();

    return NextResponse.json({ message: "Employee removed successfully", employees: company.employees });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
