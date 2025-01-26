import express from "express";
import type { Request, Response } from "express"; // Import only the types

import session from "express-session";
// const MongoDBStore = require("connect-mongodb-session")(session);

import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { log } from "console";

// -----------------
const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { default: productRoutes } = await import(`./product.route${EXT}`);
const { default: connectMongoDB } = await import(`./mongo.database${EXT}`);
// _________________

dotenv.config();
// const store: any = new MongoDBStore({
//   uri: process.env.REALSTATE_DATABASE_URL,
//   collection: "sessions",
// });

async function startServer() {
  const app = express();
  app.use(cors({ origin: "*" }));
  app.use(express.json());
  app.use(cookieParser());
  // app.use(
  //   session({
  //     secret: process.env.SESSION_SECRET!,
  //     name: "sessionID",
  //     store: store,
  //     resave: false,
  //     saveUninitialized: false,
  //     cookie: {
  //       httpOnly: true,
  //       // secure: true,
  //       maxAge: 60 * 60 * 1000,
  //     },
  //   })
  // );

  connectMongoDB();

  app.get("/product", async (req: Request, res: Response) => {
    res.send("prodcutAPi is Ready");
    console.log("prodcutAPi is Ready");
  });
  app.use("/product", productRoutes);

  const port = 8081;

  app.listen(port, () => {
    console.log(
      `productService Server is running on http://localhost:${port}/product`
    );
  });
}
startServer().catch((error) => {
  console.error("Error starting the server:", error);
});
