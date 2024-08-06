import { useEffect, createContext, useContext, useState } from "react";
import { useIsLoading } from "./LoadingProvider";
import { useLocation } from "react-router-dom";
import { GetNotices, UpdateNotice } from "../api/NoticeService";
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
    if (!user) {
      return;
    }

    setIsLoading(true);

    setIsStaff(user.rol.id > idRol.COORDINADOR);

    let filters = [];

    const response = await GetNotices(filters);

    //console.log(response.data.data);

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
    setNoticeAmount((prev) => {
      prev - 1;
    });
  };

  const removeNotices = async (notices = []) => {
    //console.log(isStaff);
    /*
    const response = await MarkAsUserRead(notices, isStaff);
    if (noticeAmount >= response.noticesUpdated) {
      setNoticeAmount((prev) => prev - response.noticesUpdated);
    }*/
    //console.log(response);
  };

  const findNotice = (idAviso) => {
    return notices.filter((n) => n.id == idAviso)[0];
  };

  const decreaseNotices = async (idAviso = 0) => {
    if (findNotice(idAviso).read) {
      return;
    }

    setNoticeAmount((prev) => prev - 1);
  };

  const markAsRead = async (idAviso = 0) => {
    const notice = findNotice(idAviso);

    if (notice.read) {
      return;
    }

    const response = await UpdateNotice(idAviso);
  };

  return (
    <NoticesContext.Provider
      value={{
        noticeAmount,
        removeNotice,
        decreaseNotices,
        getNotices,
        removeNotices,
        markAsRead,
        isStaff,
      }}
    >
      {children}
    </NoticesContext.Provider>
  );
}
