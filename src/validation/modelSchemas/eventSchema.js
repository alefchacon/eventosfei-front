import * as yup from 'yup';
import {alphanumericSchema, numericSchema, arraySchema} from '../generalSchemas'
import messages from '../messages';
import { modalidad } from '../enums/modalidad';

const ratingSchema = yup.object().shape({
    value: numericSchema
});

export const eventSchema = yup.object().shape({
    nombre: alphanumericSchema.clone().required(messages.required),
    descripcion: alphanumericSchema.clone().required(messages.required),
    pagina: alphanumericSchema.clone().notRequired(),
    ambito: alphanumericSchema.clone().required(messages.required),
    eje: alphanumericSchema.clone().required(messages.required),
    programas: arraySchema.clone().required(messages.required),
    audiencias: arraySchema.clone().required(messages.required),
    tematicas: arraySchema.clone().required(messages.required),
    
    idModalidad: yup.number().required(messages.required),
    plataformas: yup.number().when('idModalidad', {
        is: (id) => id === modalidad.VIRTUAL || id === modalidad.HIBRIDA,
        then: () => yup.string().required(messages.required),
        otherwise: () => yup.string().notRequired(),
    }),
    
    requiereCentroComputo: yup.boolean().required(messages.required),
    requiereTransmisionEnVivo: yup.boolean().when('requiereCentroComputo', {
        is: true,
        then: () => yup.boolean().required(messages.required),
        otherwise: () => yup.boolean().notRequired()
    }),

    asistiraPublicoExterno: yup.boolean().required(messages.required),
    requiereEstacionamiento: yup.boolean().when('asistiraPublicoExterno', {
        is: true,
        then: () => yup.boolean().required(messages.required),
        otherwise: () => yup.boolean().notRequired()
    }),
    
    requiereFinDeSemana: yup.boolean().when('asistiraPublicoExterno', {
        is: true,
        then: () => yup.boolean().required(messages.required),
        otherwise: () => yup.boolean().notRequired()
    }),
    
    medios: arraySchema.clone().required(messages.required),

    proporcionaraPublicidad: yup.boolean().required(messages.required),

    requiereConstancias: yup.boolean().required(messages.required),
});