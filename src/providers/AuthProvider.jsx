import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, LogOut } from "../api/UserService";
import { idRol } from "../validation/enums/idRol";
import { client } from "../api/Client";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

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

      navigate("/calendario");
    } catch (error) {
      console.error(error);
    }
  };

  const logOut = async () => {
    setUser(null);
    client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    LogOut();
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
