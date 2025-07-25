import { Router } from "express";
import mocksController from "../controllers/mocks.controller.js";

const router = Router();

// Endpoint para generar 100 mascotas de prueba (sin guardar)
router.get("/mockingpets", mocksController.getMockPets);

// Endpoint para generar 50 usuarios de prueba (sin guardar)
router.get("/mockingusers", mocksController.getMockUsers);

// Endpoint para generar y guardar datos de prueba en la DB
router.post("/generateData", mocksController.generateData);

export default router;
