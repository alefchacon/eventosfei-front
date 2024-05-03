import { urlEvaluations } from "./urls"
import { client } from "./Client";
import messages from "../validation/messages";

export default async function AddEvaluation(evaluation){
  console.log(evaluation)
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
  console.log(data)

  const response = await client.post(urlEvaluations, data);
  return response;
}
