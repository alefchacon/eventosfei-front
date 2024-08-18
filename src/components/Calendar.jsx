import React, {
  useState,
  useEffect,
  useRef,
  Children,
  cloneElement,
} from "react";
import PropTypes from "prop-types";
import { Stack, Button, Typography, Fab, IconButton } from "@mui/material";
import html2pdf from "html2pdf.js";
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

import "react-big-calendar/lib/css/react-big-calendar.css";
import "../App.css";

import { GetEventsByMonth } from "../api/EventService";

import CalendarEventList from "./CalendarEventList";

import { modalidad } from "../validation/enums/modalidad.js";

import ResponsiveDialog from "./ResponsiveDialog.jsx";

import CustomFab from "./CustomFab.jsx";

moment.locale("es");
const mLocalizer = momentLocalizer(moment);

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
          </Stack>

          <CustomFab></CustomFab>
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

export default function EventCalendar({
  setTitle,
  localizer = mLocalizer,
  showDemoLink = true,
  ...props
}) {
  const [date, setDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [openEventSidebar, setOpenEventSidebar] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [view, setView] = useState(Views.MONTH);

  useEffect(() => {
    setTitle("Calendario");
  }, []);

  const components = {
    toolbar: (props) => CustomToolbar({ ...props }, view, setView),
    dateCellWrapper: (props) => (
      <TouchCellWrapper {...props} onSelectSlot={filterEventsInDateRange} />
    ),
  };

  const TouchCellWrapper = ({ children, value, onSelectSlot }) =>
    cloneElement(Children.only(children), {
      onTouchEnd: () =>
        onSelectSlot({
          action: "click",
          start: value,
          end: value,
          userIsMobile: true,
        }),
      style: {
        className: `${children}`,
      },
    });

  const filterEventsInDateRange = (slotInfo) => {
    let { start, end } = slotInfo;

    if (slotInfo.userIsMobile) {
      start = moment(start);
      end = moment(start).add(1, "days");
      //end.setDate(end.getDate() + 1);
      console.log("fuck");
    }

    const eventsInDateRange = events.filter(
      (event) =>
        moment(event.start).isBetween(
          moment(start),
          moment(end),
          "day",
          "[)"
        ) ||
        moment(start).isBetween(
          moment(event.start),
          moment(event.end),
          "day",
          "[)"
        )
    );

    for (let event of eventsInDateRange) {
      if (event.mode.id !== modalidad.PRESENCIAL) {
        continue;
      }
      const dateReservations = event.reservations.filter((reservation) =>
        moment(reservation.start).isSame(start, "day")
      );

      if (dateReservations.length === 0) {
        event.currentReservation = {
          space: {
            name: "?",
          },
          startTime: "?",
        };
      } else {
        event.currentReservation = dateReservations[0];
      }
    }

    console.log(eventsInDateRange);

    setSelectedDate(start);
    setSelectedEvents(eventsInDateRange);

    setShowEventModal(slotInfo.userIsMobile);
  };

  const getEvents = async () => {
    const response = await GetEventsByMonth(date);

    const responseEvents = response.data.data;

    let eventsByReservation = [];
    for (const event of responseEvents) {
      eventsByReservation.push({
        id: event.id,
        title: event.name,
        reservations: event.reservations,
        start: event.start,
        end: event.end,
        mode: event.mode,
      });
    }

    setEvents(eventsByReservation);
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
        //setView(Views.DAY);
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

  const eventList = (
    <CalendarEventList
      selectedEvents={selectedEvents}
      selectedDate={selectedDate}
      isOpen={openEventSidebar}
    ></CalendarEventList>
  );

  return (
    <>
      <ResponsiveDialog
        title="Eventos"
        open={showEventModal}
        onClose={() => setShowEventModal(false)}
        secondaryLabel="regresar"
        showPrimary={false}
        responsive
      >
        {eventList}
      </ResponsiveDialog>
      <Stack
        display={"flex"}
        className="calendar"
        width={"100%"}
        height={"100%"}
        direction={"row"}
        gap={1}
      >
        <Stack style={{ flexGrow: 2 }} width={"100%"}>
          <Calendar
            localizer={localizer}
            selectable={true}
            startAccessor="start"
            endAccessor="end"
            components={components}
            onSelectSlot={filterEventsInDateRange}
            date={date}
            onView={(e) => console.log(e)}
            view={view}
            onNavigate={handleNavigation}
            onSelectEvent={(FEIEvent) => {
              console.log(FEIEvent);
              FEIEvent.userIsMobile = true;
              filterEventsInDateRange(FEIEvent);
            }}
            defaultDate={moment()}
            formats={formats}
            events={events}
            style={{ height: "100%", width: "100%", flexGrow: 2 }}
          />
        </Stack>

        <Stack
          sx={{
            display: { md: "flex", xs: "none" },
            flexGrow: 1,
            width: { md: "30%", xs: "100%" },
          }}
        >
          {eventList}
        </Stack>
      </Stack>
    </>
  );
}
EventCalendar.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
  showDemoLink: PropTypes.bool,
};
