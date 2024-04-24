import * as yup from 'yup';
import {alphanumericSchema, numericSchema} from '../generalSchemas'
import messages from '../messages';

const ratingSchema = yup.object().shape({
    value: numericSchema
});

export const evaluationSchema = yup.object().shape({
    ratingAttention: numericSchema.clone().required(messages.required),
    ratingAttentionReason: alphanumericSchema.clone().required(messages.required),
    ratingCommunication: numericSchema.clone().required(messages.required),
    improvementsSupport: alphanumericSchema.clone(),
    ratingSpace: numericSchema.clone().required(messages.required),
    problemsSpace: alphanumericSchema.clone(),
    ratingComputerCenter: numericSchema.clone().required(messages.required),
    ratingComputerCenterReason: alphanumericSchema.clone().required(messages.required),
    ratingResources: numericSchema.clone().required(messages.required),
    ratingResourcesReason: alphanumericSchema.clone().required(messages.required),
    problemsResources: alphanumericSchema.clone().required(messages.required),
    improvementsResources: alphanumericSchema.clone(),
    additional: alphanumericSchema.clone(),
    /*
    razonCalificacionAtencion : alphanumericSchema.clone().required(messages.required),
    calificacionComunicacion: parseInt(communicationRating),
    mejorasApoyo : document.querySelector('#supportImprovements').value,
    calificacionEspacio: spaceRating,
    problemasEspacio : document.querySelector('#spaceProblems').value,
    calificacionCentroComputo: computerCenterRating,
    razonCalificacionCentroComputo : document.querySelector('#computerCenterRatingReason').value,
    calificacionRecursos: resourcesRating,
    razonCalificacionRecursos : document.querySelector('#resourcesRatingReason').value,
    problemaRecursos : document.querySelector('#resourcesProblems').value,
    mejorasRecursos : document.querySelector('#resourcesImprovements').value,
    adicional : document.querySelector('#additional').value,
    idEvento: 1
    */
});