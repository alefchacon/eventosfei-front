import axios from 'axios';

import { backendUrl } from './urls.js'



axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json"
  }
});


export {client}