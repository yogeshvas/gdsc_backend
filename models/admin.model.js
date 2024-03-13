import mongoose from "mongoose";

const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    empId: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Converts email to lowercase
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phoneNumber: {
      type: String,
      required: false, // Depending on your requirements, this can be optional or mandatory
      trim: true,
    },
    role: {
      type: [String], // An array of strings to hold multiple roles
      required: true,
    },
  },
  { timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
