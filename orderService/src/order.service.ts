import type { newOrderTypes } from "./order.type.ts";

const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";

const { default: OrderModel } = await import(`./order.model${EXT}`);

class OrderServices {
  userID: string;
  // userData: any;

  constructor(userID = "") {
    this.userID = userID;
    // this.userData = userData;
  }

  async initOrderList() {
    const newOrderlistData: newOrderTypes = {
      userID: this.userID,
      orders: [],
    };
    const newOrderlist = new OrderModel(newOrderlistData);
    return newOrderlist;
  }
  async getOrderlist() {
    const targetOrderlist: object | any = await OrderModel.findOne({
      userID: this.userID,
    });

    return targetOrderlist;
  }
  // async checkout(paymentMethod: string) {
  //   const cartService = await new CartServices(this.userID);
  //   const targetCart = await cartService.getCart();
  //   const targetOrderList = await this.getOrderlist();

  //   let orderDetails = {
  //     cartSummary: targetCart.items,
  //     totalPrice: targetCart.totalCartPrice,
  //     shippingAddress: this.userData.address
  //       ? this.userData.address
  //       : "address not provided",
  //     phoneNum: this.userData.phoneNum
  //       ? this.userData.phoneNum
  //       : "phoneNum not provided",
  //     paymentMethod: paymentMethod,
  //     orderStatus: "pending",
  //   };

  //   if (targetCart.items.length) {
  //     if (paymentMethod === "cashOnDelivery") {
  //       orderDetails.orderStatus = "processing";
  //     }
  //   }
  //   targetOrderList.orders.push(orderDetails);
  //   targetCart.items.splice(0, targetCart.items.length);

  //   // return targetOrderList;
  //   return { cart: targetCart, orderlist: targetOrderList };
  // }
  async filterOrdersByStatus(status: string) {
    const foundOrders: object | any = await OrderModel.find({
      "orders.orderStatus": status,
    });
    const ordersByStatus = await foundOrders.flatMap((list: any) =>
      list.orders.filter((order: any) => order.orderStatus === status)
    );

    return ordersByStatus;
  }
  async getOrderByID(orderID: string) {
    const foundOrderlist: any = await OrderModel.findOne({
      "orders.orderID": orderID,
    });

    return foundOrderlist;
  }

  async manageOrderStatus(orderID: string, newStatus: string) {
    const targetOrderlist = await this.getOrderByID(orderID);
    const orderByID: any = targetOrderlist.orders.find(
      (order: any) => order.orderID.toString() === orderID
    );
    if (orderByID.orderStatus === "pending" && newStatus !== "processing") {
      return {
        massage: "can't swap form pending to anthing except processing",
      };
    } else if (
      orderByID.orderStatus === "processing" &&
      newStatus !== "shipped"
    ) {
      return {
        massage: "can't swap form processing to anthing except shipped",
      };
    } else if (
      orderByID.orderStatus === "shipped" &&
      newStatus !== "delivered"
    ) {
      return {
        massage: "can't swap form shipped to anthing except delivered",
      };
    } else {
      orderByID.orderStatus = newStatus;
      return targetOrderlist;
    }
  }
}

export default OrderServices;
