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

import "../App.css";
import { estado } from "../validation/enums/estado.js";
import { stringConstants } from "../validation/enums/stringConstants.js";

export default function NotificationResponse({
  children,
  idAviso,
  type,
  onClose = null,
  // Esta sería o un Evento, o una Reservación/Solicitud de espacio
  notification,
}) {
  const { showSnackbar } = useSnackbar();
  const { decreaseNotices, markAsRead } = useNotices();

  const submitResponse = async (values) => {
    try {
      values.id = notification.id;
      const response = await chooseSubmitType();
      showSnackbar(response.data.message);
      markAsRead(idAviso);
      //decreaseNotices(idAviso);
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

  const [canRespond, setCanRespond] = useState(
    notification.idEstado === estado.NUEVO
  );

  useEffect(() => {
    function markAsReadWhenOpened() {
      if (!canRespond) {
        markAsRead(idAviso);
      }
    }

    markAsReadWhenOpened();
  }, []);

  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      <Stack gap={0} direction={{ xs: "column-reverse", md: "column" }}>
        <Stack gap={3} padding={0} id="form-content">
          {children}
          <FormControl error={Boolean(errors.idEstado) && touched.idEstado}>
            <FormLabel>Estado de la notificación</FormLabel>
            <ToggleButtonGroup
              disabled={!canRespond}
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
              value={canRespond ? values.idEstado : notification.status.id}
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

          <FormControl>
            <FormLabel>Observaciones</FormLabel>
            <TextField
              disabled={!canRespond}
              id="notes"
              name="notes"
              variant="outlined"
              fullWidth
              multiline
              rows={5}
              onChange={handleChange}
              value={
                notification.notes &&
                notification.notes !== stringConstants.EMPTY_COLUM
                  ? notification.notes
                  : values.notes
              }
              onBlur={handleBlur}
              error={Boolean(errors.notes) && touched.notes}
              helperText={
                touched.notes && Boolean(errors.notes) ? errors.notes : " "
              }
              sx={{
                color: "red !important",
              }}
            ></TextField>
          </FormControl>
        </Stack>

        <FormActions
          onSubmit={isSubmitting}
          onClose={onClose}
          showPrimary={canRespond}
        ></FormActions>
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