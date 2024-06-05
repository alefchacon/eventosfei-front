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
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useDialog } from "../providers/DialogProvider.jsx";
import DialogTypes from "../providers/DialogTypes";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { BorderAll } from "@mui/icons-material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { useFormik } from "formik";
import moment from "moment";

import SearchList from "../components/CustomSelect.jsx";
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

        //console.log(selectedStart.isBefore(moment(end)));
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
      setIsDisabled(disabled);
    }
  }, [selectedStart, selectedEnd]);

  useEffect(() => {
    console.log(radioRef);
  }, [isDisabled]);

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
          <Typography variant="caption" paddingRight={1}>
            Reservaciones:{" "}
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

export default function Reservation({ onCancel, onSubmit }) {
  const { showDialog } = useDialog();
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [date, setDate] = useState(moment());
  const [start, setStart] = useState(moment());
  const [end, setEnd] = useState(moment().add(1, "hours"));
  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState([]);
  const [space, setSpace] = useState();

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
      const reservation = {
        start: start,
        end: end,
        idEspacio: space.id,
        // CAMBIAR
        idUsuario: 1,
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
    <Stack width={{ lg: "50%", sm: "100%" }}>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <ListItemButton
            onClick={handleOpenDatePicker}
            disabled={isSubmitting}
          >
            <Stack spacing={0} width={"100%"}>
              <Typography variant="h6">Fecha</Typography>
              <DatePicker
                open={openDatePicker}
                value={date}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    InputProps: { color: "primary" },
                    fullWidth: true,
                  },
                }}
              />{" "}
            </Stack>
          </ListItemButton>
          <Stack direction={"row"}>
            <CustomTimePicker
              label="Inicio"
              defaultTime={start}
              onAccept={handleStartChange}
              disabled={isSubmitting}
            ></CustomTimePicker>
            <CustomTimePicker
              label="Fin"
              defaultTime={end}
              onAccept={handleEndChange}
              disabled={isSubmitting}
            ></CustomTimePicker>
          </Stack>
        </LocalizationProvider>
        <Typography variant="h6" paddingLeft={2}>
          Espacios de la FEI
        </Typography>
        <Typography variant="paragraph" paddingLeft={2}>
          Seleccione uno de los espacios para reservarlo. Si el espacio ya
          cuenta con reservaciones para la Fecha seleccionada, estas se
          mostrarán en color naranja. Si alguna reservación se traslapa con los
          horarios de Inicio y Fin seleccionados, se mostrará de color rojo.
        </Typography>
        <Stack
          width={"100%"}
          paddingTop={2}
          paddingLeft={2}
          paddingRight={2}
          overflow={"auto"}
          minHeight={"300px"}
          maxHeight={"300px"}
        >
          <FormControl fullWidth disabled={isSubmitting}>
            {isLoading ? (
              <LinearProgress></LinearProgress>
            ) : (
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
        <Stack
          direction={"row"}
          spacing={3}
          justifyContent={"end"}
          paddingTop={5}
        >
          <Button autoFocus onClick={onCancel} disabled={isSubmitting}>
            Cerrar
          </Button>
          <LoadingButton
            isReady={space !== null}
            label="Solicitar reservación"
            isLoading={isSubmitting}
          ></LoadingButton>
        </Stack>
      </form>
    </Stack>
  );
}