import { useState, useEffect, useMemo } from "react";

import {
  Stack,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import { modalidad } from "../validation/enums/modalidad.js";

import { useNavigate } from "react-router-dom";

function parseDate(date) {
  return `${date.toLocaleString("es-MX", {
    weekday: "long",
  })}, ${date.getDate()} de ${date.toLocaleString("es-MX", {
    month: "long",
  })}`;
}

export default function CalendarEventList({ selectedEvents, selectedDate }) {
  const navigate = useNavigate();

  return (
    <>
      <Typography padding={2} variant="h6" width={"100%"}>
        {parseDate(selectedDate)}
      </Typography>
      <Divider></Divider>
      <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {selectedEvents.map((FEIEvent, index) => (
          <ListItem className="calendar-event" key={index} disablePadding>
            <ListItemButton onClick={() => navigate(`/eventos/${FEIEvent.id}`)}>
              <Stack direction={"row"} spacing={4}>
                {" "}
                {FEIEvent.mode.id === modalidad.PRESENCIAL && (
                  <ListItemText
                    primary={FEIEvent.currentReservation.startTime}
                    secondary=" "
                  />
                )}
                <ListItemText
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  primary={FEIEvent.title}
                  secondary={
                    FEIEvent.mode.id > modalidad.PRESENCIAL
                      ? FEIEvent.mode.name
                      : FEIEvent.currentReservation.space.name
                  }
                />
              </Stack>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
}
