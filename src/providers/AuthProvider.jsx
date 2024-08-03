import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, LogOut } from "../api/UserService";
import { idRol } from "../validation/enums/idRol";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [isCoordinator, setIsCoordinator] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const navigate = useNavigate();

  const logIn = async (credentials) => {
    try {
      const response = await LogIn(credentials);
      if (!response.data) {
        throw new Error("response.data");
      }

      const user = response.data.user;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      setIsCoordinator(user.rol.id === idRol.COORDINADOR);

      const token = response.data.token;
      localStorage.setItem("site", token);
      setToken(token);

      navigate("/calendario");
    } catch (error) {
      console.error(error);
    }
  };

  const logOut = async () => {
    setUser(null);
    localStorage.removeItem("site");
    setToken("");

    navigate("/");
    LogOut();
  };

  return (
    <AuthContext.Provider value={{ token, user, logIn, logOut, isCoordinator }}>
      {children}
    </AuthContext.Provider>
  );
}
