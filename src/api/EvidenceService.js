import { urlEvidences } from "./urls"
import { client } from "./Client.js";

export const GetEvidencesFor = async (idEvaluaciones = [9,10]) => {
  const body = {
    "idEvaluaciones": idEvaluaciones
  }
  const response = await client.post(urlEvidences, body);
  return response;
}


export const GetEvidences = async (idEvaluacion = 0) => {
  return await client.get(urlEvidences.concat(idEvaluacion));
  
}