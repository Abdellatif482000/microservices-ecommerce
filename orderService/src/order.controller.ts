import type { Request, Response } from "express";
import { log } from "node:console";

const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { default: OrderServices } = await import(`./order.service${EXT}`);

class OrderController {
  static async initOrderList(req: Request, res: Response) {
    try {
      const orderService = new OrderServices(req.body.userID);
      const newOrderList: any = await orderService.initOrderList();
      newOrderList ? await newOrderList.save() : null;

      res.status(200).json(newOrderList);
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  }
  static async checkout(req: Request, res: Response) {
    try {
      const orderService = new OrderServices(req.tokenState?.data.userID, {
        address: req.body.address,
        phoneNum: req.body.phoneNum,
      });
      const checkout = await orderService.checkout(req.body.paymentMethod);

      if (checkout.msg === "order confirmed") {
        checkout.orderlist.save();
        // res.status(200).json({ checkout: checkout });
        const targetCart = await orderService.clearCart();
        res.status(200).json({ targetCart: targetCart, checkout: checkout });
      }
    } catch (err) {
      log(err);
      res.status(400).send(err);
    }
  }
  static async getOrders(req: Request, res: Response) {
    console.log(req.tokenState?.data.userID);
    const orderService = new OrderServices(req.tokenState?.data.userID);
    const foundOrders = await orderService.getOrderlist();

    res.status(200).send(foundOrders);
  }
  static async filterOrders(req: Request, res: Response) {
    const orderService = new OrderServices(req.session.userSessionData as any);
    const orderByStatus = await orderService.filterOrdersByStatus(
      req.body.status
    );

    res.status(200).send(orderByStatus);
  }
  static async manageOrderStatus(req: Request, res: Response) {
    const orderService = new OrderServices(req.session.userSessionData as any);
    const foundOrder = await orderService.manageOrderStatus(
      req.body.orderID,
      req.body.newStatus
    );

    foundOrder.save();

    res.status(200).send(foundOrder);
  }
}
export default OrderController;
