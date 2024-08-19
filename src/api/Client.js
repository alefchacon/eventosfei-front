import axios from "axios";
import { useContext } from 'react';

import { backendUrl } from "./urls.js";
import { SnackbarContext } from "../providers/SnackbarProvider.jsx";
import { LoadingContext } from "../providers/LoadingProvider.jsx";
import { AuthContext } from "../providers/AuthProvider.jsx";
axios.defaults.withCredentials = true;
import { httpErrors } from "../validation/enums/httpErrors.js";

const client = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

const useAxiosInterceptors = () => {
  const {showSnackbar} = useContext(SnackbarContext);
  const {setIsLoading} = useContext(LoadingContext);
  const {clearData} = useContext(AuthContext);


  client.interceptors.request.use(function (config) {
    setIsLoading(true);
    return config;
  }, function (error) {
    setIsLoading(true);
    return Promise.reject(error);
  });

  client.interceptors.response.use(
    (response) => {
      setIsLoading(false);
      return response;
    },
    (error) => {
      const status = error.response?.status;
      if (status === 401){
        clearData();
      }
      showSnackbar(error.response.data.message);
      setIsLoading(false);
      
      return Promise.reject(error);
    }
  );
};


export {client, useAxiosInterceptors};


