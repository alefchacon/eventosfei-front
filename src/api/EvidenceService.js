import { urlEvidences } from "./urls"
import { client } from "./Client";

export const AddEvidence = async (idEvaluacion, evidence) => {
  console.log(evidence)
  const formData = new FormData();
  formData.append('Evidencia[archivo]', evidence);
  formData.append('Evidencia[idEvaluacion]', idEvaluacion);

  const response = await client.post(urlEvidences, formData);
  return response;
}


export const GetEvidences = async (idEvaluacion = 0) => {
  return await client.get(urlEvidences.concat(idEvaluacion));
  
}