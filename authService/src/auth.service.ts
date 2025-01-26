import express from "express";
import axios from "axios";
import type { signupInterface, signinInterface } from "./auth.type.ts";

const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { default: AuthHelper } = await import(`./auth.helper${EXT}`);
const { adminModel, customerModel } = await import(`./auth.model${EXT}`);

import bcrypt from "bcryptjs";
// import CartServices from './cart.service';
// import OrderServices from './order.service';
// import BraintreeServices from './braintreePayment.service';

class AuthServices {
  // // private token: string;
  // private role: string;

  // constructor(role = "") {
  //   this.role = role;
  // }

  async newCart(userID: string) {
    const newCart = await axios.post("http://cart:8082/cart/initCart", {
      userID: userID,
    });

    console.log("newCart Res", newCart.data);
    return newCart.data;
  }

  async newOrderList(userID: string) {
    const newOrderList = await axios.post(
      "http://order:8083/order/initOrderList",
      {
        userID: userID,
      }
    );

    console.log("newOrderList Res", newOrderList.data);
    return newOrderList.data;
  }

  async register(role: string, userData: any): Promise<any> {
    // ----------- hashing Pass ---------------
    const salt = await bcrypt.genSalt(10);
    const hashedPass: string = await bcrypt.hash(
      userData.password as string,
      salt
    );
    userData.password = hashedPass;

    // ----------- user Reisteration ---------------

    if (role === "user") {
      const userModel = new customerModel(userData);

      return {
        userModel: userModel,
      };
    }

    // ----------- admin Reisteration ---------------
    if (role === "admin") {
      const userModel = new adminModel(userData);

      return { userModel: userModel };
    }
  }
  async signin(
    req: Request,
    res: Response,
    role: string,
    userData: signinInterface
  ) {
    let foundUser: any;
    //  --------- get user data from db --------
    if (role === "user") {
      foundUser = await customerModel.findOne({ email: userData.email });
    }
    if (role === "admin") {
      foundUser = await adminModel.findOne({ email: userData.email });
    }
    console.log(foundUser);
    // ------ check password -------------
    let isPasswordMatch = await bcrypt.compare(
      userData.password,
      foundUser.password
    );

    // ------- generate token and init session --------
    if (isPasswordMatch) {
      const token = await AuthHelper.generateToken({
        userID: foundUser.id,
        userRole: role,
      });
      await AuthHelper.setCookiesAndSession(req, res, token, foundUser, role);
      return {
        message: "Sign in successfully",
        data: {
          email: foundUser.email,
          fullname: foundUser.fullName,
          token: token,
        },
      };
    } else {
      return { message: "password not match" };
    }
  }
}
export default AuthServices;
