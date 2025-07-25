# Proyecto Final: AdoptMe - Backend 3

Este repositorio contiene el proyecto final para el curso de Backend 3. La aplicación es un sistema de gestión para un centro de adopción de mascotas llamado "AdoptMe".

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
- **Refactorización Completa:** Todos los controladores (`sessions`, `users`, `pets`, `adoptions`, `mocks`) fueron refactorizados para utilizar este nuevo sistema, haciendo la aplicación más robusta y mantenible.

### 2. Logger Profesional con Winston

Se reemplazó el uso de `console.log()` por un logger profesional (Winston) con configuraciones específicas para diferentes entornos.

- **Configuración por Entorno:**
  - **Desarrollo:** Registra todos los niveles de logs (desde `debug` hasta `fatal`) únicamente en la consola, con un formato simple y colores para facilitar la lectura.
  - **Producción:** Registra en consola solo los niveles informativos (`info` y superiores) y guarda todos los errores (`error` y `fatal`) en un archivo físico (`errors.log`) para su posterior análisis y auditoría.
- **Niveles Personalizados:** Se definieron niveles de log semánticos para clasificar los eventos del servidor: `fatal`, `error`, `warning`, `info`, `http`, `debug`.
- **Middleware de Logging:** Se implementó un middleware que se ejecuta en cada petición para registrar la actividad `http` del servidor automáticamente.
- **Endpoint de Prueba (`/loggerTest`):** Se creó una ruta específica para probar que todos los niveles del logger funcionan correctamente en el entorno actual.

### 3. Módulo de Mocking para Generación de Datos

Se integró la librería `faker-js` y se crearon endpoints dedicados a la generación de datos de prueba.

- **Generación de Datos al Vuelo:**
  - `GET /api/mocks/mockingpets`: Genera y devuelve un JSON con 100 mascotas falsas sin guardarlas en la base de datos.
  - `GET /api/mocks/mockingusers`: Genera y devuelve un JSON con 50 usuarios falsos.
- **Población de la Base de Datos:**
  - `POST /api/mocks/generateData`: Un endpoint que permite poblar la base de datos con una cantidad configurable de usuarios y mascotas, ideal para inicializar el entorno de pruebas.

### 4. Consistencia en la Arquitectura

Se aseguró que las nuevas funcionalidades respetaran y reforzaran la arquitectura en capas del proyecto. Por ejemplo, la lógica de los endpoints de mocking fue extraída de las rutas y movida a su propio controlador (`mocks.controller.js`) para mantener la separación de responsabilidades.

---

## 🚀 Instalación y Puesta en Marcha

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
    - Copiar el contenido de un archivo `.env.example` (si existe) o añadir las siguientes variables:
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

---

## 🌐 Endpoints Principales

La API está organizada en torno a los siguientes recursos:

- `/api/users`: CRUD de Usuarios.
- `/api/pets`: CRUD de Mascotas.
- `/api/adoptions`: Gestión de Adopciones.
- `/api/sessions`: Registro y Login de usuarios.
- `/api/mocks`: Endpoints para generación de datos de prueba.
- `/loggerTest`: Endpoint para probar el logger.
