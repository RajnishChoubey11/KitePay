import mongoose, { Schema, models, model } from "mongoose";

const EmployeeSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    position: { type: String, default: "" },
    walletAddress: { type: String, default: null },
    country: { type: String, default: "" },
    bankName: { type: String, default: null },
    accountNumber: { type: String, default: null },
    ifscCode: { type: String, default: null },
    transactions: [{
      companyId: { type: mongoose.Schema.Types.ObjectId, required: true },
      companyName: { type: String, required: true },
      amount: { type: Number, required: true },
      status: { type: String, required: true },
      time: { type: String, required: true },
    }]
  },
  {
    timestamps: true,
  }
);

const Employee =
  models.Employee || model("Employee", EmployeeSchema);

export default Employee;