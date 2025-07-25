import EErrors from "../../utils/errors/enums.js";

export default (error, req, res, next) => {
  req.logger.error(
    `Error: ${error.name} - Causa: ${error.cause || "No especificada"}`
  );

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
    case EErrors.AUTHENTICATION_ERROR:
      res
        .status(401)
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
      res.status(500).send({
        status: "error",
        error: "Unhandled error",
        cause: error.cause,
      });
  }
};
