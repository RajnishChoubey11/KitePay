import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Company from "@/models/Company";
import Employee from "@/models/Employee";
import { demoEmployees } from "@/lib/demoData";

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

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET as string);

    await connectDB();

    let company;
    let employees;

    // Handle demo company
    if (params.id === "demo-company-id") {
      company = {
        _id: "demo-company-id",
        companyName: "KitePay Demo Company",
        ownerName: "Demo Owner",
        email: "company@kitepay.demo",
        createdAt: new Date().toISOString(),
      };
      employees = demoEmployees.map((emp) => ({
        id: emp.id,
        name: emp.name,
        email: emp.email,
        position: "Employee",
        walletAddress: emp.wallet ? emp.wallet : null,
        createdAt: new Date().toISOString(),
      }));
    } else {
      company = await Company.findById(params.id);

      if (!company) {
        return NextResponse.json(
          { message: "Company not found" },
          { status: 404 }
        );
      }

      // Return demo employees for the demo
      employees = demoEmployees.map((emp) => ({
        id: emp.id,
        name: emp.name,
        email: emp.email,
        position: "Employee", // Default position
        walletAddress: emp.wallet ? emp.wallet : null,
        createdAt: new Date().toISOString(),
      }));
    }

    return NextResponse.json({
      company: {
        id: company._id,
        companyName: company.companyName,
        ownerName: company.ownerName,
        email: company.email,
        createdAt: company.createdAt,
      },
      employees,
    });
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
