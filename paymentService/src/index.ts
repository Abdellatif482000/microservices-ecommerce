import express from "express";
import type { Request, Response } from "express"; // Import only the types
import cors from "cors";
import dotenv from "dotenv";
import { log } from "console";

// _________________

dotenv.config();

const EXT = process.env.NODE_ENV === "prod" ? ".js" : ".ts";
const { default: paymentRoutes } = await import(`./payment.route${EXT}`);
const { default: connectMongoDB } = await import(`./mongo.database${EXT}`);
const { braintreeGateway } = await import(`./conf${EXT}`);

async function startServer() {
  const app = express();
  app.use(cors({ origin: "*" }));
  app.use(express.json());
  app.use("/payment/", paymentRoutes);

  connectMongoDB();

  app.get("/payment/test", async (req: Request, res: Response) => {
    // const token = await braintreeGateway.clientToken.generate({});
    // const transaction = await braintreeGateway.transaction.sale({
    //   amount: 123,
    //   creditCard: {
    //     number: "4111111111111111",
    //     expirationDate: "06/2022",
    //     cvv: "100",
    //   },
    //   customer: {
    //     firstName: "asd",
    //     email: "asd@dasdad.com",
    //   },
    //   options: {
    //     submitForSettlement: true, // Automatically settle the transaction
    //   },
    // });

    const transaction = await braintreeGateway.transaction.find("np09607y");

    log(transaction);
    res.send(transaction);
  });
  app.get("/payment", async (req: Request, res: Response) => {
    res.send("paymentAPi is Ready");
  });

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
