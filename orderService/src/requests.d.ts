import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      tokenState?: {
        login: boolean;
        data: any;
      };
    }
  }
}
