import axios from "axios";
import type { CartItem, newCartTypes } from "./cart.type.ts";
import crypto from "crypto";

// -----------------
const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";

const { default: CartModel } = await import(`./cart.model${EXT}`);
const { appKeys } = await import(`./app.keys${EXT}`);

// ----------------------------

class CartServices {
  userID: any;

  constructor(userID = "") {
    this.userID = userID;
  }

  async tergetProduct(prodID: string) {
    const targetProd = await axios.get(
      `http://product:8081/product/getSingleProduct/${prodID}`
    );
    console.log(targetProd.data.product);
    return targetProd.data.product;
  }

  async updateInventoryValue(prodID: string, newValue: number) {
    const header = Buffer.from(
      JSON.stringify({ alg: "HS256", typ: "JWT" })
    ).toString("base64url");
    const body = Buffer.from(
      JSON.stringify({
        userID: "6797b4c6734e754005b251e9",
        userRole: "user",
      })
    ).toString("base64url");

    const signature = crypto
      .createHmac("sha256", appKeys.JWT_SECRET)
      .update(`${header}.${body}`)
      .digest("base64url");

    const targetProd = await axios.put(
      "http://product:8081/product/updateProduct",
      { prodID: prodID, newValue: newValue, fieldName: "inventory" },
      {
        headers: {
          Authorization: `Bearer ${header}.${body}.${signature}`,
        },
      }
    );
    console.log("inv after save >>> : ", targetProd.data);
  }

  async initCart() {
    const newCartData: newCartTypes = {
      userID: this.userID,
      items: [],
      totalCartPrice: 0,
    };
    const cartModel = new CartModel(newCartData);

    return cartModel;
  }
  async getCart() {
    const targetCart: object | any = await CartModel.findOne({
      userID: this.userID,
    });
    return targetCart;
  }

  async checkInventoryAndddToCart(prodID: string): Promise<any> {
    const targetProduct: any = await this.tergetProduct(prodID);
    // console.log("targetProduct>>> : ", targetProduct);
    const targetCart = await this.getCart();
    const targetCartItems = targetCart.items;
    const targetProductInventory = targetProduct.inventory;

    // --- check empty Inventory ---
    const emptyInventory =
      targetProductInventory === 0 ? { massage: "out of stock" } : null;

    // --- check existence of prod in cart items ---
    const itemInCart = targetCartItems.find(
      (item: any) => item.productId === prodID
    );
    const itemExist = itemInCart ? { msg: "this product exist in cart" } : null;
    // ----------------------

    if (!emptyInventory && !itemExist) {
      // ---- new item ----
      const newItem: CartItem = {
        productId: prodID,
        productName: targetProduct.productName,
        totalAmount: 1,
        productTotalPrice: targetProduct.price * 1,
      };
      console.log(
        `${targetProduct.productName} inventory before :  =  ${targetProduct.inventory}`
      );
      targetProduct.inventory -= 1; // -1 from inventory
      console.log(
        `${targetProduct.productName} inventory after  : =  ${targetProduct.inventory}`
      );
      // ---- sum prices of products in cart ----
      let totalCartPrice = targetCartItems.reduce(
        (accumulator: number, item: any) => {
          return accumulator + item.productTotalPrice;
        },
        0
      );
      targetCart.totalCartPrice = targetProduct.price + totalCartPrice; // set total price in cart
      targetCart.items.push(newItem); // push item in cart items list
      return {
        msg: "prod added successfully to cart",
        inv: targetProduct.inventory,
        cart: targetCart,
        product: targetProduct,
      };
    } else {
      // return emptyInventory || itemExist;
      if (emptyInventory) return emptyInventory;
      if (itemExist) return { msg: "item Exist in cart", cart: targetCart };
    }
  }

