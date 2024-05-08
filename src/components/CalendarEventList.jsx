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
  Button,
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
  isEvents = false,
}) {
  const { width } = useWindowSize();
  const isMobile = width < 900; // Define mobile view as less than 768px

  const EventList = () => {
    return (
      <Stack bgcolor={"white"} height={"100%"} borderRadius={1}>
        <Stack direction={"row"}>
          <Stack padding={2} spacing={-0.5} width={"100%"}>
            <Typography variant="h6">{parseDate(selectedDate)}</Typography>
          </Stack>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "var(--main-green)",
              display: { md: "block", xs: "none" },

              marginTop: "7px",
              marginBottom: "7px",
              marginRight: "5px",
            }}
          >
            Solicitar espacio
          </Button>
        </Stack>
        <Divider></Divider>
        <List>
          <Stack spacing={0.5}>
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
          </Stack>
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
