
export const backendUrl = 'http://localhost:8000';
export const urlLogin = "/api/fuck/";
export const urlVerifyToken = "/api/token/verify/";

export const urlNotifications = "/api/eventos?idEstado[eq]=1&estado=true";
export const urlUserEvents = (idUsuario, page, filter) => `/api/eventos?estado=true&idUsuario[eq]=${idUsuario}${filter}&page=${page}`;
export const urlEvents = "/api/eventos?estado=true"
export const urlEventsByMonth = "/api/eventos/mes"
export const urlNewEvents = "/api/eventos?idEstado[eq]=1&estado=true";
export const urlEventById = (id) => `/api/eventos/${id}`

export const urlEvaluations = "/api/evaluaciones/";
export const urlStatus = "/api/estados/";
export const urlReservedSpaces = "/api/espacios/reservaciones/";
export const urlReservations = "/api/solicitud?";
export const urlReservationsMarkAsRead = "/api/solicitud/marcarLeidasUsuario";
export const urlUpdateReservation = (id) => `/api/solicitud/${id}`;
export const urlNewReservations = "/api/solicitud?idEstado[eq]=1";
export const urlAvailableReservations = "/api/solicitud/disponibles";

export const urlNotices = `/api/avisos?`
export const urlNoticesMarkAsUserRead = `/api/avisos/marcarLeidasUsuario`

export const urlProgramasEducativos = "/api/programaseducativos";

export const urlUsers = {
  getUsersWithRoles: '/api/usuarios?rol=true',
  addUser: '/api/usuarios',
}

export const urlCronogram = (id = 0) => {
  return `/api/cronogramas/${id}`;
}
export const urlPublicity = (id = 0) => {
  return `/api/publicidad/${id}`;
}
export const urlEvidences = `/api/evidencias/`;


export const urlProfile = '/api/perfil'

export const urlRoles = {
  getRoles: '/api/roles',
}