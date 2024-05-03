import React, { Fragment, useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Stack,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Fab,
  Container,
  Drawer,
} from "@mui/material";
import {
  Calendar,
  Views,
  DateLocalizer,
  momentLocalizer,
} from "react-big-calendar";

import AddIcon from "@mui/icons-material/Add";

import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { YearCalendar } from "@mui/x-date-pickers/YearCalendar";
import { MonthCalendar } from "@mui/x-date-pickers/MonthCalendar";

import moment from "moment";
import "moment/locale/es";

import * as dates from "./dates";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../App.css";

import { GetEventsByMonth } from "../api/EventService";

import CalendarEventList from "./CalendarEventList";

moment.locale("es");
const mLocalizer = momentLocalizer(moment);

const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: "lightblue",
    },
  });

const now = new Date();

const CustomToolbar = (props) => {
  const { date, onNavigate } = props;
  const [openEventSidebar, setOpenEventSidebar] = useState(false);

  const handleNavigate = (action) => {
    // Call the onNavigate prop with the action type
    onNavigate(action);
    console.log(date);
  };

  return (
    <div className="calendar-toolbar">
      <div className="calendar-date-control">
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>
              <Typography variant="h6">
                {`${date.toLocaleString("es-MX", {
                  month: "long",
                })} ${date.getFullYear()}`}
              </Typography>
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              className="date-select"
              fullWidth
              style={{ minWidth: "10rem" }}
            >
              <DateCalendar
                defaultValue={moment("2022-04-17")}
                views={["year"]}
                openTo="year"
              />{" "}
            </Select>
          </FormControl>
        </LocalizationProvider>

        <button onClick={() => handleNavigate("PREVIOUS")}>Previous</button>
        <button onClick={() => handleNavigate("NEXT")}>Next</button>
      </div>
      <Stack
        direction={"row"}
        spacing={3}
        width={"100%"}
        display={"flex"}
        justifyContent={"end"}
      >
        <Button onClick={() => handleNavigate("TODAY")}>Hoy</Button>
        <Button
          sx={{
            backgroundColor: "var(--main-green)",
            display: { md: "block", xs: "none" },
          }}
          variant="contained"
        >
          Nueva Notificación
        </Button>
      </Stack>
      <Stack
        position={"absolute"}
        bottom={0}
        right={0}
        padding={5}
        sx={{
          display: { md: "none", xs: "block" },
        }}
      >
        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Stack>
    </div>
  );
};

export default function MyCalendar({
  localizer = mLocalizer,
  showDemoLink = true,
  ...props
}) {
  const { components, defaultDate, max, views } = useMemo(
    () => ({
      components: {
        toolbar: CustomToolbar,
      },
      defaultDate: new Date(2015, 3, 1),
      max: dates.add(dates.endOf(new Date(2015, 17, 1), "day"), -1, "hours"),
      views: Object.keys(Views).map((k) => Views[k]),
    }),
    []
  );

  const [selectedMonth, setDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [openEventSidebar, setOpenEventSidebar] = useState(false);

  const handleOpenEventSidebar = () => {
    setOpenEventSidebar(!openEventSidebar);
    console.log(openEventSidebar);
  };

  const handleSelectSlot = (slotInfo) => {
    const { start, end } = slotInfo;

    // Filter events to find those that are within the selected range
    const eventsInRange = events.filter(
      (event) =>
        moment(event.start).isSameOrAfter(moment(start)) &&
        moment(event.end).isSameOrBefore(moment(end))
    );
    setSelectedEvents(eventsInRange);
    console.log(eventsInRange);
    //console.log("Selected slot:", slotInfo);
    //console.log("Events in selected slot:", eventsInRange);
    setSelectedDate(slotInfo.start);
  };

  const handleNavigation = async (newDate, view, action) => {
    switch (action) {
      case "PREVIOUS":
        selectedMonth.setMonth(selectedMonth.getMonth() - 1);
        break;
      case "NEXT":
        selectedMonth.setMonth(selectedMonth.getMonth() + 1);
        break;
      default:
        setDate(new Date());
    }
    const response = await GetEventsByMonth(selectedMonth);

    const responseEvents = response.data.data;

    let eventsByReservation = [];
    for (const event of responseEvents) {
      event.reservations.map((reservation) => {
        eventsByReservation.push({
          id: event.id,
          title: event.name,
          space: reservation.space.name,
          start: new Date(reservation.start),
          end: new Date(reservation.end),
        });
      });
    }

    setEvents(eventsByReservation);
  };

  const formats = {
    dateFormat: "DD", // day of month
    dayFormat: "ddd DD/MM", // day of the week, date
    monthHeaderFormat: "MMMM YYYY", // full month name and year
    dayHeaderFormat: "dddd DD/MM", // full day of the week, date
    dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
      `${localizer.format(start, "DD/MM/YYYY", culture)} — ${localizer.format(
        end,
        "DD/MM/YYYY",
        culture
      )}`,
  };

  return (
    <Stack
      display={"flex"}
      className="calendar"
      width={"100%"}
      height={"100%"}
      direction={"row"}
    >
      <Button
        sx={{
          display: { md: "none", xs: "block" },
          position: "absolute",
          zIndex: "10000",
          top: 0,
          right: 0,
          margin: 2,
        }}
        variant="contained"
        onClick={handleOpenEventSidebar}
      >
        Eventos
      </Button>
      <Stack
        style={{ height: "100%", width: "100%", flexGrow: 2 }}
        bgcolor={"white"}
      >
        <Calendar
          localizer={localizer}
          selectable={true}
          startAccessor="start"
          endAccessor="end"
          components={components}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={() => console.log("EVENT")}
          date={selectedMonth}
          defaultDate={defaultDate}
          formats={formats}
          events={events}
          onNavigate={handleNavigation}
          style={{ height: "100%", width: "100%", flexGrow: 2 }}
        />
      </Stack>

      <CalendarEventList
        selectedEvents={selectedEvents}
        selectedDate={selectedDate}
        isOpen={openEventSidebar}
      ></CalendarEventList>
    </Stack>
  );
}
MyCalendar.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
  showDemoLink: PropTypes.bool,
};
