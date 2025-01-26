import mongoose, { Schema } from "mongoose";

const orderSchema: mongoose.Schema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orders: [
    {
      orderID: {
        type: mongoose.Types.ObjectId,
        default: new mongoose.Types.ObjectId(),
      },
      cartSummary: { type: Array },
      shippingAddress: { type: String },
      phoneNum: { type: mongoose.Schema.Types.Mixed },
      paymentMethod: {
        type: String,
      },
      orderStatus: {
        type: String,
      },
      totalPrice: { type: Number },
    },
  ],
});
const OrderModel = mongoose.model("Orders", orderSchema);

export default OrderModel;
