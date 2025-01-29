import { Router, json } from "express";

const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { default: PaymentController } = await import(
  `./payment.controller${EXT}`
);
const { default: VerifyClass } = await import(
  `./verifications.middelware${EXT}`
);

const paymentRoutes = Router();

paymentRoutes.post("/newPaymentList", PaymentController.initPaymentList);

paymentRoutes.post(
  "/braintree/newCustomer/",
  PaymentController.newBraintreeAcc
);
paymentRoutes.post(
  "/braintree/payByCard",
  VerifyClass.verifyToken,
  PaymentController.transactionWithCardData
);

export default paymentRoutes;
