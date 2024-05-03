import {
  Stack,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

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

export default function CalendarEventList({ selectedEvents, selectedDate }) {
  return (
    <div className=" white">
      <Typography variant="h6">{parseDate(selectedDate)}</Typography>
      <Divider></Divider>
      <List>
        {selectedEvents.map((FEIEvent) => (
          <ListItem className="calendar-event" key={FEIEvent.id} disablePadding>
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
    </div>
  );
}
