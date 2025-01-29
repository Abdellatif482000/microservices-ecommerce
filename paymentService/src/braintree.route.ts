import { Router, json } from "express";

const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { default: BraintreeController } = await import(
  `./braintree.controller${EXT}`
);

const braintreeRoutes = Router();

braintreeRoutes.post("/newCustomer", BraintreeController.newCustomer);

export default braintreeRoutes;
