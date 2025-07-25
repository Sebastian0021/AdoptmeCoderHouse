import { generatePets, generateUsers } from "../utils/mocks.js";
import { usersService, petsService } from "../services/index.js";
import CustomError from "../utils/errors/CustomError.js";
import EErrors from "../utils/errors/enums.js";

const getMockPets = (req, res, next) => {
  try {
    const pets = generatePets(100);
    res.send({ status: "success", payload: pets });
  } catch (error) {
    req.logger.error("Error inesperado al generar mascotas de prueba:", error);
    next(error);
  }
};

const getMockUsers = async (req, res, next) => {
  try {
    const users = await generateUsers(50);
    res.send({ status: "success", payload: users });
  } catch (error) {
    req.logger.error("Error inesperado al generar usuarios de prueba:", error);
    next(error);
  }
};

const generateData = async (req, res, next) => {
  try {
    const { users: usersCount = 10, pets: petsCount = 20 } = req.body;

    req.logger.info(
      `Iniciando generación de datos: ${usersCount} usuarios y ${petsCount} mascotas.`
    );

    const users = await generateUsers(parseInt(usersCount));
    await usersService.create(users);

    const pets = generatePets(parseInt(petsCount));
    await petsService.create(pets);

    req.logger.info("Datos generados e insertados correctamente.");

    res.status(201).send({
      status: "success",
      message: `${usersCount} usuarios y ${petsCount} mascotas generados e insertados correctamente.`,
    });
  } catch (error) {
    req.logger.error(`Falló la inserción de datos de prueba: ${error.message}`);

    const customError = CustomError.createError({
      name: "Error de Base de Datos",
      cause:
        "Ocurrió un error al intentar insertar los registros de prueba en la base de datos.",
      message: "No se pudieron generar los datos de prueba.",
      code: EErrors.DATABASE_ERROR,
    });
    next(customError);
  }
};

export default {
  getMockPets,
  getMockUsers,
  generateData,
};
