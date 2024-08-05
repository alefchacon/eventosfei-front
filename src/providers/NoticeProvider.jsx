import { useEffect, createContext, useContext, useState } from "react";
import { useIsLoading } from "./LoadingProvider";
import { useLocation } from "react-router-dom";
import { GetNotices, MarkAsUserRead } from "../api/NoticeService";
import { idRol } from "../validation/enums/idRol";

import { useAuth } from "./AuthProvider";

const NoticesContext = createContext(null);

export function useNotices() {
  return useContext(NoticesContext);
}

export function NoticeProvider({ children }) {
  const [notices, setNotices] = useState([]);

  const [noticeAmount, setNoticeAmount] = useState(0);

  const location = useLocation();

  const [currentIdRol, setIdRol] = useState(idRol.ORGANIZADOR);
  const [idUsuario, setIdUsuario] = useState(1);
  const [isStaff, setIsStaff] = useState();

  const { isLoading, setIsLoading } = useIsLoading();

  const { isCoordinator, isAdministrator, isOrganizer, user } = useAuth();

  const getNotices = async (page = 1) => {
    setIsLoading(true);

    setIsStaff(user.id > idRol.COORDINADOR);

    let filters = [];
    if (user.rol.id === idRol.ORGANIZADOR) {
      filters.push(`idUsuario=${user.id}`);
    }
    if (user.rol.id === idRol.ADMINISTRADOR_ESPACIOS) {
      filters.push(`vista=admin`);
    }
    if (user.rol.id === idRol.COORDINADOR) {
      filters.push(`vista=coord`);
    }
    filters.push(`page=${page}`);

    console.log(filters);

    const response = await GetNotices(filters);

    console.log(response.data.data);

    const noticeData = response.data.data;
    setNotices(noticeData.data);
    const newNoticeAmount = response.data.noticeAmount;
    setNoticeAmount(newNoticeAmount);

    setIsLoading(false);
    return noticeData;
  };

  useEffect(() => {
    getNotices(1);
  }, [location]);

  const removeNotice = () => {
    setNoticeAmount((prev) => prev - 1);
  };

  const removeNotices = async (notices = []) => {
    console.log(isStaff);
    const response = await MarkAsUserRead(notices, isStaff);
    if (noticeAmount >= response.noticesUpdated) {
      setNoticeAmount((prev) => prev - response.noticesUpdated);
    }
    console.log(response);
  };

  const removeNoticeEvent = async (idEvento = 0) => {
    const filteredNotice = notices.filter(
      (notice) => notice.idEvento === idEvento
    );
    await MarkAsUserRead(filteredNotice, isStaff);
  };

  return (
    <NoticesContext.Provider
      value={{
        noticeAmount,
        removeNotice,
        removeNoticeEvent,
        getNotices,
        removeNotices,
        isStaff,
      }}
    >
      {children}
    </NoticesContext.Provider>
  );
}
