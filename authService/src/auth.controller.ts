import express from "express";
import type { Request, Response } from "express"; // Import only the types

const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { default: AuthServices } = await import(`./auth.service${EXT}`);
const { validateReqData } = await import(`./validate.utils${EXT}`);

const authService = new AuthServices();

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const dataValidation = await validateReqData(req);
      // -----------------------------------
      if (dataValidation.message === "not valid")
        res.status(400).json(dataValidation);
      // -----------------------------------
      if (dataValidation.message === "valid") {
        const newUser: any = await authService.register(
          req.params.role,
          req.body
        );
        const savedUser = await newUser.userModel.save();
        const savedCart = await authService.newCart(savedUser.id);
        const savedOrderList = await authService.newOrderList(savedUser.id);

        res.status(200).json({
          savedUser: savedUser,
          savedCart: savedCart,
          savedOrderList: savedOrderList,
        });
      }
    } catch (err: any) {
      console.error(err);
      res.status(400).send(err.errorResponse);
    }
  }

  static async signin(req: Request, res: Response) {
    try {
      const dataValidation = await validateReqData(req);
      // -----------------------------------
      if (dataValidation.message === "not valid")
        res.status(400).json(dataValidation);
      // -----------------------------------
      if (dataValidation.message === "valid") {
        const newUser: any = await authService.signin(
          req,
          res,
          req.params.role,
          req.body
        );
        res.status(200).json(newUser);
      }
    } catch (err: any) {
      console.error(err);
      res.status(400).send(err.errorResponse);
    }
  }
  static logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      res.clearCookie("token", { path: "/" });
      res.send("session ended");
    });
  }
}
