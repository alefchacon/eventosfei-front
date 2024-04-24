import { urlEvaluations } from "./urls"
import { client } from "./Client";

export default async function CreateEvaluation(evaluation, evidences){
  const formData = new FormData();
  evidences.forEach((archivo, index) => {
    formData.append(`evidencias[${index}][evidencia]`, archivo);
  });
  
  
  const data = {
    "calificacionAtencion": evaluation.ratingAttention,
    "razonCalificacionAtencion":evaluation.ratingAttentionReason,
    "calificacionComunicacion":evaluation.ratingCommunication,
    "mejorasApoyo":evaluation.improvementsSupport,
    "calificacionEspacio":evaluation.ratingSpace,
    "problemasEspacio":evaluation.problemsSpace,
    "calificacionCentroComputo":evaluation.ratingComputerCenter,
    "razonCalificacionCentroComputo":evaluation.ratingComputerCenterReason,
    "calificacionRecursos":evaluation.ratingResources,
    "razonCalificacionRecursos":evaluation.ratingResourcesReason,
    "problemasRecursos":evaluation.problemsResources,
    "mejorasRecursos":evaluation.improvementsResources,
    "adicional":evaluation.additional,
    "idEvento":evaluation.idEvento,
    "evidencias": evidences
  }
  console.log(data)
  const response = await client.post(urlEvaluations, data);
  console.log(response)
}

export const AddUser = async (data) => {
  const user = {
    "nombres":          data.names,
    "apellidoPaterno":  data.paternalName, 
    "apellidoMaterno":  data.maternalName, 
    "email":            data.email,
    "puesto":           data.job,
    "idRol":            data.idRol,
  }
  return await client.post(urlUsers.addUser, user);
}