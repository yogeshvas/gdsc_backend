import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
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
    rollNo: {
      type: Number,
      required: true,
      unique: true,
    },
    phoneNo: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);
