import { useState, useEffect, useRef } from "react";

import Card from "./Card.jsx";
import CardUser from "./CardUser.jsx";
import { Stack } from "@mui/material";
import { GetEvents, GetNotifications } from "../api/EventService.js";
import Typography from "@mui/material/Typography";
import CircularProgress from "./CircularProgress.jsx";
import { Container } from "@mui/material";

export default function UserList({ notifications }, { setSelectedFEIEvent }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const handle = (FEIEvent) => {
    console.log(FEIEvent);
    setSelectedFEIEvent(FEIEvent);
  };

  useEffect(() => {
    // Simulate fetching data with static data
    const fetchData = async () => {
      try {
        let response = [];

        if (notifications) {
          response = await GetNotifications();
        } else {
          response = await GetEvents();
        }

        if (!response.status === 200) {
          throw new Error("Network response was not ok");
        }

        const data = response.data;
        const events = data.data;
        setItems(events);
        setLoading(false);
        //setItems(response)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <>
      {loading && (
        <Container
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress></CircularProgress>
        </Container>
      )}
      <Stack spacing={2} margin={5}>
        {items.map((item) => (
          <CardUser user={item} key={item.id} parentHandle={handle}></CardUser>
        ))}
      </Stack>
    </>
  );
}
