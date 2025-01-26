import type { Request, Response } from "express";

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
    const orderService = new OrderServices(req.session.userSessionData as any);
    const checkout = await orderService.checkout(req.body.paymentMethod);
    checkout.cart.save();
    checkout.orderlist.save();
    res.status(200).send(checkout);
  }
  static async getOrders(req: Request, res: Response) {
    const orderService = new OrderServices(req.session.userSessionData as any);
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
