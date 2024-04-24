
export const backendUrl = 'http://localhost:8000';
export const urlLogin = "/api/fuck/";
export const urlVerifyToken = "/api/token/verify/";

export const urlNotifications = "/api/eventos?idEstado[eq]=1&estado=true";
export const urlEvents = "/api/eventos?estado=true"
export const urlEventById = (id) => `/api/eventos/${id}`

export const urlEvaluations = "/api/evaluaciones/";
export const urlStatus = "/api/estados"

export const urlUsers = {
  getUsersWithRoles: '/api/usuarios?rol=true',
  addUser: '/api/usuarios',
}

export const urlRoles = {
  getRoles: '/api/roles',
}