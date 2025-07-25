// src/utils/mocks.js

import { faker } from "@faker-js/faker";
import { createHash } from "./index.js";

// Generar mascotas
export const generatePets = (count) => {
  const pets = [];
  for (let i = 0; i < count; i++) {
    pets.push({
      name: faker.animal.dog(),
      specie: faker.animal.type(),
      birthDate: faker.date.birthdate(),
      adopted: false,
      image: faker.image.avatar(),
    });
  }
  return pets;
};

// Generar usuarios
export const generateUsers = async (count) => {
  const users = [];
  const password = await createHash("coder123"); // Encriptamos la contraseña una sola vez

  for (let i = 0; i < count; i++) {
    users.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password, // Usamos la contraseña ya encriptada
      role: faker.helpers.arrayElement(["user", "admin"]),
      pets: [],
    });
  }
  return users;
};
