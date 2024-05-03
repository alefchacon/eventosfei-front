import React, { Fragment, useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import {
  Calendar,
  Views,
  DateLocalizer,
  momentLocalizer,
} from "react-big-calendar";
import * as dates from "./dates";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Stack,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import { GetEventsByMonth } from "../api/EventService";

const mLocalizer = momentLocalizer(moment);

const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: "lightblue",
    },
  });

const now = new Date();
const events = [
  {
    id: 14,
    title: "Today",
    space: "jam",
    start: new Date(new Date().setHours(new Date().getHours() - 3)),
    end: new Date(new Date().setHours(new Date().getHours() + 3)),
  },
  {
    id: 15,
    title: "Point in Time Event",
    space: "jam",
    start: now,
    end: now,
  },
  {
    id: 16,
    title: "Point in Time Event",
    space: "jam",
    start: new Date(2024, 3, 1),
    end: new Date(2024, 3, 1),
  },
  {
    id: 16,
    title: "Man",
    space: "jam",
    start: new Date(2024, 3, 26, 15, 30),
    end: new Date(2024, 3, 26),
  },
];

class CustomToolbar extends React.Component {
  handleNavigate = (action) => {
    // Call the onNavigate prop with the action type
    this.props.onNavigate(action);
  };

  render() {
    return (
      <div className="custom-toolbar">
        <button onClick={() => this.handleNavigate("PREVIOUS")}>
          Previous
        </button>
        <button onClick={() => this.handleNavigate("TODAY")}>Today</button>
        <button onClick={() => this.handleNavigate("NEXT")}>Next</button>
      </div>
    );
  }
}

export default function MyCalendar({
  localizer = mLocalizer,
  showDemoLink = true,
  ...props
}) {
  const { components, defaultDate, max, views } = useMemo(
    () => ({
      components: {
        timeSlotWrapper: ColoredDateCellWrapper,
        toolbar: CustomToolbar,
      },
      defaultDate: new Date(2015, 3, 1),
      max: dates.add(dates.endOf(new Date(2015, 17, 1), "day"), -1, "hours"),
      views: Object.keys(Views).map((k) => Views[k]),
    }),
    []
  );

  function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const [selectedMonth, setDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [events, setEvents] = useState([]);

  const handleSelectSlot = (slotInfo) => {
    const { start, end } = slotInfo;

    // Filter events to find those that are within the selected range
    const eventsInRange = events.filter(
      (event) =>
        moment(event.start).isSameOrAfter(moment(start)) &&
        moment(event.end).isSameOrBefore(moment(end))
    );
    setSelectedEvents(eventsInRange);

    console.log("Selected slot:", slotInfo);
    //console.log("Events in selected slot:", eventsInRange);
    //console.log(selectedDate);
    setSelectedDate(slotInfo.start);
  };

  const slotPropGetter = (date) => {
    const isSelected = moment(selectedDate).isSame(date, "day");
    return {
      style: {
        backgroundColor: isSelected ? "red" : "blue", // Change color here
      },
    };
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

    console.log(eventsByReservation);

    setEvents(eventsByReservation);
  };

  function parseDate(date, timeString) {
    const timeParts = timeString.split(":");

    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = parseInt(timeParts[2], 10);

    console.log(date);
    const newDate = new Date(date);

    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(seconds);

    return newDate;
  }

  return (
    <Stack className="calendar" width={"100%"} direction={"row"}>
      <Calendar
        localizer={localizer}
        selectable={"ignoreEvents"}
        startAccessor="start"
        endAccessor="end"
        onSelectSlot={handleSelectSlot}
        slotPropGetter={slotPropGetter}
        date={selectedMonth}
        components={components}
        defaultDate={defaultDate}
        events={events}
        max={max}
        showMultiDayTimes
        onNavigate={handleNavigation}
        step={60}
        views={views}
        style={{ height: 500, width: "100%" }}
      />

      <List sx={{ minWidth: 200, width: 400 }}>
        {selectedEvents.map((FEIEvent) => (
          <ListItem key={FEIEvent.id} disablePadding>
            <ListItemButton>
              <Stack direction={"row"} spacing={4}>
                {" "}
                <ListItemText
                  primary={formatTime(FEIEvent.start)}
                  secondary=" "
                />
                <ListItemText
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
}
MyCalendar.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
  showDemoLink: PropTypes.bool,
};
