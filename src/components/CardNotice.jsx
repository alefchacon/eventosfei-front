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

import { estado } from "../validation/enums/estado.js";

import Divider from "@mui/material/Divider";

const bull = (
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

function CustomCardActions({ isEvaluated, reservation, adminView = true }) {
  const { showDialog } = useDialog();
  return (
    <>
      {adminView ? (
        <Button
          size="medium"
          onClick={() =>
            showDialog(
              "Responder reservación",
              DialogTypes.reservationResponse,
              console.log(""),
              reservation
            )
          }
          disabled={isEvaluated}
        >
          Responder
        </Button>
      ) : (
        <Button
          size="medium"
          onClick={() =>
            showDialog(
              "Responder reservación",
              DialogTypes.reservationResponse,
              console.log(""),
              reservation
            )
          }
          disabled={isEvaluated}
        >
          Ver respuesta
        </Button>
      )}
    </>
  );
}

export default function CardNotice({
  item = {},
  isStaff = false,
  event = true,
  children,
  onClick,
}) {
  const eventMessages = {
    1: "Nueva notificación",
    2: "Su evento ha sido programado",
    3: "Evento evaluado",
    4: "Su evento fue rechazado",
  };
  const reservationMessages = {
    1: "Nueva reservación",
    2: "Su reservación fue aceptada",
    3: "Evento evaluado",
    4: "Su reservación fue rechazada",
  };

  function getNoticeMessage(event = false) {
    if (!event) {
      return reservationMessages[item.reservation.idEstado];
    }
    return eventMessages[item.event.idEstado];
  }

  const newNoticeBullet = () => {
    if (isStaff) {
      return item.notifyStaff !== 0 ? bull : "";
    } else {
      return item.notifyUser !== 0 ? bull : "";
    }
  };

  return (
    <Card
      sx={{
        minWidth: "30%",
        maxHeight: 250,
      }}
      elevation={1}
    >
      <CardActionArea onClick={() => onClick(item)}>
        <CardContent sx={{ mb: 0, padding: "1em 1em 0 1em" }}>
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
              {newNoticeBullet()} {getNoticeMessage(event)}
            </Typography>

            {children}
          </Stack>
        </CardContent>
      </CardActionArea>
      <Divider></Divider>
    </Card>
  );
}
