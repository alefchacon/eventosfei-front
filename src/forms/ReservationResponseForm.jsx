import { useState, useEffect } from "react";
import { Typography, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";

import { useFormik } from "formik";
import moment from "moment";

import LoadingButton from "../components/LoadingButton.jsx";
import ToggleButton from "@mui/material/ToggleButton";
import { responseSchema } from "../validation/modelSchemas/responseSchema.js";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import FormActions from "./FormActions.jsx";

import {
  UpdateReservation,
  AddReservation,
} from "../api/ReservationService.js";
import { useSnackbar } from "../providers/SnackbarProvider.jsx";
import { useNotices } from "../providers/NoticeProvider.jsx";
export default function ReservationResponse({
  onCancel,
  onSubmit,
  reservation = {
    space: {
      name: "space name",
      start: moment().format("dddd, MMMM Do YYYY"),
    },
  },
}) {
  const { showSnackbar } = useSnackbar();
  const { noticeAmount, removeNotice } = useNotices();

  const handleStatusIdChange = (newStatusId) => {
    if (newStatusId !== null) {
      setFieldValue("statusId", newStatusId);
    }
  };

  const submitResponse = async (values, actions) => {
    try {
      const request = {
        id: reservation.id,
        response: values.response,
        idEstado: values.statusId,
      };

      const response = await UpdateReservation(request);
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
    setFieldValue,
    setFieldTouched,
  } = useFormik({
    initialValues: {
      idEstado: "",
      notes: "",
    },
    validationSchema: responseSchema,
    onSubmit: submitResponse,
  });

  const reservationStatus = [
    { id: 2, name: "Aceptar" },
    { id: 4, name: "Rechazar" },
  ];

  return (
    <>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Stack
          direction={{ xs: "column-reverse", md: "column" }}
          height={"100%"}
          padding={0}
        >
          <div>
            {reservation !== null && (
              <>
                <Typography variant="h6">{reservation.space.name}</Typography>
                <Typography variant="h7">
                  {moment(reservation.start).format("dddd, MMMM Do YYYY")}
                </Typography>
                <Typography gutterBottom>{`${moment(reservation.start).format(
                  "HH:mm"
                )} - ${moment(reservation.end).format("HH:mm")}`}</Typography>
                <Typography variant="body1">{`${reservation.user.names} ${reservation.user.paternalName} ${reservation.user.maternalName}`}</Typography>
                <Typography variant="body2">{reservation.user.job}</Typography>
                <Typography variant="body2">
                  {reservation.user.email}
                </Typography>
              </>
            )}

            <Stack direction={"column"} spacing={2} paddingTop={2}>
              <Divider></Divider>

              <FormControl error={Boolean(errors.idEstado) && touched.idEstado}>
                <FormLabel>Estado de la notificación</FormLabel>
                <ToggleButtonGroup
                  id="idEstado"
                  onChange={(e, newIdEstado) =>
                    setFieldValue("idEstado", newIdEstado)
                  }
                  onBlur={() => setFieldTouched("idEstado", true)}
                  name="idEstado"
                  color="primary"
                  exclusive
                  aria-label="Platform"
                  sx={{
                    display: "flex",
                  }}
                  value={values.idEstado}
                >
                  <ToggleButton value={4} sx={{ flexGrow: 1 }}>
                    {"Rechazada"}
                  </ToggleButton>
                  <ToggleButton value={2} sx={{ flexGrow: 1 }}>
                    {"Aceptada"}
                  </ToggleButton>
                </ToggleButtonGroup>
                <Typography variant="caption" color={"error"} paddingLeft={2}>
                  {touched.idEstado && errors.idEstado}
                </Typography>
              </FormControl>

              <TextField
                id="response"
                name="response"
                label="Observaciones"
                about="asdf"
                fullWidth
                multiline
                rows={5}
                disabled={isSubmitting}
                value={values.response}
                onChange={handleChange}
                onBlur={handleBlur}
                sx={{
                  paddingBottom: 2,
                }}
              ></TextField>
            </Stack>
          </div>
        </Stack>
      </form>
    </>
  );
}
