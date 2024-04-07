
const backendUrl = 'http://localhost:8000';
export const urlLogin = backendUrl + "/api/login/";
export const urlVerifyToken = backendUrl + "/api/token/verify/";
export const urlEvaluations = backendUrl + "/api/evaluaciones/";
export const urlEvents = backendUrl + "/api/eventos?estado=true";
export const urlNotifications = backendUrl + "/api/eventos?idEstado[eq]=1&estado=true";
