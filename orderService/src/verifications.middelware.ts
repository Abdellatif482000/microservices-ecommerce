import jwt, { decode } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import Cookies from "cookies";

const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { appKeys } = await import(`./app.keys${EXT}`);

class VerifyClass {
  static verifyToken(req: Request, res: Response, next: NextFunction): void {
    try {
      const cookies = new Cookies(req, res);
      const token: any = cookies.get("token");
      // const token: any = req.header("Authorization")?.split(" ")[1];

      if (!token) {
        res.status(401).json("notoken");
        // res.status(401).json(token);
      }
      const decode = jwt.verify(token, appKeys.JWT_SECRET!);

      req.tokenState = {
        login: true,
        data: decode,
      };

      return next();
    } catch (err) {
      console.error(err);

      res.status(401).send(err);
    }
  }
  static verifyRole(requiredRole: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        const userRole = req.session?.userSessionData?.role;

        if (userRole !== requiredRole) {
          res.status(403).json({ error: "Forbidden: Insufficient role" });
        }

        next();
      } catch (err) {
        next(err);
      }
    };
  }
}

export default VerifyClass;
