import React, {
  Fragment,
  useMemo,
  useState,
  useEffect,
  Children,
  cloneElement,
} from "react";
import PropTypes from "prop-types";
import { Stack, Button, Typography, Fab, IconButton } from "@mui/material";

import { Link, useNavigate } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { DatePicker } from "@mui/x-date-pickers";

import {
  Calendar,
  Views,
  DateLocalizer,
  momentLocalizer,
} from "react-big-calendar";

import AddIcon from "@mui/icons-material/Add";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import moment from "moment";
import "moment/locale/es";

import * as dates from "./dates";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../App.css";

import { useIsLoading } from "../providers/LoadingProvider.jsx";

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
  const { date, onNavigate, view, setView } = props;

  const handleNavigate = (action) => {
    // Call the onNavigate prop with the action type
    console.log(action);
    onNavigate(action);
  };

  return (
    <Stack padding={{ xs: "20px", md: "0 0 20px 0" }} direction={"row"}>
      {view === Views.MONTH ? (
        <>
          <Stack className="calendar-date-control" direction={"row"}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                value={moment(date)}
                views={["month", "year"]}
                onAccept={(e) => {
                  //console.log(e.toDate());
                  handleNavigate(e.toDate());
                }}
              />
            </LocalizationProvider>

            <IconButton
              color="primary"
              onClick={() => handleNavigate("PREVIOUS")}
            >
              <ArrowBackIcon></ArrowBackIcon>
            </IconButton>

            <IconButton color="primary" onClick={() => handleNavigate("NEXT")}>
              <ArrowForwardIcon></ArrowForwardIcon>
            </IconButton>
          </Stack>
          <Stack
            direction={"row"}
            spacing={1}
            width={{ xs: "fit-conitent", md: "100%" }}
            display={"flex"}
            justifyContent={"end"}
          >
            <Button variant="outlined" onClick={() => handleNavigate("TODAY")}>
              Hoy
            </Button>
            <Button
              sx={{
                backgroundColor: "var(--main-green)",
                display: { md: "block", xs: "none" },
              }}
              variant="contained"
              onClick={
                () => console.log(date.getMonth())
                //showDialog("Solicitar espacio", DialogTypes.reservationForm)
              }
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
            <Fab color="primary" variant="extended" aria-label="add">
              <Link className="a" to={"/notificaciones"}>
                <AddIcon /> Notificar evento
              </Link>
            </Fab>
          </Stack>
        </>
      ) : (
        <Stack alignItems={"center"} direction={"row"}>
          <IconButton color="primary" onClick={() => onNavigate("MONTH")}>
            <ArrowBackIcon></ArrowBackIcon>
          </IconButton>
          <Typography variant="h6" color={"text.secondary"}>
            {" "}
            {`${date.toLocaleString("es-MX", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })} del ${date.getFullYear()}`}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default function MyCalendar({
  localizer = mLocalizer,
  showDemoLink = true,
  ...props
}) {
  const [date, setDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [openEventSidebar, setOpenEventSidebar] = useState(false);
  const { isLoading, setIsLoading } = useIsLoading();
  const navigate = useNavigate();
  const [openBottomDrawer, setOpenBottomDrawer] = useState(false);

  const [view, setView] = useState(Views.MONTH);

  const { components, defaultDate, max, views } = useMemo(
    () => ({
      components: {
        toolbar: (props) => CustomToolbar({ ...props }, view, setView),
        dateCellWrapper: (props) => (
          <TouchCellWrapper {...props} onSelectSlot={handleSelectSlot} />
        ),
      },
      defaultDate: new Date(2015, 3, 1),
      max: dates.add(dates.endOf(new Date(2015, 17, 1), "day"), -1, "hours"),
      views: Object.keys(Views).map((k) => Views[k]),
    }),
    []
  );

  const handleSelectSlot = (slotInfo) => {
    const { start, end } = slotInfo;
    if (start) {
      console.log(slotInfo);
      const eventsInRange = events.filter(
        (event) =>
          moment(event.start).isSameOrAfter(moment(start)) &&
          moment(event.end).isSameOrBefore(moment(end))
      );
      setSelectedEvents(eventsInRange);
      setSelectedDate(slotInfo.start);
    } else {
      console.log(slotInfo.slots[0]);
      setDate(slotInfo.slots[0]);
      setView(Views.DAY);
    }
  };

  const getEvents = async () => {
    setIsLoading(true);
    const response = await GetEventsByMonth(date);

    const responseEvents = response.data.data;
    let eventsByReservation = [];
    for (const event of responseEvents) {
      event.reservations.map((reservation) => {
        eventsByReservation.push({
          id: event.id,
          title: event.name,
          space: reservation.space,
          start: new Date(reservation.start),
          end: new Date(reservation.end),
        });
      });
    }

    setEvents(eventsByReservation);
    setIsLoading(false);
  };

  const handleNavigation = async (newDate, view, action) => {
    let date2 = new Date();
    console.log(action);
    switch (action) {
      case "PREVIOUS":
        date2.setMonth(date.getMonth() - 1);
        setDate(date2);
        break;
      case "NEXT":
        date2.setMonth(date.getMonth() + 1);
        setDate(date2);
        break;
      case "DATE":
        setView(Views.DAY);
        break;
      case "MONTH":
        setView(Views.MONTH);
      case "TODAY":
        setDate(date2);
        break;
      default:
        setDate(new Date(action));
    }
  };

  useEffect(() => {
    getEvents();
  }, [date]);

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

  const TouchCellWrapper = ({ children, value, onSelectSlot }) =>
    cloneElement(Children.only(children), {
      onTouchEnd: () => onSelectSlot({ action: "click", slots: [value] }),
      style: {
        className: `${children}`,
      },
    });

  return (
    <Stack
      display={"flex"}
      className="calendar"
      width={"100%"}
      height={"100%"}
      direction={"row"}
    >
      <Stack style={{ height: "100%", width: "100%", flexGrow: 2 }}>
        <Calendar
          localizer={localizer}
          selectable={true}
          startAccessor="start"
          endAccessor="end"
          components={components}
          onSelectSlot={handleSelectSlot}
          date={date}
          onView={(e) => console.log(e)}
          view={view}
          onNavigate={handleNavigation}
          onSelectEvent={(e) => navigate(`/eventos/${e.id}`)}
          defaultDate={moment()}
          formats={formats}
          events={events}
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
