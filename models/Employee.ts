import mongoose, { Schema, models, model } from "mongoose";

const EmployeeSchema = new Schema(
  {
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