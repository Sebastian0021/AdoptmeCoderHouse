import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";
import __dirname from "../utils/index.js";
import CustomError from "../utils/errors/CustomError.js";
import EErrors from "../utils/errors/enums.js";
import {
  generatePetErrorInfo,
  generatePetNotFoundErrorInfo,
} from "../utils/errors/info.js";

const getAllPets = async (req, res, next) => {
  try {
    const pets = await petsService.getAll();
    res.send({ status: "success", payload: pets });
  } catch (error) {
    // Un error aquí probablemente sea de la base de datos
    error.code = EErrors.DATABASE_ERROR;
    next(error);
  }
};

const createPet = async (req, res, next) => {
  try {
    const { name, specie, birthDate } = req.body;
    if (!name || !specie || !birthDate) {
      throw CustomError.createError({
        name: "Error de Creación de Mascota",
        cause: generatePetErrorInfo({ name, specie, birthDate }),
        message: "Error al intentar crear la mascota. Datos incompletos.",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }
    const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
    const result = await petsService.create(pet);
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    next(error);
  }
};

const updatePet = async (req, res, next) => {
  try {
    const petUpdateBody = req.body;
    const petId = req.params.pid;

    const pet = await petsService.getBy({ _id: petId });
    if (!pet) {
      throw CustomError.createError({
        name: "Error de Actualización",
        cause: generatePetNotFoundErrorInfo(petId),
        message: "La mascota que intentas actualizar no existe.",
        code: EErrors.RESOURCE_NOT_FOUND_ERROR,
      });
    }

    await petsService.update(petId, petUpdateBody);
    res.send({ status: "success", message: "Mascota actualizada" });
  } catch (error) {
    next(error);
  }
};

const deletePet = async (req, res, next) => {
  try {
    const petId = req.params.pid;

    const pet = await petsService.getBy({ _id: petId });
    if (!pet) {
      throw CustomError.createError({
        name: "Error de Eliminación",
        cause: generatePetNotFoundErrorInfo(petId),
        message: "La mascota que intentas eliminar no existe.",
        code: EErrors.RESOURCE_NOT_FOUND_ERROR,
      });
    }

    await petsService.delete(petId);
    res.send({ status: "success", message: "Mascota eliminada" });
  } catch (error) {
    next(error);
  }
};

const createPetWithImage = async (req, res, next) => {
  try {
    const file = req.file;
    const { name, specie, birthDate } = req.body;
    if (!name || !specie || !birthDate) {
      throw CustomError.createError({
        name: "Error de Creación de Mascota",
        cause: generatePetErrorInfo({ name, specie, birthDate }),
        message: "Error al intentar crear la mascota. Datos incompletos.",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }

    req.logger.debug(`Archivo subido: ${file.filename}`);

    const pet = PetDTO.getPetInputFrom({
      name,
      specie,
      birthDate,
      image: `${__dirname}/../public/img/${file.filename}`,
    });

    req.logger.info(`Mascota a crear: ${JSON.stringify(pet)}`);

    const result = await petsService.create(pet);
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllPets,
  createPet,
  updatePet,
  deletePet,
  createPetWithImage,
};
