// src/routes/mocks.router.js

import { Router } from "express";
import { generatePets, generateUsers } from "../utils/mocks.js";
import { usersService, petsService } from "../services/index.js";

const router = Router();

// Endpoint para generar 100 mascotas de prueba (sin guardar)
router.get("/mockingpets", (req, res) => {
  const pets = generatePets(100);
  res.send({ status: "success", payload: pets });
});

// Endpoint para generar 50 usuarios de prueba (sin guardar)
router.get("/mockingusers", async (req, res) => {
  try {
    const users = await generateUsers(50);
    res.send({ status: "success", payload: users });
  } catch (error) {
    console.error("Error generando usuarios de prueba:", error);
    res
      .status(500)
      .send({
        status: "error",
        error: "No se pudieron generar los usuarios de prueba.",
      });
  }
});

// Endpoint para generar y guardar datos de prueba en la DB
router.post("/generateData", async (req, res) => {
  const { users: usersCount = 10, pets: petsCount = 20 } = req.body;

  try {
    // Generar usuarios
    const users = await generateUsers(parseInt(usersCount));
    await usersService.create(users);

    // Generar mascotas
    const pets = generatePets(parseInt(petsCount));
    await petsService.create(pets);

    res.send({
      status: "success",
      message: `${usersCount} usuarios y ${petsCount} mascotas generados e insertados correctamente.`,
    });
  } catch (error) {
    console.error("Error generando datos:", error);
    res.status(500).send({
      status: "error",
      error: "No se pudieron generar los datos de prueba.",
    });
  }
});

export default router;
