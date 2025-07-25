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
      CustomError.createError({
        name: "Error de Creación de Usuario",
        cause: generateUserErrorInfo({ first_name, last_name, email }),
        message: "Error al intentar crear el usuario",
        code: EErrors.INVALID_TYPES_ERROR,
      });
    }

    const exists = await usersService.getUserByEmail(email);
    if (exists) {
      CustomError.createError({
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

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .send({ status: "error", error: "Incomplete values" });
  const user = await usersService.getUserByEmail(email);
  if (!user)
    return res
      .status(404)
      .send({ status: "error", error: "User doesn't exist" });
  const isValidPassword = await passwordValidation(user, password);
  if (!isValidPassword)
    return res
      .status(400)
      .send({ status: "error", error: "Incorrect password" });
  const userDto = UserDTO.getUserTokenFrom(user);
  const token = jwt.sign(userDto, "tokenSecretJWT", { expiresIn: "1h" });
  res
    .cookie("coderCookie", token, { maxAge: 3600000 })
    .send({ status: "success", message: "Logged in" });
};

const current = async (req, res) => {
  const cookie = req.cookies["coderCookie"];
  const user = jwt.verify(cookie, "tokenSecretJWT");
  if (user) return res.send({ status: "success", payload: user });
};

const unprotectedLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .send({ status: "error", error: "Incomplete values" });
  const user = await usersService.getUserByEmail(email);
  if (!user)
    return res
      .status(404)
      .send({ status: "error", error: "User doesn't exist" });
  const isValidPassword = await passwordValidation(user, password);
  if (!isValidPassword)
    return res
      .status(400)
      .send({ status: "error", error: "Incorrect password" });
  const token = jwt.sign(user, "tokenSecretJWT", { expiresIn: "1h" });
  res
    .cookie("unprotectedCookie", token, { maxAge: 3600000 })
    .send({ status: "success", message: "Unprotected Logged in" });
};
const unprotectedCurrent = async (req, res) => {
  const cookie = req.cookies["unprotectedCookie"];
  const user = jwt.verify(cookie, "tokenSecretJWT");
  if (user) return res.send({ status: "success", payload: user });
};
export default {
  current,
  login,
  register,
  current,
  unprotectedLogin,
  unprotectedCurrent,
};
