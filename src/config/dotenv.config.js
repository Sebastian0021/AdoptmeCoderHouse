import dotenv from "dotenv";

dotenv.config();

export default {
  PORT: process.env.PORT,
  URL_MONGO: process.env.URL_MONGO,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  SESSION_SECRET: process.env.SESSION_SECRET,
  COOKIE_AGE: process.env.COOKIE_AGE,
};
