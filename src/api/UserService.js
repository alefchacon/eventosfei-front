import { client } from "./Client";
import { urlLogin, urlUsers } from "./urls";
import Cookies from 'js-cookie';
import axios from "axios";



export const LogIn = async (user) => {

  const requestData = {
    email: user.email,
    password: user.password
  }

  const response = await axios.post('http://localhost:8000/api/login', requestData)
  return response;
}


export const GetUsers = async () => {
  return await client.get(urlUsers.getUsersWithRoles);
}

export const AddUser = async (data) => {
  const user = {
    "nombres":          data.names,
    "apellidoPaterno":  data.paternalName, 
    "apellidoMaterno":  data.maternalName, 
    "email":            data.email,
    "puesto":           data.job,
    "idRol":            data.idRol,
  }
  return await client.post(urlUsers.addUser, user);
}