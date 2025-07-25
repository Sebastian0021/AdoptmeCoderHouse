import {
  adoptionsService,
  petsService,
  usersService,
} from "../services/index.js";
import CustomError from "../utils/errors/CustomError.js";
import EErrors from "../utils/errors/enums.js";
import {
  generatePetAlreadyAdoptedErrorInfo,
  generatePetNotFoundErrorInfo,
} from "../utils/errors/info.js";

const getAllAdoptions = async (req, res, next) => {
  try {
    const result = await adoptionsService.getAll();
    res.send({ status: "success", payload: result });
  } catch (error) {
    error.code = EErrors.DATABASE_ERROR;
    next(error);
  }
};

const getAdoption = async (req, res, next) => {
  try {
    const adoptionId = req.params.aid;
    const adoption = await adoptionsService.getBy({ _id: adoptionId });
    if (!adoption) {
      throw CustomError.createError({
        name: "Error de Búsqueda",
        cause: `No se encontró una adopción con el ID: ${adoptionId}`,
        message: "Adopción no encontrada.",
        code: EErrors.RESOURCE_NOT_FOUND_ERROR,
      });
    }
    res.send({ status: "success", payload: adoption });
  } catch (error) {
    next(error);
  }
};

const createAdoption = async (req, res, next) => {
  try {
    const { uid, pid } = req.params;

    // 1. Verificar si el usuario existe
    const user = await usersService.getUserById(uid);
    if (!user) {
      throw CustomError.createError({
        name: "Error de Adopción",
        cause: `Usuario no encontrado con ID: ${uid}`,
        message: "No se puede completar la adopción.",
        code: EErrors.RESOURCE_NOT_FOUND_ERROR,
      });
    }

    // 2. Verificar si la mascota existe
    const pet = await petsService.getBy({ _id: pid });
    if (!pet) {
      throw CustomError.createError({
        name: "Error de Adopción",
        cause: generatePetNotFoundErrorInfo(pid),
        message: "No se puede completar la adopción.",
        code: EErrors.RESOURCE_NOT_FOUND_ERROR,
      });
    }

    // 3. Verificar si la mascota ya está adoptada
    if (pet.adopted) {
      throw CustomError.createError({
        name: "Error de Adopción",
        cause: generatePetAlreadyAdoptedErrorInfo(pid),
        message: "La mascota no está disponible.",
        code: EErrors.INVALID_TYPES_ERROR, // Usamos este código para un 'bad request' lógico
      });
    }

    // Procedemos con la adopción
    user.pets.push(pet._id);
    await usersService.update(user._id, { pets: user.pets });
    await petsService.update(pet._id, { adopted: true, owner: user._id });
    await adoptionsService.create({ owner: user._id, pet: pet._id });

    req.logger.info(
      `Proceso de adopción completado: Usuario ${uid} adoptó a la Mascota ${pid}`
    );

    res
      .status(201)
      .send({ status: "success", message: "Mascota adoptada exitosamente" });
  } catch (error) {
    next(error);
  }
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption,
};
