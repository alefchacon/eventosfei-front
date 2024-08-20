import * as yup from 'yup';
import {emailSchema, alphanumericSchema} from '../generalSchemas'
import messages from '../messages';

export const userSchema = yup.object().shape({
  names: alphanumericSchema.clone().required(messages.required),
  paternalName: alphanumericSchema.clone().required(messages.required),
  maternalName: alphanumericSchema.clone().required(messages.required),
  job: alphanumericSchema.clone().required(messages.required),
  email: emailSchema.clone().required(messages.required),
  idRol: yup.number().integer().min(1).max(5).required(messages.required),
});