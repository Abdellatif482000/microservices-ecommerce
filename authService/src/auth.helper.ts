import express from "express";
import type { Request, Response } from "express"; // Import only the types
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { appKeys } = await import(`./app.keys${EXT}`);

class AuthHelper {
  static async setRole(req: Request) {
    return req.params.role;
  }
  static async generateToken(jwtPayload: object): Promise<string> {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the configuration.");
    }
    console.log("tokenSK", process.env.JWT_SECRET);
    let token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return token;
  }
  static async setCookiesAndSession(
    req: Request,
    res: Response,
    token: string,
    userData: any,
    role: string,
    orderlist: any,
    cart: any
  ) {
    // req.session.userSessionData = {
    //   id: userData._id as string,
    //   username: userData.fullName as string,
    //   email: userData.email as string,
    //   role: role as "admin" | "customer",
    //   orderlist: role === "user" ? orderlist.orders : "no orderList",
    //   cart: role === "user" ? cart.items : "no cart",
    // };

    res.cookie("token", token, {
      secure: false,
      httpOnly: false,
      maxAge: 60 * 60 * 1000,
    });
  }
}

export default AuthHelper;
