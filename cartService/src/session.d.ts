import { Session } from "express-session";

declare module "express-session" {
  interface SessionData {
    userSessionData?: {
      id: string;
      username: string;
      email: string;
      role: "admin" | "customer";
      orderlist: any;
      cart: any;
    };
  }
}
