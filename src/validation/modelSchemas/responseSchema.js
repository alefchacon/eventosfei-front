import * as yup from 'yup';
import {alphanumericSchema, numericSchema} from '../generalSchemas'
import messages from '../messages';

export const responseSchema = yup.object().shape({
    notes : alphanumericSchema.clone(),
    idEstado : numericSchema.clone().required(messages.required),
});