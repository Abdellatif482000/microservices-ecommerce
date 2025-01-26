import express from "express";
import type { Request, Response } from "express"; // Import only the types

import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
// const MongoDBStore = require("connect-mongodb-session")(session);

// _________________
const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { default: orderRoutes } = await import(`./order.route${EXT}`);
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

  app.get("/order", async (req: Request, res: Response) => {
    res.send("orderAPi is Ready");
  });
  app.use("/order", orderRoutes);

  const port = 8083;

  app.listen(port, () => {
    console.log(
      `orderService Server is running on http://localhost:${port}/order`
    );
  });
}
startServer().catch((error) => {
  console.error("Error starting the server:", error);
});
