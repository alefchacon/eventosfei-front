import axios from 'axios';

import { backendUrl } from './urls.js'
import { useSnackbar } from '../providers/SnackbarProvider.jsx';


axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
  }
});

client.interceptors.response.use(function (response) {

  return response;
}, function (error) {
  console.log(error)
  return Promise.reject(error);
});

export {client}