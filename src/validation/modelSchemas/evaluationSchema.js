import * as yup from 'yup';
import {alphanumericSchema, numericSchema} from '../generalSchemas'
import messages from '../messages';

const ratingSchema = yup.object().shape({
    value: numericSchema
});

export const evaluationSchema = yup.object().shape({
    ratingAttention: numericSchema.clone().required(messages.required),
    ratingAttentionReason: alphanumericSchema.clone().required(messages.required),
    ratingCommunication: numericSchema.clone().required(messages.required),
    improvementsSupport: alphanumericSchema.clone(),
    ratingSpace: numericSchema.clone().required(messages.required),
    problemsSpace: alphanumericSchema.clone(),
    ratingComputerCenter: numericSchema.clone().required(messages.required),
    ratingComputerCenterReason: alphanumericSchema.clone().required(messages.required),
    ratingResources: numericSchema.clone().required(messages.required),
    ratingResourcesReason: alphanumericSchema.clone().required(messages.required),
    improvementsResources: alphanumericSchema.clone(),
    additional: alphanumericSchema.clone(),

});