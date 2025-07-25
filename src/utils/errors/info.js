export const generateUserErrorInfo = (user) => {
  return `Una o más propiedades están incompletas o no son válidas.
    Lista de propiedades requeridas:
    * first_name: necesita ser un String, se recibió ${user.first_name}
    * last_name : necesita ser un String, se recibió ${user.last_name}
    * email     : necesita ser un String, se recibió ${user.email}
    `;
};

export const generatePetErrorInfo = (pet) => {
  return `Una o más propiedades están incompletas o no son válidas.
    Lista de propiedades requeridas:
    * name  : necesita ser un String, se recibió ${pet.name}
    * specie: necesita ser un String, se recibió ${pet.specie}
    `;
};

export const generateAuthenticationErrorInfo = () => {
  return "Credenciales inválidas. Por favor, verifica tu email y contraseña.";
};

export const generateAuthorizationErrorInfo = () => {
  return "No estás autorizado para acceder a este recurso. Token no válido o ausente.";
};

export const generatePetNotFoundErrorInfo = (pid) => {
  return `No se pudo encontrar una mascota con el ID: ${pid}.`;
};

export const generateAdoptionErrorInfo = (uid, pid) => {
  return `No se pudo procesar la adopción.
    * ID de Usuario: ${uid}
    * ID de Mascota: ${pid}
    Verifique que ambos IDs sean correctos.`;
};

export const generatePetAlreadyAdoptedErrorInfo = (pid) => {
  return `La mascota con ID ${pid} ya ha sido adoptada y no está disponible.`;
};

export const generateUserNotFoundErrorInfo = (uid) => {
  return `No se pudo encontrar un usuario con el ID: ${uid}.`;
};
