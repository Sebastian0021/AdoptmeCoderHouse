# Proyecto Final: AdoptMe - Backend CoderHouse

Este repositorio contiene el proyecto final para el curso de Backend. La aplicación es un sistema de gestión para un centro de adopción de mascotas llamado "AdoptMe".

**Nota Importante:** Este proyecto se construyó sobre una base inicial proporcionada por el curso. Las siguientes secciones detallan las **características, mejoras y refactorizaciones clave** que fueron implementadas para agregar valor, robustez y funcionalidades de nivel profesional a la aplicación.

---

## ✨ Mejoras y Funcionalidades Agregadas

Esta sección se enfoca en las contribuciones principales realizadas sobre el código base.

### 1. Sistema Avanzado de Manejo de Errores

Se abandonó el manejo de errores en línea (`res.status().send()`) en favor de un sistema centralizado y personalizable para garantizar respuestas de error consistentes y un código más limpio.

- **Diccionario de Errores (`enums.js`):** Se creó un enumerador para estandarizar los tipos de errores de la aplicación (ej: `INVALID_TYPES_ERROR`, `DATABASE_ERROR`, `AUTHENTICATION_ERROR`).
- **Clase `CustomError`:** Una clase personalizada que permite generar errores con información detallada, incluyendo un `código` interno, un `nombre` y una `causa` específica.
- **Plantillas de Mensajes (`info.js`):** Funciones que generan mensajes de error descriptivos y dinámicos para el cliente, facilitando la depuración.
- **Middleware Global de Errores:** Un único middleware que intercepta todos los errores lanzados en la aplicación, los registra con el logger y envía una respuesta JSON estandarizada al cliente.

### 2. Logger Profesional con Winston

Se reemplazó el uso de `console.log()` por un logger profesional (Winston) con configuraciones específicas para diferentes entornos.

- **Configuración por Entorno:**
  - **Desarrollo:** Registra todos los niveles de logs (desde `debug` hasta `fatal`) únicamente en la consola, con un formato simple y colores para facilitar la lectura.
  - **Producción:** Registra en consola solo los niveles informativos (`info` y superiores) y guarda todos los errores (`error` y `fatal`) en un archivo físico (`errors.log`) para su posterior análisis y auditoría.
- **Middleware de Logging:** Se implementó un middleware que se ejecuta en cada petición para registrar la actividad `http` del servidor automáticamente.
- **Endpoint de Prueba (`/loggerTest`):** Se creó una ruta específica para probar que todos los niveles del logger funcionan correctamente en el entorno actual.

### 3. Módulo de Mocking para Generación de Datos

Se integró la librería `faker-js` y se crearon endpoints dedicados a la generación de datos de prueba.

- **Generación de Datos al Vuelo:**
  - `GET /api/mocks/mockingpets`: Genera y devuelve un JSON con 100 mascotas falsas sin guardarlas en la base de datos.
- **Población de la Base de Datos:**
  - `POST /api/mocks/generateData`: Un endpoint que permite poblar la base de datos con una cantidad configurable de usuarios y mascotas, ideal para inicializar el entorno de pruebas.

### 4. Documentación de API con Swagger

Para facilitar el uso y las pruebas de la API, se integró **Swagger**, generando una documentación interactiva y auto-descriptiva.

- **Integración con `swagger-jsdoc` y `swagger-ui-express`:** Se utilizan estas dos librerías para generar la documentación a partir de archivos de definición en formato `YAML`.
- **Definiciones por Módulo:** La documentación de cada router (`Sessions`, `Pets`, `Adoptions`) se encuentra en archivos `.yaml` separados dentro de la carpeta `src/docs`, manteniendo el código de las rutas limpio.
- **Endpoint de Documentación:** La interfaz de usuario de Swagger está disponible en el endpoint `GET /api/docs`, permitiendo a los desarrolladores explorar y probar cada endpoint de forma interactiva.

### 5. Suite de Testing Completa

Se desarrolló una suite de pruebas funcionales utilizando **Mocha**, **Chai** y **Supertest** para garantizar la calidad y el correcto funcionamiento de los endpoints principales.

