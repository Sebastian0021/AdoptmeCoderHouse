import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/User.dto.js";
import CustomError from "../utils/errors/CustomError.js";
import EErrors from "../utils/errors/enums.js";
import { generateUserErrorInfo } from "../utils/errors/info.js";

const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // Validamos que los campos no estén vacíos
    if (!first_name || !last_name || !email || !password) {
      throw CustomError.createError({
        name: "Error de Creación de Usuario",
        cause: generateUserErrorInfo({ first_name, last_name, email }),
        message: "Error al intentar crear el usuario",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }

    const exists = await usersService.getUserByEmail(email);
    if (exists) {
      throw CustomError.createError({
        name: "Conflicto de Usuario",
        cause: `El email '${email}' ya está en uso.`,
        message: "El usuario ya existe.",
        code: EErrors.USER_EXISTS_ERROR,
      });
    }

    const hashedPassword = await createHash(password);
    const user = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
    };

    const result = await usersService.create(user);
    res.status(201).send({ status: "success", payload: result._id });
  } catch (error) {
    next(error); // Pasamos al middleware
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw CustomError.createError({
        name: "Error de Autenticación",
        cause: "Email o contraseña no proporcionados.",
        message: "Valores incompletos.",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }

    const user = await usersService.getUserByEmail(email);
    if (!user) {
      throw CustomError.createError({
        name: "Error de Autenticación",
        cause: "Usuario no encontrado",
        message: "Credenciales inválidas.",
        code: EErrors.AUTHENTICATION_ERROR,
      });
    }

    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword) {
      throw CustomError.createError({
        name: "Error de Autenticación",
        cause: "Contraseña incorrecta.",
        message: "Credenciales inválidas.",
        code: EErrors.AUTHENTICATION_ERROR,
      });
    }

    const userDto = UserDTO.getUserTokenFrom(user);
    const token = jwt.sign(userDto, "tokenSecretJWT", { expiresIn: "1h" });
    res
      .cookie("coderCookie", token, { maxAge: 3600000 })
      .send({ status: "success", message: "Login exitoso" });
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  try {
    const cookie = req.cookies["coderCookie"];
    if (!cookie) {
      throw CustomError.createError({
        name: "Error de Autorización",
        cause: "No se encontró el token en las cookies.",
        message: "Acceso denegado.",
        code: EErrors.AUTHENTICATION_ERROR,
      });
    }

    const user = jwt.verify(cookie, "tokenSecretJWT");
    res.send({ status: "success", payload: user });
  } catch (error) {
    next(error); // El error de jwt ya tiene suficiente información
  }
};

const unprotectedLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw CustomError.createError({
        name: "Error de Autenticación",
        cause: "Email o contraseña no proporcionados.",
        message: "Valores incompletos.",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }
    const user = await usersService.getUserByEmail(email);
    if (!user) {
      throw CustomError.createError({
        name: "Error de Autenticación",
        cause: "Usuario no encontrado",
        message: "Credenciales inválidas.",
        code: EErrors.AUTHENTICATION_ERROR,
      });
    }
    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword) {
      throw CustomError.createError({
        name: "Error de Autenticación",
        cause: "Contraseña incorrecta.",
        message: "Credenciales inválidas.",
        code: EErrors.AUTHENTICATION_ERROR,
      });
    }
    const token = jwt.sign(user, "tokenSecretJWT", { expiresIn: "1h" });
    res
      .cookie("unprotectedCookie", token, { maxAge: 3600000 })
      .send({ status: "success", message: "Unprotected Logged in" });
  } catch (error) {
    next(error);
  }
};

const unprotectedCurrent = async (req, res, next) => {
  try {
    const cookie = req.cookies["unprotectedCookie"];
    if (!cookie) {
      throw CustomError.createError({
        name: "Error de Autorización",
        cause: "No se encontró el token en las cookies.",
        message: "Acceso denegado.",
        code: EErrors.AUTHENTICATION_ERROR,
      });
    }
    const user = jwt.verify(cookie, "tokenSecretJWT");
    res.send({ status: "success", payload: user });
  } catch (error) {
    next(error);
  }
};

export default {
  current,
  login,
  register,
  current,
  unprotectedLogin,
  unprotectedCurrent,
};
