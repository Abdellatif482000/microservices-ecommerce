import mongoose from "mongoose";

const productSchema: mongoose.Schema = new mongoose.Schema({
  productName: { type: String, require: true },
  description: { type: String },
  price: { type: Number, require: true },
  inventory: { type: Number, require: true },
  category: { type: String, require: true },
  images: { type: String },
  rateing: { type: Number },
});

const ProductModel = mongoose.model("Products", productSchema);

export default ProductModel;
