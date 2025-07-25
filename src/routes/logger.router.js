import { Router } from "express";

const router = Router();

router.get("/loggerTest", (req, res) => {
  req.logger.fatal("Este es un log de nivel FATAL");
  req.logger.error("Este es un log de nivel ERROR");
  req.logger.warning("Este es un log de nivel WARNING");
  req.logger.info("Este es un log de nivel INFO");
  req.logger.http("Este es un log de nivel HTTP");
  req.logger.debug("Este es un log de nivel DEBUG");

  res.send({ status: "success", message: "Logs de prueba generados." });
});

export default router;
