import mongoose, { Schema } from "mongoose";

const cartSchema: mongoose.Schema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      productId: { type: String },
      productName: { type: Object },
      totalAmount: { type: Number, default: 1 },
      productTotalPrice: { type: Number, default: 1 },
    },
  ],
  totalCartPrice: { type: Number },
});

const CartModel = mongoose.model("Carts", cartSchema);
export default CartModel;
