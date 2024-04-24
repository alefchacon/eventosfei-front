import { urlEvents, urlNotifications, urlEventById } from "./urls.js";
import { client } from "./Client.js";

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
  console.log(data)
  const response = await client.put(urlEventById(id), data);
  return response;
};

export const GetNotifications = async () => {
  const response = await client.get(urlNotifications);
  return response;
};
