import dotenv from "dotenv";

dotenv.config();

export const appKeys = {
  JWT_SECRET: process.env.JWT_SECRET,
};
