import mongoose, { Schema, models, model } from "mongoose";

const EmployeeSchema = new Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    position: {
      type: String,
      default: "",
    },

    salary: {
      type: Number,
      default: 0,
    },

    walletAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Employee =
  models.Employee || model("Employee", EmployeeSchema);

export default Employee;