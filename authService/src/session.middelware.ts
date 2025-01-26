import { Request, Response, NextFunction } from "express";
export const getSessionData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.userSessionData) {
    return next();
  } else {
    res.send("no session data provided");
  }
};
