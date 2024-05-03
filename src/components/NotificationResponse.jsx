import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";

import { responseSchema } from "../validation/modelSchemas/responseSchema";

import { RespondToEvent } from "../api/EventService.js";

import { GetStatus } from "../api/StatusService";
import { useSnackbar } from "../providers/SnackbarProvider.jsx";

import {
  Card,
  CardHeader,
  CardActionArea,
  Stack,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Toolbar,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import LoadingButton from "./LoadingButton";

import "../App.css";

export default function NotificationResponse({ idEvento }) {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [aceptado, setAceptado] = useState({});
  const [rechazado, setRechazado] = useState([]);

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetStatus();

        if (!response.status === 200) {
          throw new Error("Network response was not ok");
        }

        setAceptado(
          response.data.find((status) => status.nombre === "Aceptado")
        );
        setRechazado(
          response.data.find((status) => status.nombre === "Rechazado")
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleIdEstadoChange = (event, newIdEstado) => {
    if (newIdEstado !== null) {
      setFieldValue("idEstado", newIdEstado);
    }
  };

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
    setFieldError,
  } = useFormik({
    initialValues: {
      response: "",
    },
    validationSchema: responseSchema,
    onSubmit: submitResponse,
  });

  useEffect(() => {
    const updateOrientation = () => {
      setIsMobile(window.innerWidth > 600);
    };

    window.addEventListener("resize", updateOrientation);

    updateOrientation();

    return () => window.removeEventListener("resize", updateOrientation);
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ backgroundColor: "red" }}>
      <Stack
        height={expanded ? "50vh" : "50px"}
        minHeight={expanded ? "320px" : "30px"}
        maxHeight={isMobile ? "330px" : "40vh"}
        position={"fixed"}
        width={isMobile ? "50%" : "100%"}
        bottom={0}
        right={isMobile ? 20 : 0}
        border={"1px solid lightgray"}
        boxShadow={"12"}
        display={"flex"}
        borderRadius={2}
        bgcolor={"background.paper"}
        sx={{ zIndex: 20 }}
      >
        <CardActionArea onClick={handleExpandClick}>
          <CardHeader
            sx={{
              ".MuiCardHeader-title": {
                fontSize: "1.1rem",
              },
              height: "50px",
              backgroundColor: "var(--main-blue)",
              borderRadius: 1.2,
              color: "white",
            }}
            title="Responder notificación"
          />
        </CardActionArea>

        <form autoComplete="off" onSubmit={handleSubmit}>
          {aceptado.id !== null && rechazado.id !== null && (
            <ToggleButtonGroup
              name="idEstado"
              id="idEstado"
              color="primary"
              exclusive
              onChange={handleIdEstadoChange}
              aria-label="Platform"
              sx={{
                display: "flex",
              }}
              value={values.idEstado}
            >
              <ToggleButton value={4} sx={{ flexGrow: 1 }}>
                {rechazado.nombre}
              </ToggleButton>
              <ToggleButton value={2} sx={{ flexGrow: 1 }}>
                {aceptado.nombre}
              </ToggleButton>
            </ToggleButtonGroup>
          )}

          <TextField
            id="response"
            name="response"
            variant="filled"
            label="Respuesta"
            fullWidth
            multiline
            rows={5}
            onChange={handleChange}
            disabled={isSubmitting}
            value={values.response}
            onBlur={handleBlur}
            error={Boolean(errors.response) && touched.response}
            helperText={
              touched.response && Boolean(errors.response)
                ? errors.response
                : " "
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
        </form>
      </Stack>
    </Card>
  );
}
