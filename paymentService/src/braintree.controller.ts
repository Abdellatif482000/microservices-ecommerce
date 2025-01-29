import type { Request, Response } from "express"; // Import only the types
import { error, log } from "node:console";

const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { default: BraintreeServices } = await import(
  `./braintree.service${EXT}`
);

class BraintreeController {
  static async newCustomer(req: Request, res: Response) {
    try {
      const braintreeService = new BraintreeServices(req.body);
      const newCustomer = await braintreeService.createCustomer();
      log(newCustomer);
      res.status(200).json(newCustomer);
    } catch (err) {
      res.status(400).send(err);
      throw new Error("Faild to create new customer");
    }
  }
}

export default BraintreeController;
