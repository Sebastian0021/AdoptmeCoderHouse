import { usersService } from "../services/index.js";
import CustomError from "../utils/errors/CustomError.js";
import EErrors from "../utils/errors/enums.js";
import { generateUserNotFoundErrorInfo } from "../utils/errors/info.js";

const getAllUsers = async (req, res, next) => {
  try {
    const users = await usersService.getAll();
    res.send({ status: "success", payload: users });
  } catch (error) {
    error.code = EErrors.DATABASE_ERROR;
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user) {
      throw CustomError.createError({
        name: "Error de Búsqueda de Usuario",
        cause: generateUserNotFoundErrorInfo(userId),
        message: "Usuario no encontrado.",
        code: EErrors.RESOURCE_NOT_FOUND_ERROR,
      });
    }
    res.send({ status: "success", payload: user });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updateBody = req.body;
    const userId = req.params.uid;

    const user = await usersService.getUserById(userId);
    if (!user) {
      throw CustomError.createError({
        name: "Error de Actualización",
        cause: generateUserNotFoundErrorInfo(userId),
        message: "El usuario que intentas actualizar no existe.",
        code: EErrors.RESOURCE_NOT_FOUND_ERROR,
      });
    }

    await usersService.update(userId, updateBody);
    req.logger.info(`Usuario con ID ${userId} ha sido actualizado.`);
    res.send({ status: "success", message: "Usuario actualizado" });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.uid;

    const user = await usersService.getUserById(userId);
    if (!user) {
      throw CustomError.createError({
        name: "Error de Eliminación",
        cause: generateUserNotFoundErrorInfo(userId),
        message: "El usuario que intentas eliminar no existe.",
        code: EErrors.RESOURCE_NOT_FOUND_ERROR,
      });
    }

    // Lógica de eliminación que faltaba
    await usersService.delete(userId);

    req.logger.warning(`Usuario con ID ${userId} ha sido eliminado.`);
    res.send({ status: "success", message: "Usuario eliminado" });
  } catch (error) {
    next(error);
  }
};

export default {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
};
