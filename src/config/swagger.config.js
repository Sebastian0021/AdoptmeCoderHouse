import swaggerJSDoc from "swagger-jsdoc";
import __dirname from "../utils/index.js";

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación de la API de AdoptMe - Backend 3",
      description: "API diseñada para gestionar la adopción de mascotas.",
      version: "1.0.0",
      contact: {
        name: "Sebastian Peñaloza",
        email: "sebastianalefuentespe@gmail.com",
      },
    },
  },
  apis: [`${__dirname}/../docs/**/*.yaml`],
};

export const specs = swaggerJSDoc(swaggerOptions);
