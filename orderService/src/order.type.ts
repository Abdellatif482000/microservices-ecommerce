import mongoose from "mongoose";

export interface newOrderTypes {
  userID: string;
  orders: any[];
}
/*
{
    orderID: string;
    cartSummary: any[];
    shippingAddress: string;
    phoneNum: number;
    paymentMethod: string;
    orderStatus: string;
    totalPrice: number;
  }
*/
