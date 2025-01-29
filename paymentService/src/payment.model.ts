import mongoose from "mongoose";

const paymentSchema: mongoose.Schema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  transactions: [
    {
      transactionID: { type: String },
      transctionData: { type: String },
      transctionAmount: { type: Number },
      paymentTool: { type: String },
    },
  ],
});

export const PaymentModel = mongoose.model("Payments", paymentSchema);
