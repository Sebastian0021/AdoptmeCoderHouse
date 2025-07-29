import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import env from "./config/dotenv.config.js";

import swaggerUiExpress from "swagger-ui-express";
import { specs } from "./config/swagger.config.js";

import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import mocksRouter from "./routes/mocks.router.js";
import loggerRouter from "./routes/logger.router.js";
import { addLogger } from "./utils/logger.js";
import errorHandler from "./middlewares/errors/index.js";

const app = express();
const PORT = env.PORT || 8080;
const connection = mongoose.connect(env.URL_MONGO);

app.use(express.json());
app.use(cookieParser());
app.use(addLogger);

// Endpoint para la documentación
app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/mocks", mocksRouter);
app.use("/", loggerRouter);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

export default app;
