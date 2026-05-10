import mongoose, { Schema, models, model } from "mongoose";

const CompanySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
    },

    ownerName: {
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
  },
  {
    timestamps: true,
  }
);

const Company =
  models.Company || model("Company", CompanySchema);

export default Company;