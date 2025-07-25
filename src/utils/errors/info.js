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
