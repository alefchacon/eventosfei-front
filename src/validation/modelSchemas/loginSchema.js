import * as yup from 'yup';
import {emailSchema, alphanumericSchema} from '../generalSchemas'
import messages from '../messages';

export const loginSchema = yup.object().shape({
  email: emailSchema.clone().required(messages.required),
  password: alphanumericSchema.clone().required(messages.required),
});