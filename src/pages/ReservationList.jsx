import { useState, useEffect, useRef } from "react";

import CardReservation from "../components/CardReservation.jsx";
import { Stack } from "@mui/material";
import { GetEvents, GetNotifications } from "../api/EventService.js";
import { GetReservations } from "../api/ReservationService.js";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import { useDialog } from "../providers/DialogProvider.jsx";

export default function ReservationList(
  { notifications },
  { setSelectedFEIEvent }
) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showDialog } = useDialog();

  const handle = (FEIEvent) => {
    setSelectedFEIEvent(FEIEvent);
  };

  const handleUpdateEvent = (updatedEvent) => {
    const newEvents = items.map((event) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
    setItems(newEvents);
  };

  useEffect(() => {
    // Simulate fetching data with static data
    const fetchData = async () => {
      try {
        let response = [];

        response = await GetReservations();

        if (!response.status === 200) {
          throw new Error("Network response was not ok");
        }

        const data = response.data;
        const events = data.data;
        setItems(events);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <>
      <Stack spacing={2} margin={5}>
        {items.map((item) => (
          <CardReservation reservation={item} key={item.id}></CardReservation>
        ))}
      </Stack>
    </>
  );
}
