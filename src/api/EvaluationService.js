import { urlEvaluations } from "./urls"
import { client } from "./Client.js";
import messages from "../validation/messages";

export default async function AddEvaluation(evaluation, evidences){
  const data = {
    "calificacionAtencion": evaluation.ratingAttention,
    "razonCalificacionAtencion":evaluation.ratingAttentionReason,
    "calificacionComunicacion":evaluation.ratingCommunication,
    "mejorasApoyo":evaluation.improvementsSupport ?? messages.campoOpcional,
    "calificacionEspacio":evaluation.ratingSpace,
    "problemasEspacio": evaluation.problemsSpace ?? messages.campoOpcional,
    "calificacionCentroComputo":evaluation.ratingComputerCenter,
    "razonCalificacionCentroComputo":evaluation.ratingComputerCenterReason,
    "calificacionRecursos":evaluation.ratingResources,
    "razonCalificacionRecursos":evaluation.ratingResourcesReason,
    "mejorasRecursos":evaluation.improvementsResources ?? messages.campoOpcional,
    "adicional":evaluation.additional ?? messages.campoOpcional,
    "idEvento":evaluation.idEvento,
  }

  let formData = new FormData();
  for (const key in data){
    formData.append(key, data[key]);
  }

  for (let i = 0; i<evidences.length; i++){
    formData.append(`evidencias[${i}]`, evidences[i])
  }


  const response = await client.post(urlEvaluations, formData,  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
}
