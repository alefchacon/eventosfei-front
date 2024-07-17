import { useEffect, createContext, useContext, useState } from "react";
import { useIsLoading } from "./LoadingProvider";
import { useLocation } from "react-router-dom";
import { GetNotices, MarkAsUserRead } from "../api/NoticeService";
import { idRol } from "../validation/enums/idRol";

const NoticesContext = createContext(null);

export function useNotices() {
  return useContext(NoticesContext);
}

export function NoticeProvider({ children }) {
  const [notices, setNotices] = useState([]);

  const [noticeAmount, setNoticeAmount] = useState(0);

  const location = useLocation();

  const [currentIdRol, setIdRol] = useState(5);
  const [idUsuario, setIdUsuario] = useState(1);
  const [isStaff, setIsStaff] = useState(currentIdRol > idRol.ORGANIZADOR);

  const { isLoading, setIsLoading } = useIsLoading();

  const getNotices = async (page = 1) => {
    setIsLoading(true);

    let filters = [];
    if (currentIdRol === idRol.ORGANIZADOR) {
      filters.push(`idUsuario=${idUsuario}`);
    }
    if (currentIdRol === idRol.ADMINISTRADOR_ESPACIOS) {
      filters.push(`vista=admin`);
    }
    if (currentIdRol === idRol.COORDINADOR) {
      filters.push(`vista=coord`);
    }
    filters.push(`page=${page}`);

    const response = await GetNotices(filters);

    const noticeData = response.data.data;
    const newNoticeAmount = response.data.noticeAmount;
    setNoticeAmount(newNoticeAmount);

    setIsLoading(false);
    return noticeData;
  };

  useEffect(() => {
    console.log(isStaff);
    getNotices(1);
  }, [location]);

  const removeNotice = () => {
    setNoticeAmount((prev) => prev - 1);
  };

  const removeNotices = async (notices = []) => {
    const response = await MarkAsUserRead(notices, isStaff);
    if (noticeAmount >= response.noticesUpdated) {
      setNoticeAmount((prev) => prev - response.noticesUpdated);
    }
  };

  return (
    <NoticesContext.Provider
      value={{
        noticeAmount,
        removeNotice,
        getNotices,
        removeNotices,
        isStaff,
      }}
    >
      {children}
    </NoticesContext.Provider>
  );
}
