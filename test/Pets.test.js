import chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";

const expect = chai.expect;
const request = supertest(app);

describe("Testing del Router de Mascotas", function () {
  this.timeout(10000);

  const mockPet = {
    name: "MascotaTest",
    specie: "Gato",
    birthDate: "2022-05-20",
  };
  let petId;

  before(async function () {
    // Limpiamos la colección de mascotas antes de empezar
    await mongoose.connection.collections.pets?.drop();
  });

  // Hook after para limpiar la base de datos después de las pruebas
  after(async function () {
    console.log("Limpiando la base de datos de mascotas...");
    await mongoose.connection.collections.pets?.drop();
  });

  it("Debería crear una nueva mascota correctamente [POST /api/pets]", async function () {
    const { statusCode, _body } = await request.post("/api/pets").send(mockPet);

    expect(statusCode).to.equal(201);
    expect(_body.payload).to.have.property("_id");
    petId = _body.payload._id;
  });

  it("No debería crear una mascota si faltan campos obligatorios [POST /api/pets]", async function () {
    const incompletePet = { name: "Incompleto" };
    const { statusCode, _body } = await request
      .post("/api/pets")
      .send(incompletePet);

    expect(statusCode).to.equal(400);
    expect(_body.status).to.equal("error");
  });

  it("Debería obtener todas las mascotas [GET /api/pets]", async function () {
    const { statusCode, _body } = await request.get("/api/pets");

    expect(statusCode).to.equal(200);
    expect(_body.payload).to.be.an("array");

    // Verificamos que la mascota creada está en la lista
    const createdPetExists = _body.payload.some((p) => p._id === petId);
    expect(createdPetExists).to.be.true;
  });

  it("Debería poder crear una mascota con una imagen [POST /api/pets/withimage]", async function () {
    const response = await request
      .post("/api/pets/withimage")
      .field("name", "Mascota Con Imagen")
      .field("specie", "Perro")
      .field("birthDate", "2023-01-01")
      .attach("image", "./src/public/img/1671549990926-coderDog.jpg");

    expect(response.statusCode).to.equal(201);
    expect(response._body.payload).to.have.property("image");
  });

  it("Debería actualizar una mascota correctamente [PUT /api/pets/:pid]", async function () {
    const updatedData = { name: "NombreSuperActualizado" };
    const { statusCode } = await request
      .put(`/api/pets/${petId}`)
      .send(updatedData);

    expect(statusCode).to.equal(200);

    // Verificamos que el cambio se aplicó correctamente
    const { _body } = await request.get("/api/pets");
    const updatedPet = _body.payload.find((p) => p._id === petId);
    expect(updatedPet.name).to.equal(updatedData.name);
  });

  it("Debería eliminar una mascota correctamente [DELETE /api/pets/:pid]", async function () {
    const { statusCode } = await request.delete(`/api/pets/${petId}`);
    expect(statusCode).to.equal(200);

    // Verificamos que la mascota ya no existe en la base de datos
    const { _body } = await request.get("/api/pets");
    const petExists = _body.payload.some((p) => p._id === petId);
    expect(petExists).to.be.false;
  });
});
