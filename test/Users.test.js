import chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";

const expect = chai.expect;
const request = supertest(app);

describe("Testing del Router de Usuarios y Sesiones", function () {
  this.timeout(10000);

  const testUser = {
    first_name: "Usuario",
    last_name: "DePrueba",
    email: `test-${Date.now()}@test.com`,
    password: "123",
  };
  let userId;
  let userCookie; // Para almacenar la cookie de sesión

  before(async function () {
    // Nos aseguramos de que la conexión a la DB esté lista antes de los tests
    await mongoose.connection.collections.users?.drop();
  });

  // Hook after para limpiar la base de datos después de las pruebas
  after(async function () {
    console.log("Limpiando la base de datos de usuarios...");
    await mongoose.connection.collections.users?.drop();
  });

  it("Debería registrar un nuevo usuario correctamente [POST /api/sessions/register]", async function () {
    const { statusCode, _body } = await request
      .post("/api/sessions/register")
      .send(testUser);

    expect(statusCode).to.equal(201);
    expect(_body.payload).to.be.a("string"); // El ID del usuario
    userId = _body.payload;
  });

  it("Debería iniciar sesión correctamente y devolver una cookie [POST /api/sessions/login]", async function () {
    const credentials = {
      email: testUser.email,
      password: testUser.password,
    };

    const result = await request.post("/api/sessions/login").send(credentials);

    expect(result.statusCode).to.equal(200);

    // Extraemos la cookie de la respuesta
    const cookieHeader = result.header["set-cookie"][0];
    expect(cookieHeader).to.be.ok;

    userCookie = cookieHeader; // Guardamos la cookie para usarla en el siguiente test
  });

  it("Debería obtener los datos del usuario actual a partir de la cookie [GET /api/sessions/current]", async function () {
    const { statusCode, _body } = await request
      .get("/api/sessions/current")
      .set("Cookie", userCookie); // Enviamos la cookie en la petición

    expect(statusCode).to.equal(200);
    expect(_body.payload).to.have.property("email", testUser.email);
  });

  it("Debería obtener la lista de todos los usuarios [GET /api/users]", async function () {
    const { statusCode, _body } = await request.get("/api/users");

    expect(statusCode).to.equal(200);
    expect(_body.payload).to.be.an("array");
    expect(_body.payload.length).to.be.at.least(1); // Debe haber al menos el usuario que creamos
  });

  it("Debería obtener un usuario por su ID [GET /api/users/:uid]", async function () {
    const { statusCode, _body } = await request.get(`/api/users/${userId}`);

    expect(statusCode).to.equal(200);
    expect(_body.payload).to.have.property("_id", userId);
    expect(_body.payload.email).to.equal(testUser.email);
  });

  it("Debería actualizar los datos de un usuario [PUT /api/users/:uid]", async function () {
    const updatedData = { last_name: "ApellidoActualizado" };
    const { statusCode } = await request
      .put(`/api/users/${userId}`)
      .send(updatedData);

    expect(statusCode).to.equal(200);

    // Verificamos que el cambio se aplicó
    const { _body } = await request.get(`/api/users/${userId}`);
    expect(_body.payload.last_name).to.equal(updatedData.last_name);
  });

  it("Debería eliminar un usuario [DELETE /api/users/:uid]", async function () {
    const { statusCode } = await request.delete(`/api/users/${userId}`);
    expect(statusCode).to.equal(200);

    // Verificamos que el usuario ya no existe
    const { statusCode: newStatusCode } = await request.get(
      `/api/users/${userId}`
    );
    expect(newStatusCode).to.equal(404);
  });
});
