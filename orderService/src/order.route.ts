import { Router } from "express";

// ----------------------------
const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { default: OrderController } = await import(`./order.controller${EXT}`);
const { default: VerifyClass } = await import(
  `./verifications.middelware${EXT}`
);

// ----------------------------

const orderRoutes = Router();

orderRoutes.post(
  "/initOrderList",
  // VerifyClass.verifyToken,
  OrderController.initOrderList
);

orderRoutes.post(
  "/checkout",
  // VerifyClass.verifyToken,
  OrderController.checkout
);
orderRoutes.get(
  "/getOrders",
  // VerifyClass.verifyToken,
  OrderController.getOrders
);
orderRoutes.post(
  "/manageOrderStatus",
  // VerifyClass.verifyToken,
  // VerifyClass.verifyRole("admin"),
  OrderController.manageOrderStatus
);
orderRoutes.get(
  "/filterByStatus",
  // VerifyClass.verifyToken,
  // VerifyClass.verifyRole("admin"),
  OrderController.filterOrders
);
// orderRoutes.put("/deleteProductFromCart", VerifyClass.verifyToken, deleteProductFromCart);
// orderRoutes.put("/clearCart", VerifyClass.verifyToken, clearCart);

export default orderRoutes;
