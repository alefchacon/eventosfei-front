import * as yup from 'yup';
import messages from './messages';
import {aphanumericRegex} from './regexes';

export const alphanumericSchema = yup
    .string()
    .matches(aphanumericRegex, messages.alphanumeric)

export const numericSchema = yup
    .number()
    .integer()
    .positive()

export const emailSchema = yup
    .string()
    .email(messages.email)