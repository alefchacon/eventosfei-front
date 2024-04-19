import * as yup from 'yup';
import {emailSchema} from '../generalSchemas'
import messages from '../messages';

export const userSchema = yup.object().shape({
  email: emailSchema.clone().required(messages.required),
  password: yup.string().required(messages.required),
});