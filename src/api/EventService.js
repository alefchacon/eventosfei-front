import { urlEvents, urlNotifications, urlEventById, urlEventsByMonth } from "./urls.js";
import { client } from "./Client.js";

export const GetEventsByMonth = async (date) => {
  const data = {
    "year"  : date.getFullYear(),
    "month" : date.getMonth()+1,
  }
  const response = await client.post(urlEventsByMonth,data);
  return response;
};

export const GetEvents = async () => {
  const response = await client.get(urlEvents);
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
