import { useState, useEffect } from "react";

import { urlReservedSpaces } from "../api/urls";
import { client } from "../api/Client.js";

export default function useReservations(start, end) {
  const [reservations, setReservations] = useState({});

  useEffect(() => {
    const fetchData = async (start, end) => {
      const request = {
        inicio: start._i,
        fin: end._i,
      };
      const response = await client.post(urlReservedSpaces, request);
      setReservations(response.data);
    };

    fetchData(start, end);
  }, [start, end]);

  return reservations;
}
