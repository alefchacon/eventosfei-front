import { client } from "./Client";
import { urlLogin } from "./urls";
import Cookies from 'js-cookie';
import axios from "axios";


axios.defaults.withCredentials = true;

/*
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
*/
axios.defaults.headers.common['X-CSRF-TOKEN'] = Cookies.get("XSRF-TOKEN");

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export const LogIn = async (user) => {

  //await axios.get('http://localhost:8000/api/sanctum/csrf-cookie');
  const requestData = {
    email: user.email,
    password: user.password
  }

  const response = await axios.post('http://localhost:8000/api/login', requestData)
  console.log(response)
  return response;
}


