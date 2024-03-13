import mongoose from "mongoose";

const fineSchema = new mongoose.Schema(
  {
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Fine = mongoose.model("Fine", fineSchema);
