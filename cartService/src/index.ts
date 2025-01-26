import express from "express";
import type { Express, Request, Response } from "express"; // Import only the types

import session from "express-session";
// const MongoDBStore = require("connect-mongodb-session")(session);
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// -----------------
const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { default: cartRoutes } = await import(`./cart.route${EXT}`);
const { default: connectMongoDB } = await import(`./mongo.database${EXT}`);
// _________________

dotenv.config();
// const store: any = new MongoDBStore({
//   uri: process.env.REALSTATE_DATABASE_URL,
//   collection: "sessions",
// });

async function startServer() {
  const app: Express = express();
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

  app.get("/cart", async (req: Request, res: Response) => {
    res.send("cartAPi is Ready");
  });
  app.use("/cart", cartRoutes);

  const port = 8082;

  app.listen(port, () => {
    `cartService Server is running on http://localhost:${port}/cart`;
  });
}
startServer().catch((error) => {
  console.error("Error starting the server:", error);
});
