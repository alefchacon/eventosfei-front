import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import PropTypes from "prop-types";

import { responseSchema } from "../validation/modelSchemas/responseSchema.js";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import { UpdateEvent } from "../api/EventService.js";
import { UpdateReservation } from "../api/ReservationService.js";

import InfoItem from "./InfoItem.jsx";

import { useSnackbar } from "../providers/SnackbarProvider.jsx";

import FormActions from "../forms/FormActions.jsx";

import { useNotices } from "../providers/NoticeProvider.jsx";

import { useAuth } from "../providers/AuthProvider.jsx";

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
import { idRol } from "../validation/enums/idRol.js";

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
  const { user } = useAuth();

  const submitResponse = async (values) => {
    try {
      values.id = notification.id;
      const response = await chooseSubmitType();
      showSnackbar(response.data.message);
      markAsRead(idAviso);
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

  const userRoleCanRespond = () => {
    if (type === "event") {
      return user.rol.id === idRol.COORDINADOR;
    }
    return user.rol.id === idRol.ADMINISTRADOR_ESPACIOS;
  };

  const [canRespond, setCanRespond] = useState(
    notification.idEstado === estado.NUEVO && userRoleCanRespond
  );

  useEffect(() => {
    const viewingAResponse = !canRespond && Boolean(idAviso);
    if (viewingAResponse) {
      markAsRead(idAviso);
    }
  }, []);

  const getStatus = (status = 2) => {
    return notification.wasAccepted ? estado.ACEPTADO : estado.RECHAZADO;
  };

  function ResponseSimple() {
    return (
      <>
        <InfoItem
          label="Estado"
          value={estado.fromValue(notification.idEstado)}
        ></InfoItem>
        <InfoItem label="Estado" value={notification.notes}></InfoItem>
        <FormActions
          onSubmit={isSubmitting}
          onClose={onClose}
          showPrimary={canRespond}
        ></FormActions>
      </>
    );
  }

  return (
    <>
      {!canRespond ? (
        <ResponseSimple />
      ) : (
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
                  value={
                    canRespond
                      ? values.idEstado
                      : getStatus(notification.status.id)
                  }
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
                  variant="outlined"
                  name="notes"
                  id="notes"
                  value={values.notes}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  multiline
                  rows={5}
                  inputProps={{ maxLength: 1000 }}
                />
              </FormControl>
            </Stack>

            <FormActions
              onSubmit={isSubmitting}
              onClose={onClose}
              showPrimary={canRespond}
            ></FormActions>
          </Stack>
        </form>
      )}
    </>
  );
}

NotificationResponse.defaultProps = {
  type: "event",
};
NotificationResponse.propTypes = {
  type: PropTypes.oneOf(["event", "reservation"]).isRequired,
};
