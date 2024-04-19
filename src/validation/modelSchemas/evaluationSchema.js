import * as yup from 'yup';
import {alphanumericSchema, numericSchema} from '../generalSchemas'
import messages from '../messages';

const ratingSchema = yup.object().shape({
    value: numericSchema
});

export const evaluationSchema = yup.object().shape({
    calificacionAtencion: numericSchema.clone().required(messages.required),
    razonCalificacionAtencion : alphanumericSchema.clone().required(messages.required),
    /*
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