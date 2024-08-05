import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import PropTypes from "prop-types";

import { responseSchema } from "../validation/modelSchemas/responseSchema.js";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import { RespondToEvent } from "../api/EventService.js";

import { useSnackbar } from "../providers/SnackbarProvider.jsx";

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
  idEvento,
  // Esta sería o un Evento, o una Reservación/Solicitud de espacio
  notification = { id: 0 },
  type = "event",
}) {
  const { showSnackbar } = useSnackbar();

  const submitResponse = async (values) => {
    try {
      const response = await RespondToEvent(values, idEvento);
      showSnackbar(response.data.message);
    } catch (e) {
      showSnackbar("Algo salió mal");
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
      response: "",
    },
    validationSchema: responseSchema,
    onSubmit: submitResponse,
  });

  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      <Stack gap={3}>
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
          variant="outlined"
          label="Observaciones"
          fullWidth
          multiline
          rows={5}
          onChange={handleChange}
          disabled={isSubmitting}
          value={values.response}
          onBlur={handleBlur}
          error={Boolean(errors.response) && touched.response}
          helperText={
            touched.response && Boolean(errors.response) ? errors.response : " "
          }
        ></TextField>

        <Stack direction={"row"} paddingRight={2} justifyContent={"end"}>
          <div></div>
          <LoadingButton
            label="Responder"
            isLoading={isSubmitting}
            endIcon={<SendIcon />}
          ></LoadingButton>
        </Stack>
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
