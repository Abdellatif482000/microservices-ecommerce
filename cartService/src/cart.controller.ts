import type { Express, Request, Response } from "express"; // Import only the types
import dotenv from "dotenv";
import mongoose from "mongoose";
import { log } from "console";

// -----------------
const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { default: CartServices } = await import(`./cart.service${EXT}`);
// _________________

class CartController {
  static async initCart(req: Request, res: Response) {
    try {
      const cartService = new CartServices(req.body.userID);
      const newCart: any = await cartService.initCart();
      newCart ? await newCart.save() : null;

      res.status(200).json(newCart);
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  }
  static async addToCart(req: Request, res: Response) {
    // console.log(req.tokenState.data.userID);
    try {
      const cartService = new CartServices(req.tokenState?.data.userID);
      const newToCart: any = await cartService.checkInventoryAndddToCart(
        req.body.prodID
      );

      newToCart.cart ? await newToCart.cart.save() : null;
      if (newToCart.msg === "prod added successfully to cart") {
        await cartService.updateInventoryValue(
          newToCart.product._id,
          newToCart.product.inventory
        );
      }

      res.status(200).json(newToCart);
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  }
  static async getCart(req: Request, res: Response) {
    const cartService = new CartServices(req.tokenState?.data.userID);
    const foundCart: any = await cartService.getCart();
    res.status(200).json({ message: "Cart Found", cart: foundCart });
  }
  static async changeAmount(req: Request, res: Response) {
    const cartService = new CartServices(req.tokenState?.data.userID);
    const updatedCart = await cartService.changeAmount(
      req.body.prodID,
      req.body.changeAction
    );
    if (
      updatedCart?.massage === "product increased by one" ||
      updatedCart?.massage === "product decreased by one"
    ) {
      const savemsg = await updatedCart.targetCart.save();
      console.log(!savemsg);
      await cartService.updateInventoryValue(
        updatedCart.prodID,
        updatedCart.inventory
      );
    }
    res.status(200).send(updatedCart);
  }
  static async deleteProduct(req: Request, res: Response) {
    const cartService = new CartServices(req.tokenState?.data.userID);
    const cartAfterProduct: any = await cartService.deleteProduct(
      req.body.prodID
    );
    res.status(200).send(cartAfterProduct);
    console.log(cartAfterProduct);
  }
  static async clearCart(req: Request, res: Response) {
    try {
      const cartService = new CartServices(req.tokenState?.data.userID);
      const foundCart: any = await cartService.clearCart();
      const clearedCart = await foundCart.save();
      res.status(200).json({ message: "Cart cleared", cart: clearedCart });
    } catch (error) {
      log(error);
      res.status(400).send(error);
    }
  }
}

export default CartController;
