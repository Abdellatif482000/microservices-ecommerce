import axios from "axios";
import type { newOrderTypes } from "./order.type.ts";
import crypto from "crypto";
import { log } from "console";

const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";

const { default: OrderModel } = await import(`./order.model${EXT}`);
const { appKeys } = await import(`./app.keys${EXT}`);

class OrderServices {
  userID: string;
  userData: any;

  constructor(userID = "", userData = "") {
    this.userID = userID;
    this.userData = userData;
  }
  // async tergetProduct(prodID: string) {
  //   const targetProd = await axios.get(
  //     `http://product:8081/product/getSingleProduct/${prodID}`
  //   );
  //   console.log(targetProd.data.product);
  //   return targetProd.data.product;
  // }

  async tergetCart() {
    const header = Buffer.from(
      JSON.stringify({ alg: "HS256", typ: "JWT" })
    ).toString("base64url");
    const body = Buffer.from(
      JSON.stringify({
        userID: "679256cdf3caf9e8f3fae5c3",
        userRole: "user",
      })
    ).toString("base64url");

    const signature = crypto
      .createHmac("sha256", appKeys.JWT_SECRET)
      .update(`${header}.${body}`)
      .digest("base64url");

    const targetCart = await axios.get(`http://cart:8082/cart/getCart/`, {
      headers: { Authorization: `Bearer ${header}.${body}.${signature}` },
    });

    return targetCart.data;
  }

  async clearCart() {
    const header = Buffer.from(
      JSON.stringify({ alg: "HS256", typ: "JWT" })
    ).toString("base64url");
    const body = Buffer.from(
      JSON.stringify({
        userID: "679256cdf3caf9e8f3fae5c3",
        userRole: "user",
      })
    ).toString("base64url");

    const signature = crypto
      .createHmac("sha256", appKeys.JWT_SECRET)
      .update(`${header}.${body}`)
      .digest("base64url");

    const targetCart = await axios.put(`http://cart:8082/cart/clearCart/`, {
      headers: { Authorization: `Bearer ${header}.${body}.${signature}` },
    });

    return targetCart.data;
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
  async checkout(paymentMethod: string) {
    const targetCart = await this.tergetCart();

    const targetOrderList = await this.getOrderlist();

    let orderDetails = {
      cartSummary: targetCart.items,
      totalPrice: targetCart.totalCartPrice,
      shippingAddress: this.userData.address
        ? this.userData.address
        : "address not provided",
      phoneNum: this.userData.phoneNum
        ? this.userData.phoneNum
        : "phoneNum not provided",
      paymentMethod: paymentMethod,
      orderStatus: "pending",
    };

    // if (targetCart.items.length) {
    //   if (paymentMethod === "cashOnDelivery") {
    //     orderDetails.orderStatus = "processing";
    //   }
    // }
    // targetOrderList.orders.push(orderDetails);

    // return targetOrderList;
    return {
      msg: "order confirmed",
      orderlist: targetOrderList,
    };
  }
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
