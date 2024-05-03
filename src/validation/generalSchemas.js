import * as yup from 'yup';
import messages from './messages';
import {alphanumericRegex} from './regexes';

export const alphanumericSchema = yup
    .string()
    .matches(alphanumericRegex, messages.alphanumeric)

export const numericSchema = yup
    .number()
    .integer()
    .positive()

export const emailSchema = yup
    .string()
    .email(messages.email)