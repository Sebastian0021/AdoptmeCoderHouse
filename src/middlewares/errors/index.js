// src/middlewares/errors/index.js
import EErrors from "../../utils/errors/enums.js";

export default (error, req, res, next) => {
  console.error("Error detectado en el manejador de errores:");
  console.error(error.cause);

  switch (error.code) {
    case EErrors.INVALID_TYPES_ERROR:
      res
        .status(400)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;
    case EErrors.USER_EXISTS_ERROR:
      res
        .status(400)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;
    case EErrors.RESOURCE_NOT_FOUND_ERROR:
      res
        .status(404)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;
    case EErrors.DATABASE_ERROR:
      res
        .status(500)
        .send({ status: "error", error: error.name, cause: error.cause });
      break;
    default:
      res
        .status(500)
        .send({
          status: "error",
          error: "Unhandled error",
          cause: error.cause,
        });
  }
};
