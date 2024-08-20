import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, LogOut } from "../api/UserService";
import { idRol } from "../validation/enums/idRol";
import { client } from "../api/Client.js";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (error) {
      localStorage.removeItem("user");
      navigate("/");
    }
  });

  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const navigate = useNavigate();

  useEffect(() => {
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, []);

  const logIn = async (credentials) => {
    try {
      const response = await LogIn(credentials);
      if (!response.data) {
        throw new Error("response.data");
      }

      const user = response.data.user;

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      const token = response.data.token;
      localStorage.setItem("site", token);
      setToken(token);
      client.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const logOut = async () => {
    LogOut();
    clearData();
  };

  const clearData = () => {
    setUser(null);
    localStorage.removeItem("user");
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.removeItem("site");
    setToken("");
    delete client.defaults.headers.common["Authorization"];
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        logIn,
        logOut,
        clearData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
