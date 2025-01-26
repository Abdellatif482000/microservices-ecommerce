import { Router, json } from "express";
// --------------------------------

// import ProdcutValidator from "./product.validator.js";
// import checkSchema from "express-validator";

// --------------------------------
const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { default: ProductController } = await import(
  `./product.controller${EXT}`
);
const { default: VerifyClass } = await import(
  `./verifications.middelware${EXT}`
);
// --------------------------------

const productRoutes = Router();
productRoutes.post(
  "/admin/createProduct",
  VerifyClass.verifyToken,
  VerifyClass.verifyRole("admin"),
  // checkSchema(ProdcutValidator.validateCreateProduct),
  ProductController.createProduct
);
productRoutes.get(
  "/getSingleProduct/:prodID",
  ProductController.getSingleProduct
);
productRoutes.get(
  "/getProductsByCategory/:category",
  ProductController.getProductsByCategory
);

productRoutes.put(
  "/updateProduct",
  VerifyClass.verifyToken,
  VerifyClass.verifyRole("admin"),
  // checkSchema(ProdcutValidator.validateModifyProduct),
  ProductController.modifyProduct
);
productRoutes.delete(
  "/deleteProduct",
  VerifyClass.verifyToken,
  VerifyClass.verifyRole("admin"),
  ProductController.deleteProduct
);

export default productRoutes;
