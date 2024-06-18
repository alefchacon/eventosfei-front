import { client } from "./Client";
import { urlLogin, urlUsers, urlProfile } from "./urls";
import Cookies from "js-cookie";
import axios from "axios";

axios.defaults.withCredentials = true;

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

export const LogIn = async (user) => {
  const requestData = {
    email: user.email,
    password: user.password,
  };

  const response = await axios.post("http://localhost:8000/api/login",requestData);

  const token = response.data.token;
  client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  localStorage.setItem("user", JSON.stringify(response.data.user));
  console.log(JSON.parse(localStorage.getItem("user")))
  return response;
};
  
export const LogOut = async () => {
  const token = client.defaults.headers.common['Authorization'];
  const response = await client.post("http://localhost:8000/api/logout")
  if (response.status === 200 ) {
    localStorage.removeItem("user")
    delete client.defaults.headers.common['Authorization'];
  }
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
  console.log(response)
}