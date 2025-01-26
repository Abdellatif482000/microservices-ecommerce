import { Router, json } from "express";
import { checkSchema } from "express-validator";
// import AuthValidator from "./auth.validator.js";
// import { AuthController } from "./auth.controller.js";
const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";

const { default: AuthValidator } = await import(`./auth.validator${EXT}`);
const { AuthController } = await import(`./auth.controller${EXT}`);

const authRoutes = Router();

authRoutes.post(
  "/singup/:role",
  checkSchema(AuthValidator.signupVaildator),
  AuthController.signup
);

authRoutes.get(
  "/signin/:role",
  // checkSchema(AuthValidator.signinValidator),
  AuthController.signin
);
authRoutes.get("/logout", AuthController.logout);
export default authRoutes;
