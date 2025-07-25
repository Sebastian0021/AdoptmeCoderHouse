import dotenv from "dotenv";

dotenv.config();

export default {
  PORT: process.env.PORT,
  URL_MONGO: process.env.URL_MONGO,
  NODE_ENV: process.env.NODE_ENV || "development",
};
