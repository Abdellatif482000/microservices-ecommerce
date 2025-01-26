import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectMongoDB = async () => {
  // if (process.env.MONGO_URI) {

  mongoose
    .connect(process.env.MONGO_URI || "")
    .then(() => console.log("MongoDB Products Connected"))
    .catch((err: any) => console.error(err));
  // } else {
  //   console.log('MONGO_URI not defind');
  // }
};

export default connectMongoDB;
