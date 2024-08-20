import { useEffect, createContext, useContext, useState } from "react";
import { useIsLoading } from "./LoadingProvider";
import { useLocation } from "react-router-dom";
import {
  GetNoticeAmount,
  GetNotices,
  UpdateNotice,
} from "../api/NoticeService";
import { idRol } from "../validation/enums/idRol";

import { useAuth } from "./AuthProvider";
import { useSnackbar } from "./SnackbarProvider";

const NoticesContext = createContext(null);

export function useNotices() {
  return useContext(NoticesContext);
}

export function NoticeProvider({ children }) {
  const [pagedNotices, setPagedNotices] = useState([]);

  const [noticeAmount, setNoticeAmount] = useState(0);

  const location = useLocation();

  const [isStaff, setIsStaff] = useState();
  const [title, setTitle] = useState("Calendario");

  const { user, token } = useAuth();

  const getNoticeAmount = async (page = 1) => {
    if (!user || !token) {
      return;
    }

    setIsStaff(user.rol.id > idRol.ORGANIZADOR);
    const response = await GetNoticeAmount();
    const newNoticeAmount = response.data.noticeAmount;
    setNoticeAmount(newNoticeAmount);
  };

  const getNotices = async (page = 1) => {
    try {
      const response = await GetNotices(page);

      setPagedNotices(response.data);

      return response.data;
    } catch (error) {
      //showSnackbar(error.message);
    }
  };

  //const get

  useEffect(() => {
    getNoticeAmount(1);
  }, [location]);

  const removeNotice = () => {
    setNoticeAmount((prev) => {
      prev - 1;
    });
  };

  const findNotice = (idAviso) => {
    return pagedNotices.data.filter((n) => n.id == idAviso)[0];
  };

  const decreaseNotices = async (idAviso = 0) => {
    if (findNotice(idAviso).read) {
      return;
    }

    setNoticeAmount((prev) => prev - 1);
  };

  const markAsRead = async (idAviso = 0) => {
    const response = await UpdateNotice(idAviso);
    if (response.data.updated) {
      setNoticeAmount((previous) => previous - 1);
    }
  };

  return (
    <NoticesContext.Provider
      value={{
        getNoticeAmount,
        getNotices,
        notices: pagedNotices,
        noticeAmount,
        removeNotice,
        decreaseNotices,
        markAsRead,
        isStaff,
        title,
        setTitle,
      }}
    >
      {children}
    </NoticesContext.Provider>
  );
}
