import chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";

const expect = chai.expect;
const request = supertest(app);

describe("Testing del Router de Adopciones", function () {
  this.timeout(10000);

  let testUserId;
  let testPetId;
  let adoptionId;

  // Antes de todas las pruebas, creamos un usuario y una mascota para usar en la adopción
  before(async function () {
    // Limpiamos las colecciones para un estado inicial limpio
    await mongoose.connection.collections.users?.drop();
    await mongoose.connection.collections.pets?.drop();
    await mongoose.connection.collections.adoptions?.drop();

    // 1. Creamos un usuario de prueba
    const newUser = {
      first_name: "Adoptante",
      last_name: "DePrueba",
      email: `adoptante-${Date.now()}@test.com`,
      password: "123",
    };
    const userResponse = await request
      .post("/api/sessions/register")
      .send(newUser);
    testUserId = userResponse._body.payload;

    // 2. Creamos una mascota de prueba
    const newPet = {
      name: "MascotaParaAdoptar",
      specie: "Perro",
      birthDate: "2021-10-10",
    };
    const petResponse = await request.post("/api/pets").send(newPet);
    testPetId = petResponse._body.payload._id;
  });

  // Después de todas las pruebas, limpiamos las colecciones
  after(async function () {
    console.log(
      "Limpiando la base de datos de adopciones, usuarios y mascotas..."
    );
    await mongoose.connection.collections.users?.drop();
    await mongoose.connection.collections.pets?.drop();
    await mongoose.connection.collections.adoptions?.drop();
  });

  it("Debería crear una adopción exitosamente [POST /api/adoptions/:uid/:pid]", async function () {
    const { statusCode, _body } = await request.post(
      `/api/adoptions/${testUserId}/${testPetId}`
    );

    expect(statusCode).to.equal(201);
    expect(_body.status).to.equal("success");
    expect(_body.message).to.equal("Mascota adoptada exitosamente");

    // Verificación de efectos secundarios
    const petResponse = await request.get("/api/pets");
    const adoptedPet = petResponse._body.payload.find(
      (p) => p._id === testPetId
    );
    expect(adoptedPet.adopted).to.be.true;

    const userResponse = await request.get(`/api/users/${testUserId}`);
    const userPetIds = userResponse._body.payload.pets.map((p) => p._id);
    expect(userPetIds).to.include(testPetId);
  });

  it("No debería permitir adoptar una mascota que ya fue adoptada [POST /api/adoptions/:uid/:pid]", async function () {
    const { statusCode, _body } = await request.post(
      `/api/adoptions/${testUserId}/${testPetId}`
    );

    expect(statusCode).to.equal(400);
    expect(_body.status).to.equal("error");
  });

  it("Debería obtener todas las adopciones [GET /api/adoptions]", async function () {
    const { statusCode, _body } = await request.get("/api/adoptions");

    expect(statusCode).to.equal(200);
    expect(_body.payload).to.be.an("array");
    expect(_body.payload.length).to.be.greaterThan(0);

    const adoptionExists = _body.payload.some(
      (a) => a.pet === testPetId && a.owner === testUserId
    );
    expect(adoptionExists).to.be.true;

    // Guardamos el ID de la adopción para el siguiente test
    adoptionId = _body.payload[0]._id;
  });

  it("Debería obtener una adopción específica por su ID [GET /api/adoptions/:aid]", async function () {
    const { statusCode, _body } = await request.get(
      `/api/adoptions/${adoptionId}`
    );

    expect(statusCode).to.equal(200);
    expect(_body.payload).to.have.property("_id", adoptionId);
    expect(_body.payload.pet).to.equal(testPetId);
    expect(_body.payload.owner).to.equal(testUserId);
  });
});
