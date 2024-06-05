import { client } from "./Client";
import { urlReservedSpaces, urlReservations } from "./urls";
import moment from "moment";

export const GetReservationsByMonth = async (date) => {
  const request = {
    fecha: date.format("YYYY-MM-DD"),
  };

  const response = await client.post(urlReservedSpaces, request);
  console.log(request)
  console.log(response)
  return response;
};
export const GetReservations = async () => {
  const response = await client.get(urlReservations);
  return response;
};

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

export const UpdateReservation = async (reservation) => {
  const request = {
    id: reservation.id,
    respuesta: reservation.response,
    idEstado: reservation.idEstado,
  };
  console.log(request)
  const response = await client.put(urlReservations, request);
  return response;
};
