import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GetReservations2 } from "../api/ReservationService";
import { GetEvents } from "../api/EventService";

export default function useNotices(idRol = 2) {
  const [administratorNotices, setAdministratorNotices] = useState([]);
  const [coordinatorNotices, setCoordinatorNotices] = useState([]);
  const [userEventNotices, setUserEventNotices] = useState([]);
  const [userReservationNotices, setUserReservationNotices] = useState([]);
  const [noticeAmount, setNoticeAmount] = useState(0);

  useEffect(() => {
    const getAdministratorNotices = async () => {
      const response = await GetReservations2(["porAvisosAdministrador=true"]);
      const notices = response.data.data;
      setAdministratorNotices(notices);
      const _noticeAmount = notices.reduce(
        (count, notice) =>
          notice.notifyAdministrator === 1 ? count + 1 : count,
        0
      );
      setNoticeAmount(
        notices.reduce(
          (count, notice) =>
            notice.notifyAdministrator === 1 ? count + 1 : count,
          0
        )
      );
    };

    switch (idRol) {
      case idRol:
        getAdministratorNotices();
        break;
    }
  }, []);

  const decreaseNotices = async (a) => {
    setNoticeAmount(100);
  };

  const notices = {
    1: {
      events: userEventNotices,
      reservations: userReservationNotices,
    },
    2: administratorNotices,
    5: coordinatorNotices,
  };

  return {
    notices: notices[idRol],
    noticeAmount: noticeAmount,
    decreaseNotices,
  };
}
