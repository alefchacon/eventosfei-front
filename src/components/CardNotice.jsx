import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { CardActionArea } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import moment from "moment";
import { useDialog } from "../providers/DialogProvider.jsx";
import DialogTypes from "../providers/DialogTypes";
import CircleIcon from "@mui/icons-material/Circle";

import ReservationResponse from "../forms/ReservationResponseForm.jsx";

import ResponsiveDialog from "./ResponsiveDialog.jsx";

import { estado } from "../validation/enums/estado.js";

import { useAuth } from "../providers/AuthProvider.jsx";

import Divider from "@mui/material/Divider";
import { idRol } from "../validation/enums/idRol.js";

import NotificationResponse from "./NotificationResponseRedux.jsx";
import FormActions from "../forms/FormActions.jsx";

import { useNavigate } from "react-router-dom";

const dot = (
  <Box
    component="span"
    sx={{
      display: "inline-block",
      mx: "10px",
      transform: "scale(3)",
      color: "#d4352d",
    }}
    color={"error"}
  >
    •
  </Box>
);

export default function CardNotice({
  item = {},
  type = "event",
  isStaff = false,
  event = true,
  children,
  onClick,
}) {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const reservationOrganizerMessageTemplate =
    "Su solicitud de reservación fue ";
  const eventOrganizerMessageTemplate = "Su evento fue ";

  const getEventRelatedMessage = (idEstado) => {
    switch (idEstado) {
      case 2:
        return eventOrganizerMessageTemplate.concat("aceptado");
      case 3:
        return "Evento evaluado";
      case 4:
        return eventOrganizerMessageTemplate.concat("rechazado");
      default:
        return "Nueva notificación";
    }
  };
  const getReservationRelatedMessage = (idEstado) => {
    switch (idEstado) {
      case 2:
        return reservationOrganizerMessageTemplate.concat("aceptada");
      case 4:
        return reservationOrganizerMessageTemplate.concat("rechazada");
      default:
        return "Nueva solicitud de reservación";
    }
  };

  function getNoticeMessage(event = false) {
    if (item.idEvento) {
      return getEventRelatedMessage(item.idEstado);
    }
    return getReservationRelatedMessage(item.idEstado);
  }

  const getRedDot = () => {
    const isStaff = user.rol.id > idRol.ORGANIZADOR;
    if (isStaff) {
      return !item.read && dot;
    } else {
      return !item.read && dot;
    }
  };

  const handlePrimaryClick = () => {
    if (type === "event") {
      navigate(`/eventos/${item.event.id}/${item.id}`);
    }
    if (type === "reservation") {
      setShowModal(true);
    }
  };

  const toggleModal = (e) => {
    setShowModal(!showModal);
  };

  return (
    <>
      <ResponsiveDialog
        showPrimary={false}
        showSecondary={false}
        onClose={toggleModal}
        responsive
        open={showModal}
        isForm={true}
      >
        <Stack padding={0}>
          <NotificationResponse
            idAviso={item.id}
            onClose={toggleModal}
            type="reservation"
            notification={item.reservation}
          >
            {children}
          </NotificationResponse>
        </Stack>
      </ResponsiveDialog>

      <Card
        sx={{
          minWidth: "30%",
        }}
        elevation={1}
      >
        <CardContent>
          <Stack
            padding={0}
            display={"flex"}
            justifyContent={"space-between"}
            direction={"column"}
          >
            <Typography
              variant="subtitle1"
              color={"text.secondary"}
              gutterBottom
              alignItems={"center"}
              alignContent={"center"}
              justifyItems={"center"}
            >
              {!item.read && dot} {item.type.name}
            </Typography>

            {children}
          </Stack>
        </CardContent>

        <CardActions sx={{ justifyContent: "end" }}>
          <Button size="small" onClick={handlePrimaryClick}>
            {item.idEstado === estado.NUEVO ? "Responder" : "Ver respuesta"}
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
