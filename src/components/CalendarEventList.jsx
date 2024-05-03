import { useState, useEffect, useMemo } from "react";

import {
  Stack,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Drawer,
} from "@mui/material";

import useWindowSize from "../hooks/useWindowSize";
function parseDate(date) {
  // Convert the date object to a string, showing only the month
  return `${date.toLocaleString("es-MX", {
    weekday: "long",
  })}, ${date.getDate()} de ${date.toLocaleString("es-MX", {
    month: "long",
  })}`;
  //return `${date.getDate()} de asdf`;
}

function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default function CalendarEventList({
  selectedEvents,
  selectedDate,
  isOpen,
}) {
  const { width } = useWindowSize();
  const isMobile = width < 900; // Define mobile view as less than 768px

  const EventList = () => {
    return (
      <Stack bgcolor={"white"} height={"100%"} borderRadius={1}>
        <Typography variant="h6" padding={2}>
          {parseDate(selectedDate)}
        </Typography>
        <Divider></Divider>
        <List>
          {selectedEvents.map((FEIEvent) => (
            <ListItem
              className="calendar-event"
              key={FEIEvent.id}
              disablePadding
            >
              <ListItemButton>
                <Stack direction={"row"} spacing={4}>
                  {" "}
                  <ListItemText
                    primary={formatTime(FEIEvent.start)}
                    secondary=" "
                  />
                  <ListItemText
                    sx={{
                      width: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    primary={FEIEvent.title}
                    secondary={FEIEvent.space}
                  />
                </Stack>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Stack>
    );
  };

  return (
    <>
      {isMobile ? (
        <Drawer
          anchor="right"
          variant="temporary"
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          open={isOpen}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 300,
            },
          }}
        >
          <EventList></EventList>
        </Drawer>
      ) : (
        <Stack
          width={"50%"}
          flexGrow={1}
          paddingLeft={3}
          sx={{
            display: { md: "block", xs: "none" },
          }}
        >
          <EventList></EventList>
        </Stack>
      )}
    </>
  );
}
