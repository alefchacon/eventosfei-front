import * as yup from 'yup';
import messages from './messages';
import {alphanumericRegex} from './regexes';

export const alphanumericSchema = yup
    .string()

export const numericSchema = yup
    .number()
    .integer()
    .positive()

export const emailSchema = yup
    .string()
    .email(messages.email)

export const arraySchema = yup
    .array()
    .min(1, "Debe seleccionar al menos una opción");