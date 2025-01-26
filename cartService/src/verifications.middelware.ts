import jwt, { decode } from "jsonwebtoken";
import Cookies from "cookies";
import type { Request, Response, NextFunction } from "express"; // Import only the types

// import { appKeys } from "./app.keys.js";

// --------------------------------

const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";

const { appKeys } = await import(`./app.keys${EXT}`);
// --------------------------------

class VerifyClass {
  // decodedToken: string | jwt.JwtPayload;
  static decodedToken: string | jwt.JwtPayload;

  constructor(decodedToken: "") {
    decodedToken = decodedToken;
  }
  static verifyToken(req: Request, res: Response, next: NextFunction): void {
    try {
      // const cookies = new Cookies(req, res);
      // const token: any = cookies.get("token");
      const token: any = req.header("Authorization")?.split(" ")[1];

      if (!token) {
        res.status(401).json("notoken");
        // res.status(401).json(token);
      }
      VerifyClass.decodedToken = jwt.verify(token, appKeys.JWT_SECRET!);
      console.log("decodedToken>>> : ", VerifyClass.decodedToken);
      req.tokenState = {
        login: true,
        data: VerifyClass.decodedToken,
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
        // const userRole = req.session?.userSessionData?.role;
        // console.log("req >>: ", req);
        const userRole = VerifyClass.decodedToken.userRole;
        const userID = VerifyClass.decodedToken.userID;
        // console.log("JWT Payload:", VerifyClass.decodedToken.role);
        if (!userRole || !userID) {
          res.status(403).json({ error: "No role provided" });
        } else {
          if (userRole !== requiredRole) {
            res.status(403).json({ error: "Forbidden: Insufficient role" });
          }
        }

        next();
      } catch (err) {
        next(err);
      }
    };
  }
}

export default VerifyClass;
