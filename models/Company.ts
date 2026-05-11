import mongoose, { Schema, models, model } from "mongoose";

const CompanySchema = new Schema(
  {
    companyName: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    employees: [{
      employeeId: { type: mongoose.Schema.Types.ObjectId, required: true },
      employeeName: { type: String, required: true },
      email: { type: String, required: true },
      position: { type: String, default: "" },
      walletAddress: { type: String, default: null },
      country: { type: String, required: true },
      salaryUsd: { type: Number, required: true },
    }],
    transactions: [{
      employeeId: { type: mongoose.Schema.Types.ObjectId, required: true },
      employeeName: { type: String, required: true },
      email: { type: String, required: true },
      amount: { type: Number, required: true },
      status: { type: String, required: true },
      token: { type: String, default: "USDC" },
      time: { type: String, required: true },
    }]
  },
  { timestamps: true }
);

const Company = models.Company || model("Company", CompanySchema);
export default Company;