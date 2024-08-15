import { 
  urlEvents, 
  urlNotifications, 
  urlEventById, 
  urlEventsByMonth, 
  urlUserEvents, 
  urlNewEvents, 
  urlResponses
} from "./urls.js";
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
  let url = urlEvents.concat("?")
  filters.forEach(filter => {
    url = url.concat(filter, "&")
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

export const Respond = async (notification, id) => {
  const data = {
    id: id,
    observaciones: notification.response,
    idEstado: notification.idEstado,
    vistoStaff: notification.vistoStaff,
    vistoOrganizador: notification.vistoOrganizador,
  };
  console.log(data);
  const response = await client.put(urlResponses.concat(id), data);
  return response;
};


export const GetNotifications = async () => {
  const response = await client.get(urlNotifications);
  return response;
};

export const UpdateEvent = async (notificationResponse, idAviso) => {
  const body = {
    model: {
      id: notificationResponse.id,
      idEstado: notificationResponse.idEstado,
      observaciones: notificationResponse.notes, 
    },
    idAviso: idAviso
  }
  return await client.put(urlEvents.concat(`/${notificationResponse.id}`), body);
} 

export const GetNewEvents = async (filters = [""]) => {
  let url = urlNewEvents
  filters.forEach(filter => {
    url = url.concat("&", filter)
  })
  console.log(url)
  const response = await client.get(url);
  return response;
}

export const StoreEvent = async (values) => {

  const newValues = {...values};

  newValues.audiencias = parseStringCatalog(newValues.audiencias);
  newValues.tematicas = parseStringCatalog(newValues.tematicas);
  newValues.medios = parseStringCatalog(newValues.medios);
  newValues.inicio = moment(newValues.inicio).format("YYYY-MM-DD");
  newValues.fin = moment(newValues.fin).format("YYYY-MM-DD");
  newValues.programas = JSON.stringify(newValues.programas);
  newValues.reservaciones = JSON.stringify(newValues.reservaciones);  


  console.log(newValues)

  /*
  Transformar datos a FormData, para poder enviar 
  los archivos del cronograma y publicidad.
  */
  const formData = new FormData();
  for (const key in newValues) {
    
    if (key === "publicidad") {

      const publicidad = newValues["publicidad"]; 
      for (let i = 0; i<publicidad.length; i++){
        formData.append(`publicidad[${i}]`, publicidad[i])
      }
      
    } else {

      formData.append(key, newValues[key]);
    }
    
  }


  const response = await client.post(urlEvents, formData, {
    headers: {
      /*Este header es vital para que el back
      encuentre los archivos en el request*/
      "Content-Type": "multipart/form-data",
    },
  });
  
  console.log(response);
  //console.log(await client.post(urlEvents, newValues));
}

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
});

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