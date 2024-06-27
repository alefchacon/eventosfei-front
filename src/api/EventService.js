import { urlEvents, urlNotifications, urlEventById, urlEventsByMonth, urlUserEvents } from "./urls.js";
import { client } from "./Client.js";
import moment from "moment";

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

export const StoreEvent = async (values) => {

  const newValues = {...values};

  //newValues.programas = parseIdCatalog(newValues.programas);
  newValues.audiencias = parseStringCatalog(newValues.audiencias);
  newValues.tematicas = parseStringCatalog(newValues.tematicas);
  newValues.inicio = moment(newValues.inicio).format("YYYY-MM-DD");
  newValues.fin = moment(newValues.fin).format("YYYY-MM-DD");

  
  newValues.programas = JSON.stringify(newValues.programas);
  newValues.reservaciones = JSON.stringify(newValues.reservaciones);


  const formData = new FormData();
  for (const key in newValues) {
    if (key === "difusion") {
      console.log(newValues[key].length);

      for (let i = 0; i < newValues[key].length; i++) {
        formData.append(`difusion[${key}-${i}]`, newValues[key][i]);
      }
    } else {

      formData.append(key, newValues[key]);
    }
  }

  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });

  console.log(newValues);

  //console.log(await client.post(urlEvents, formData));
}

/*
Los catalogos ("ProgramasEducativos", por ejemplo) se manejaban 
como tablas en la BD. Sin embargo, en etapas tardías del desarrollo 
se descubrieron más posibles catalogos (eg: "Ambitos"). Por cuestiones
de tiempo, estas tablas no se implementaron, y en su lugar son 
columnas varchar en la tabla Eventos. Dado que algunos catalogos funcionan
con su ID de la tabla, y otros con un valor string, las listas seleccionables
manejan sus valores como si fueran JSONs con dos atributos: id y name. 
Aquí se parsean esos datos, dependiendo de si el catalogo maneja id o name varchar.

*/ 
function parseStringCatalog(catalog){
  console.log(catalog)
  return catalog.map(item => item["name"]).join(";")
}
function parseIdCatalog(catalog){
  console.log(catalog)
  return catalog.map(item => item["id"]);
}
