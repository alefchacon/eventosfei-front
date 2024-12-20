import { client } from "./Client.js";
import { urlLogin, urlUsers, urlProfile, backendUrl } from "./urls";
import Cookies from "js-cookie";
import axios from "axios";



function getRequest(data) {
  return {
    id: data.id,
    nombres: data.names,
    apellidoPaterno: data.paternalName,
    apellidoMaterno: data.maternalName,
    email: data.email,
    puesto: data.job,
    idRol: data.idRol,
  };
}

export const LogIn = async (credentials) => {
  const requestData = {
    email: credentials.email,
    password: credentials.password,
  };

  const response = await client.post(`${backendUrl}/api/login`,requestData);

  return response;
};
  
export const LogOut = async () => {
  const response = await client.post(`${backendUrl}/api/logout`)
  return response;
}

export const GetUsers = async () => {
  return await client.get(urlUsers.getUsersWithRoles);
};
    
export const StoreUser = async (data) => {
  const requestData = getRequest(data);
  return await client.post(urlUsers.addUser, requestData);
};
      
export const UpdateUser = async (data) => {
  const requestData = getRequest(data);
  return await client.put(urlUsers.addUser, requestData);
};
        
export const GetProfile = async () => {
  const response = await client.get(urlProfile);
}