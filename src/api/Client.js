import axios from 'axios';

import { backendUrl } from './urls.js'



axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: backendUrl
});


export {client}