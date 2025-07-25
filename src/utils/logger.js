import winston from "winston";
import config from "../config/dotenv.config.js";

// Definimos niveles y colores personalizados
const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "blue",
    http: "cyan",
    debug: "white",
  },
};

// Formato para la consola
const consoleFormat = winston.format.combine(
  winston.format.colorize({ colors: customLevelsOptions.colors }),
  winston.format.simple()
);

// Logger para Desarrollo
const devLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: consoleFormat,
    }),
  ],
});

// Logger para Producción
const prodLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: consoleFormat,
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
      format: winston.format.simple(),
    }),
  ],
});

// Middleware para agregar el logger a `req`
export const addLogger = (req, res, next) => {
  if (config.NODE_ENV === "production") {
    req.logger = prodLogger;
  } else {
    req.logger = devLogger;
  }
  // Log de la petición HTTP
  req.logger.http(
    `${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
};
