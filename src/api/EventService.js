import { urlEvents, urlNotifications, urlEventById, urlEventsByMonth, urlUserEvents } from "./urls.js";
import { client } from "./Client.js";

const filters = {
  porFechaEnvio: "&porFechaEnvio=true",
  porAlfabetico: "&porAlfabetico=true",
}

export const GetEventsByMonth = async (date) => {
  const data = {
    "year"  : date.getFullYear(),
    "month" : date.getMonth()+1,
  }
  const response = await client.post(urlEventsByMonth,data);
  return response;
};

export const GetEvents = async (filters = [""]) => {
  let url = urlEvents
  filters.forEach(filter => {
    url = url.concat("&", filter)
  })
  const response = await client.get(url);
  return response;
};

export const GetUserEvents = async (idUsuario, page, filter = "") => {
  const response = await client.get(urlUserEvents(idUsuario, page, filters[filter]));
  return response;
};

export const GetEventById = async (id) => {
  const response = await client.get(urlEventById(id));
  return response;
};

export const RespondToEvent = async (event, id) => {
  const data = {
    respuesta: event.response,
    idEstado: event.idEstado,
  };
  const response = await client.put(urlEventById(id), data);
  return response;
};

export const GetNotifications = async () => {
  const response = await client.get(urlNotifications);
  return response;
};
