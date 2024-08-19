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

  const [currentIdRol, setIdRol] = useState(idRol.ORGANIZADOR);
  const [idUsuario, setIdUsuario] = useState(1);
  const [isStaff, setIsStaff] = useState();

  const { showSnackbar } = useSnackbar();

  const { user, token } = useAuth();

  const getNoticeAmount = async (page = 1) => {
    console.log(token);

    //debugger;

    if (!user || !token) {
      return;
    }

    try {
      setIsStaff(user.rol.id > idRol.COORDINADOR);
      const response = await GetNoticeAmount();
      const newNoticeAmount = response.data.noticeAmount;
      setNoticeAmount(newNoticeAmount);
    } catch (error) {
      //showSnackbar(error.message);
    }

    //return noticeData;
  };

  const getNotices = async (page = 1) => {
    try {
      const response = await GetNotices(page);

      console.log(response.data);

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
    console.log(pagedNotices);
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
        removeNotices,
        markAsRead,
        isStaff,
      }}
    >
      {children}
    </NoticesContext.Provider>
  );
}
