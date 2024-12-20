import { 
  urlEvents, 
  urlNotifications, 
  urlEventById, 
  urlEventsByMonth, 
  urlUserEvents, 
  urlNewEvents, 
  urlResponses
} from "./urls.js";
import { client } from "./Client";

import moment from "moment";
import packageInfo from '../package.json';

const filters = {
  porFechaEnvio: "&porFechaEnvio=true",
  porAlfabetico: "&porAlfabetico=true",
}

export const getEventReport = async (month = moment()) => {
  //downloadReport()
  mockDownloadReport();
  
} 

const downloadReport = (response) => {
  const start = month.format("YYYY-MM-DD");
  const end = month.clone().add(1, "month").subtract(1, "day").format("YYYY-MM-DD");
  client.get(`/eventos/reporte?fechaInicio=${start}&fechaFin=${end}`, {responseType: "blob"})
        .then(response => downloadFile(
          URL.createObjectURL(response.data), 
          getReportFilename(response)
        ))
  client.get(`/evidencias/reporte?fechaInicio=${start}&fechaFin=${end}`, {responseType: "blob"})
      .then(response => downloadFile(
        URL.createObjectURL(response.data), 
        getReportFilename(response)
      ))
}

const mockDownloadReport = () => {
  downloadFile("https://alefchacon.github.io/eventosfei-front/reportesEventos.pdf", "reportesEventos.pdf");
  downloadFile("https://alefchacon.github.io/eventosfei-front/reportesEvidencias.pdf", "reportesEvidencias.pdf");
}

function downloadFile(filePath, fileName) {
  const link = document.createElement('a');
  link.href = filePath; // File URL
  link.download = fileName; // Desired file name
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); // Cleanup
}

const getReportFilename = (response) => {
  const contentDisposition = response.headers['content-disposition'];
  const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
  return filenameMatch ? filenameMatch[1] : 'default-filename.pdf';
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
  return catalog.map(item => item["name"]).join(";")
}