import type { Request, Response } from "express"; // Import only the types
import { error, log } from "node:console";

const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { default: PaymentServices } = await import(`./payment.service${EXT}`);

const { paymentModel } = await import(`./payment.model${EXT}`);

class PaymentController {
  static async initPaymentList(req: Request, res: Response) {
    try {
      const paymentService = new PaymentServices({ ID: req.body.userID });
      const newList = await paymentService.initPaymentList();
      const savedList = await newList.save();

      res.status(200).json(savedList);
    } catch (error) {}
  }
  static async newBraintreeAcc(req: Request, res: Response) {
    try {
      const braintreeService = new PaymentServices(req.body);
      const newCustomer = await braintreeService.createCustomerBraintree();
      log(newCustomer);
      res.status(200).json(newCustomer);
    } catch (err) {
      res.status(400).send(err);
      throw new Error("Faild to create new customer");
    }
  }

  static async transactionWithCardData(req: Request, res: Response) {
    try {
      // log(req.tokenState?.data.userID);
      const braintreeService = new PaymentServices({
        ID: req.tokenState?.data.userID,
      });
      const transaction = await braintreeService.transactionWithCardData(
        req.body.amount,
        req.body.cardData
      );

      if (transaction.msg === "Transaction Successed") {
        const savedPaymentList = await transaction.targetPaymentList.save();

        res
          .status(200)
          .json({
            braintreeMSG: transaction.transactionBeraintree,
            savedPaymentList: savedPaymentList,
          });
      }
    } catch (error) {
      // throw new Error("failed to make transaction");
      // res.status(400).json(error);
    }
  }
}

export default PaymentController;