  async changeAmount(prodID: string, changeAction: string): Promise<any> {
    const targetCart = await this.getCart();
    const targetCartItems = targetCart.items;
    // --- check existence of prod in cart items ---
    const itemInCart = targetCartItems.find(
      (item: any) => item.productId === prodID
    );
    // --- check inventory -----
    const targetProduct: any = await this.tergetProduct(prodID);

    if (itemInCart) {
      if (changeAction === "increase") {
        if (targetProduct.inventory === 0) {
          return {
            massage: "out of stock",
            targetCart: targetCart,
            inventory: targetProduct.inventory,
            amountInCart: itemInCart.totalAmount,
            price: targetProduct.price,
            productTotalPrice: itemInCart.productTotalPrice,
            totalCartPrice: targetCart.totalCartPrice,
          };
        } else {
          // ----- increase product -----
          itemInCart.totalAmount += 1; // increase by one
          // recalculate total price of product in cart
          itemInCart.productTotalPrice =
            targetProduct.price * itemInCart.totalAmount;
          let calculatedTotalCartPrice = targetCart.items.reduce(
            (accumulator: number, item: any) => {
              return accumulator + item.productTotalPrice;
            },
            0
          );
          targetCart.totalCartPrice = calculatedTotalCartPrice;
          targetProduct.inventory -= 1; // decrease inventory by one

          console.log(
            `----------------------- \n Amount ${itemInCart.totalAmount} * Price ${targetProduct.price} = total ${itemInCart.productTotalPrice} \n -------------------------`
          );

          return {
            massage: "product increased by one",
            prodID: prodID,
            targetCart: targetCart,
            targetProduct: targetProduct,
            inventory: targetProduct.inventory,
            amountInCart: itemInCart.totalAmount,
            price: targetProduct.price,
            productTotalPrice: itemInCart.productTotalPrice,
            totalCartPrice: targetCart.totalCartPrice,
          };
        }
      } else if (changeAction === "decrease") {
        if (itemInCart.totalAmount === 1) {
          return { massage: "cart can't contain 0 amount of product" };
        } else {
          itemInCart.totalAmount -= 1; // decrease product by 1
          // recalculate total price of product in cart
          itemInCart.productTotalPrice =
            targetProduct.price * itemInCart.totalAmount;
          let totalCartPrice = targetCart.items.reduce(
            (accumulator: number, item: any) => {
              return accumulator + item.productTotalPrice;
            },
            0
          );
          targetCart.totalCartPrice = totalCartPrice;
          targetProduct.inventory += 1; // increase invnetory by one
          return {
            massage: "product decreased by one",
            prodID: prodID,
            targetCart: targetCart,
            targetProduct: targetProduct,
            inventory: targetProduct.inventory,
            amountInCart: itemInCart.totalAmount,
            price: targetProduct.price,
            productTotalPrice: itemInCart.productTotalPrice,
            totalCartPrice: targetCart.totalCartPrice,
          };
        }
      }
    }
  }
  async deleteProduct(prodID: string) {
    const targetCart = await this.getCart();
    const targetCartItems = targetCart.items;
    // --- check existence of prod in cart items ---
    const itemInCart = targetCartItems.find(
      (item: any) => item.productId === prodID
    );
    // ----- pull item from cart -------
    if (itemInCart) {
      await CartModel.updateOne(
        { id: targetCart.id },
        { $pull: { items: { productId: prodID } } }
      );
      // ---- return item to invnetory ----
      let calculatedTotalCartPrice = targetCart.items.reduce(
        (accumulator: number, item: any) => {
          return accumulator + item.productTotalPrice;
        },
        0
      );
      // --- recalculate total cart price -----
      targetCart.totalCartPrice =
        calculatedTotalCartPrice - itemInCart.productTotalPrice;
    } else {
      return { message: "item does't exist in cart", targetCart };
    }
    return { message: "item deleted from cart", targetCart };
  }
  async clearCart() {
    const targetCart = await this.getCart();
    const targetCartItems = targetCart.items;

    const emptyCart = !targetCartItems.length
      ? { message: "Cart is Empty" }
      : null;
    if (!emptyCart) {
      targetCartItems.splice(0, targetCartItems.length);
      return targetCart;
    }
  }
}

export default CartServices;
