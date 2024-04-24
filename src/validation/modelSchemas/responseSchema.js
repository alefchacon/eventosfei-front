import * as yup from 'yup';
import {alphanumericSchema, numericSchema} from '../generalSchemas'
import messages from '../messages';

export const responseSchema = yup.object().shape({
    response : alphanumericSchema.clone().required(messages.required),
    idEstado : numericSchema.clone().required(messages.required),
});