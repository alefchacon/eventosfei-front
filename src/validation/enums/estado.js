export const estado = Object.freeze({
  NUEVO: 1,
  ACEPTADO: 2,
  EVALUADO: 3,
  RECHAZADO: 4,
  fromValue: (value = 1) => {
    return Object.keys(estado).find(key => estado[key] === value);
  }
});
