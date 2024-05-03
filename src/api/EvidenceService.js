import { urlEvidences } from "./urls"
import { client } from "./Client";

export default async function AddEvidence(idEvaluacion, evidence){
  console.log(evidence)
  const formData = new FormData();
  formData.append('Evidencia[archivo]', evidence);
  formData.append('Evidencia[idEvaluacion]', idEvaluacion);

  const response = await client.post(urlEvidences, formData);
  return response;
}
