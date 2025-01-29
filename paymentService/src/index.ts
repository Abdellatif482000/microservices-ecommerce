import express from "express";
import type { Request, Response } from "express"; // Import only the types
import cors from "cors";
import dotenv from "dotenv";
import { log } from "console";

// _________________

dotenv.config();

const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { default: braintreeRoutes } = await import(`./braintree.route${EXT}`);
const { default: connectMongoDB } = await import(`./mongo.database${EXT}`);

async function startServer() {
  const app = express();
  app.use(cors({ origin: "*" }));
  app.use(express.json());

  connectMongoDB();

  app.get("/payment/test", async (req: Request, res: Response) => {
    // res.send(clientToken);
  });
  app.get("/payment", async (req: Request, res: Response) => {
    res.send("paymentAPi is Ready");
  });
  app.use("/payment/braintree/", braintreeRoutes);

  const port = 8085;

  app.listen(port, () => {
    console.log(
      `paymentService Server is running on http://localhost:${port}/payment`
    );
  });
}
startServer().catch((error) => {
  console.error("Error starting the server:", error);
});
