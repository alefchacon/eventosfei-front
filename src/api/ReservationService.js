import { client } from "./Client.js";
import { urlReservedSpaces, urlReservations, urlAvailableReservations, urlNewReservations, urlUpdateReservation, urlReservationsMarkAsRead, urlReservations2 } from "./urls";
import moment from "moment";

export const GetReservationsByMonth = async (date) => {
  const request = {
    fecha: date.format("YYYY-MM-DD"),
  };

  const response = await client.post(urlReservedSpaces, request);

  return response;
};
export const GetReservations = async () => {
  const response = await client.get(urlReservations);
  return response;
};

export const GetNewReservation = async (filters = [""]) => {
  let url = urlNewReservations
  filters.forEach(filter => {
    url = url.concat("&", filter)
  })
  const response = await client.get(url);
  return response;
}

export const GetReservations2 = async (filters = [""]) => {
  let url = urlReservations
  filters.forEach(filter => {
    url = url.concat("&", filter)
  })
  const response = await client.get(url);
  return response;
}

export const AddReservation = async (reservation) => {
  const request = {
    inicio: moment(reservation.start).format("YYYY-MM-DDTHH:mm"),
    fin: moment(reservation.end).format("YYYY-MM-DDTHH:mm"),
    idEspacio: reservation.idEspacio,
    idUsuario: reservation.idUsuario,
    // CAMBIAR:
    idEstado: 1,
  };
  const response = await client.post(urlReservations, request);
  return response;
};

export const UpdateReservation = async (notificationResponse, idAviso) => {
  const body = {
    model: {
      id: notificationResponse.id,
      idEstado: notificationResponse.idEstado,
      respuesta: notificationResponse.notes, 
    },
    idAviso: idAviso
  }
  return await client.put(urlReservations2.concat(`/${notificationResponse.id}`), body);
};

export const MarkAsUserRead = async (reservations = []) => {
  const request = {
    reservations: reservations
  }
  const response = await client.post(
    urlReservationsMarkAsRead, 
    request
  );
  return response;

}

export const GetAvailableReservations = async () => {
  const request = {
    idUsuario: JSON.parse(localStorage.getItem("user")).id,
  }
  return await client.post(urlAvailableReservations, request);
  
}