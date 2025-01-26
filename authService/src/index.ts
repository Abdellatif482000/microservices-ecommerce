import express from "express";
import type { Request, Response } from "express"; // Import only the types

import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
// const MongoDBStore = require("connect-mongodb-session")(session);
// _________________

dotenv.config();
// const store: any = new MongoDBStore({
//   uri: process.env.REALSTATE_DATABASE_URL,
//   collection: "sessions",
// });

const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { default: authRoutes } = await import(`./auth.route${EXT}`);
const { default: connectMongoDB } = await import(`./mongo.database${EXT}`);

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

  app.get("/auth", async (req: Request, res: Response) => {
    res.send("authAPi is Ready");
  });
  app.use("/auth", authRoutes);

  const port = 8084;

  app.listen(port, () => {
    console.log(
      `authService Server is running on http://localhost:${port}/auth`
    );
  });
}
startServer().catch((error) => {
  console.error("Error starting the server:", error);
});
