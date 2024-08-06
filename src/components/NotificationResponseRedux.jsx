import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import PropTypes from "prop-types";

import { responseSchema } from "../validation/modelSchemas/responseSchema.js";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import { UpdateEvent } from "../api/EventService.js";
import { UpdateReservation } from "../api/ReservationService.js";

import { useSnackbar } from "../providers/SnackbarProvider.jsx";

import FormActions from "../forms/FormActions.jsx";

import { useNotices } from "../providers/NoticeProvider.jsx";

import {
  Stack,
  Typography,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import LoadingButton from "./LoadingButton.jsx";

import "../App.css";

export default function NotificationResponse({
  children,
  idAviso,
  type,
  onClose = null,
  // Esta sería o un Evento, o una Reservación/Solicitud de espacio
  notification,
}) {
  const { showSnackbar } = useSnackbar();
  const { decreaseNotices } = useNotices();

  const submitResponse = async (values) => {
    console.log(notification);
    try {
      values.id = notification.id;
      const response = await chooseSubmitType();
      showSnackbar(response.data.message);
      decreaseNotices(idAviso);
    } catch (e) {
      showSnackbar(e.message);
    }
  };

  async function chooseSubmitType() {
    if (type === "event") {
      return await UpdateEvent(values, idAviso);
    }
    return await UpdateReservation(values, idAviso);
  }

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

  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      <Stack gap={0} direction={{ xs: "column-reverse", md: "column" }}>
        <Stack gap={3} padding={2} id="form-content">
          {children}
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
            id="notes"
            name="notes"
            variant="outlined"
            label="Observaciones"
            fullWidth
            multiline
            rows={5}
            onChange={handleChange}
            disabled={isSubmitting}
            value={values.response}
            onBlur={handleBlur}
            error={Boolean(errors.notes) && touched.notes}
            helperText={
              touched.notes && Boolean(errors.notes) ? errors.notes : " "
            }
          ></TextField>
        </Stack>

        <FormActions onSubmit={isSubmitting} onClose={onClose}></FormActions>
      </Stack>
    </form>
  );
}

NotificationResponse.defaultProps = {
  type: "event",
};
NotificationResponse.propTypes = {
  type: PropTypes.oneOf(["event", "reservation"]).isRequired,
};
