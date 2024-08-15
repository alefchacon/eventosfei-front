import { useState, useEffect, useRef } from "react";
import {
  ListItem,
  ListItemText,
  ListItemButton,
  TextField,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import { useIsLoading } from "../providers/LoadingProvider.jsx";
import Chip from "@mui/material/Chip";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { BorderAll } from "@mui/icons-material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { useFormik } from "formik";
import moment from "moment";

import CustomTimePicker from "../components/CustomTimePicker.jsx";
import LoadingButton from "../components/LoadingButton.jsx";

import {
  GetReservationsByMonth,
  AddReservation,
} from "../api/ReservationService.js";
import { useSnackbar } from "../providers/SnackbarProvider.jsx";

function SpaceRadio({
  radioProps,
  label,
  space,
  onClick,
  selectedStart,
  selectedEnd,
  date,
  isSubmitting = true,
}) {
  const [reservations, setReservations] = useState(space.reservations ?? []);
  const hasReservations = reservations.length > 0;
  const [isDisabled, setIsDisabled] = useState(false);
  const [checkable, setCheckable] = useState(true);
  const radioRef = useRef();

  useEffect(() => {
    const overlaps = (reservations) => {
      for (const reservation of reservations) {
        const start = moment(reservation.start);
        const end = moment(reservation.end);

        const innerOverlap =
          selectedStart.isSameOrBefore(start) && selectedEnd.isSameOrAfter(end);
        const earlyOverlap =
          selectedStart.isSameOrBefore(start) &&
          selectedEnd.isSameOrAfter(start) &&
          selectedEnd.isSameOrBefore(end);
        const lateOverlap =
          selectedStart.isSameOrAfter(start) &&
          selectedStart.isSameOrBefore(end) &&
          selectedEnd.isSameOrAfter(end);

        if (innerOverlap || earlyOverlap || lateOverlap) {
          return true;
        }
      }
      return false;
    };

    if (space.reservations !== undefined) {
      const disabled = overlaps(space.reservations);
      space["disabled"] = disabled;
      setIsDisabled(disabled);
    }
  }, [selectedStart, selectedEnd]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        width: "100%",
        paddingBottom: hasReservations ? 1 : 0,
      }}
    >
      <ListItemButton
        sx={{
          padding: "0",
          width: "100%",
        }}
        onClick={() => onClick(space)}
        disabled={isSubmitting || isDisabled}
      >
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Radio
            {...radioProps}
            disabled={isSubmitting || isDisabled}
            ref={radioRef}
          />

          <Stack>
            <Typography variant="paragraph1">{space.name}</Typography>
          </Stack>
        </Box>
      </ListItemButton>
      {hasReservations && (
        <Stack
          direction={"row"}
          display={"flex"}
          alignItems={"center"}
          flexWrap={"wrap"}
          marginLeft={5}
        >
          <Typography variant="caption" paddingRight={0}>
            Otras reservaciones:{" "}
          </Typography>
          {reservations.map((reservation) => (
            <Chip
              key={reservation.id}
              color={isDisabled ? "error" : "warning"}
              variant={isDisabled ? "filled" : "outlined"}
              sx={{
                maxHeight: "15px",
              }}
              label={`${moment(reservation.start).format("HH:mm")} - ${moment(
                reservation.end
              ).format("HH:mm")}`}
            ></Chip>
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default function ReservationForm({
  onCancel,
  onSubmit,
  idUsuario = 0,
  setTitle,
}) {
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [date, setDate] = useState(moment());
  const [start, setStart] = useState(moment());
  const [end, setEnd] = useState(moment().add(1, "hours"));
  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [space, setSpace] = useState();

  //const {isLoading, setIsLoading} = useIsLoading();

  setTitle("Reservar");

  const { showSnackbar } = useSnackbar();

  const handleOpenDatePicker = () => {
    setOpenDatePicker(!openDatePicker);
  };
  const handleDateChange = (newValue) => {
    const newDate = moment(newValue.format("YYYY-MM-DDTHH:mm"));
    setDate(newDate);

    setStart((prevStart) => {
      return newValue.clone().set({
        hour: prevStart.hour(),
        minute: prevStart.minute(),
        second: prevStart.second(),
      });
    });
    setEnd((prevEnd) => {
      return newValue.clone().set({
        hour: prevEnd.hour(),
        minute: prevEnd.minute(),
        second: prevEnd.second(),
      });
    });
  };

  const handleStartChange = (newValue) => {
    const newStart = moment(newValue.format("YYYY-MM-DDTHH:mm"));
    setStart(newStart);
  };

  const handleEndChange = (newValue) => {
    const newEnd = moment(newValue.format("YYYY-MM-DDTHH:mm"));
    setEnd(newEnd);
  };

  useEffect(() => {
    const fetchData = async (start) => {
      const response = await GetReservationsByMonth(start);
      const responseReservations = response.data.data;

      const availableSpace = await getFirstAvailableSpace(responseReservations);
      setSpace(availableSpace);
      setReservations(responseReservations);
      setIsLoading(false);
    };

    const getFirstAvailableSpace = (spaces) => {
      return spaces[0];
    };

    setIsLoading(true);
    fetchData(date);
  }, [date]);

  const submitReservation = async (values, actions) => {
    try {
      if (space.disabled) {
        throw new Error(
          "El espacio seleccionado ya fue reservado en el horario especificado."
        );
      }

      const reservation = {
        start: start.date(date.format("YYYY-MM-DD")),
        end: end.date(date.format("YYYY-MM-DD")),
        idEspacio: space.id,
        // CAMBIAR
        idUsuario: idUsuario,
      };

      const response = await AddReservation(reservation);
      showSnackbar(response.data.message);
    } catch (error) {
      showSnackbar(error.message);
    }
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues: {},
    onSubmit: submitReservation,
  });

  return (
    <Stack
      width={{ md: "100%", xs: "100%" }}
      flex={1}
      overflow={"hidden"}
      display={"flex"}
      flexDirection={"column"}
    >
      <form
        className="reservation-form"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <Stack flex={"0 1 auto"} gap={3}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <Stack spacing={0} width={"100%"}>
              <Typography variant="h6" color={"text.secondary"}>
                Fecha
              </Typography>
              <DatePicker value={date} onChange={handleDateChange} />
            </Stack>
            <Stack direction={"row"} gap={5}>
              <Stack
                spacing={1}
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
              >
                <Typography variant="h6" color={"text.secondary"}>
                  {"Inicio"}
                </Typography>

                <TimePicker
                  value={start}
                  onAccept={handleStartChange}
                  ampm={false}
                  slotProps={{
                    textField: {
                      InputProps: { color: "primary" },
                      fullWidth: true,
                    },
                  }}
                />
              </Stack>
              <Stack
                spacing={1}
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
              >
                <Typography variant="h6" color={"text.secondary"}>
                  {"Fin"}
                </Typography>

                <TimePicker
                  minTime={start}
                  value={end}
                  onAccept={handleEndChange}
                  ampm={false}
                  slotProps={{
                    textField: {
                      InputProps: { color: "primary" },
                      fullWidth: true,
                    },
                  }}
                />
              </Stack>
            </Stack>
          </LocalizationProvider>
        </Stack>
        <Typography
          variant="h6"
          paddingTop={3}
          paddingLeft={0}
          color={"text.secondary"}
        >
          Seleccione el espacio que desea reservar:
        </Typography>
        <Stack
          flex={"1 1 auto"}
          overflow={"auto"}
          border={"1px solid lightgray"}
          borderRadius={1}
          padding={2}
        >
          <FormControl fullWidth disabled={isSubmitting}>
            {!isLoading && (
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                value={space.id}
                name="radio-buttons-group"
                sx={{
                  width: "100%",
                }}
              >
                {reservations.map((option) => (
                  <FormControlLabel
                    key={option.id}
                    sx={{
                      width: "100%",
                    }}
                    control={
                      <SpaceRadio
                        radioProps={{ value: option.id }}
                        space={option}
                        onClick={(e) => setSpace(e)}
                        selectedStart={start}
                        selectedEnd={end}
                        date={date}
                        isSubmitting={isSubmitting}
                      ></SpaceRadio>
                    }
                    itemProp=""
                  />
                ))}
              </RadioGroup>
            )}
          </FormControl>
        </Stack>
        <Stack flex={"0 1 auto"} padding={2}>
          <Stack justifyContent={{ xs: "end", md: "start" }} direction={"row"}>
            <LoadingButton
              isReady={space !== null}
              label="Reservar espacio"
              isLoading={isSubmitting}
            ></LoadingButton>
          </Stack>
        </Stack>
      </form>
    </Stack>
  );
}
