import { Router } from "express";

// -----------------
const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { default: CartController } = await import(`./cart.controller${EXT}`);
const { default: VerifyClass } = await import(
  `./verifications.middelware${EXT}`
);
// ----------------------------

const cartRoutes = Router();

cartRoutes.post("/initCart", CartController.initCart);

cartRoutes.post(
  "/addToCart",
  VerifyClass.verifyToken,
  VerifyClass.verifyRole("user"),
  CartController.addToCart
);
cartRoutes.put(
  "/changeAmount",
  VerifyClass.verifyToken,
  VerifyClass.verifyRole("user"),
  CartController.changeAmount
);
cartRoutes.get(
  "/getCart",
  VerifyClass.verifyToken,
  VerifyClass.verifyRole("user"),
  CartController.getCart
);
cartRoutes.put(
  "/clearCart",
  VerifyClass.verifyToken,
  VerifyClass.verifyRole("user"),
  CartController.clearCart
);
cartRoutes.put(
  "/deleteProductFromCart",
  VerifyClass.verifyToken,
  VerifyClass.verifyRole("user"),
  CartController.deleteProduct
);

export default cartRoutes;