- **Cobertura Total:** Se crearon tests para todos los endpoints de los routers de `Users`, `Pets` y `Adoptions`, cubriendo el ciclo completo de operaciones (CRUD).
- **Pruebas de Lógica de Negocio:** Los tests no solo verifican los códigos de estado, sino también los efectos secundarios en la base de datos (por ejemplo, que una mascota adoptada cambie su estado y se asigne al usuario correcto).
- **Entorno de Prueba Aislado:** Se utilizan hooks como `before` y `after` para preparar y limpiar la base de datos antes y después de cada suite de pruebas, asegurando que los tests sean independientes y no dejen datos residuales.

### 6. Gestión de Usuarios Mejorada

Se ampliaron las funcionalidades del modelo de `User` para incluir más detalles sobre la actividad y los documentos del usuario.

- **Carga de Documentos:** Se implementó un endpoint (`POST /api/users/:uid/documents`) que permite subir archivos asociados a un usuario. El middleware de Multer fue refactorizado para guardar los archivos en carpetas específicas según su propósito (`/documents`, `/pets`, etc.).
- **Registro de Conexión:** Se añadió el campo `last_connection` al modelo de `User`, el cual se actualiza automáticamente cada vez que un usuario inicia o cierra sesión, permitiendo un mejor seguimiento de la actividad.

---

## 🐳 Despliegue con Docker

Este proyecto está preparado para ser ejecutado en un contenedor de Docker.

### Imagen en Docker Hub

Puedes encontrar la imagen pública de este proyecto en Docker Hub:

- **Link a la imagen:** `https://hub.docker.com/r/sebastian0021/adoptme-coderhouse`

### Construir la Imagen

Para construir la imagen de Docker localmente, ejecuta el siguiente comando en la raíz del proyecto:

```bash
docker build -t adoptme-coderhouse .
```

### Correr el Contenedor

Para ejecutar la aplicación en un contenedor, utiliza el siguiente comando. Asegúrate de reemplazar `<TU_URL_DE_CONEXION_A_MONGODB>` con tu cadena de conexión de MongoDB.

```bash
docker run -p 8080:8080 -e URL_MONGO="<TU_URL_DE_CONEXION_A_MONGODB>" --name adoptme-app adoptme-coderhouse
```

**Nota sobre la conexión a MongoDB desde Docker:** Si tu base de datos MongoDB está corriendo en tu máquina local (localhost), no puedes usar `localhost:27017` desde dentro del contenedor. En su lugar, debes usar `host.docker.internal:27017` en Windows/Mac o la IP de tu máquina en la red de Docker en Linux (puedes encontrarla con `ip addr show docker0`).

---

## 🚀 Instalación Local (Sin Docker)

1.  **Clonar el repositorio:**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**

    - Crear un archivo `.env` en la raíz del proyecto.
    - Añadir las siguientes variables:
      ```env
      PORT=8080
      URL_MONGO=<TU_URL_DE_CONEXION_A_MONGODB>
      NODE_ENV=development # Cambiar a 'production' para el modo producción
      ```

4.  **Ejecutar el proyecto:**

    - **Modo Desarrollo (con `nodemon`):**
      ```bash
      npm run dev
      ```
    - **Modo Producción:**
      ```bash
      npm start
      ```

5.  **Ejecutar los Tests:**
    - **Correr todos los tests:**
      ```bash
      npm test
      ```
    - **Correr tests de forma aislada:**
      ```bash
      npm run test:users
      npm run test:pets
      npm run test:adoptions
      ```

---

## 🌐 Endpoints Principales

La API está organizada en torno a los siguientes recursos:

- `/api/users`: CRUD de Usuarios, incluyendo la subida de documentos.
- `/api/pets`: CRUD de Mascotas.
- `/api/adoptions`: Gestión de Adopciones.
- `/api/sessions`: Registro, Login, Logout y sesión actual de usuarios.
- `/api/mocks`: Endpoints para generación de datos de prueba.
- `/loggerTest`: Endpoint para probar el logger.
- `/api/docs`: Interfaz de usuario de Swagger con la documentación de la API.
