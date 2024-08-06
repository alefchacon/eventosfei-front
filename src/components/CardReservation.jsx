import { useState, useEffect } from "react";
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
import DialogTypes from "../providers/DialogTypes";

import { Link } from "react-router-dom";

function CustomCardActions({ isEvaluated, reservation, adminView = true }) {
  return (
    <>
      {adminView ? (
        <Button size="medium" disabled={isEvaluated}>
          Responder
        </Button>
      ) : (
        <Button size="medium" disabled={isEvaluated}>
          Ver respuesta
        </Button>
      )}
    </>
  );
}
function Organizer({ user }) {
  return (
    <>
      <Typography variant="body1">{`${user.names} ${user.paternalName} ${user.maternalName}`}</Typography>
      <Typography variant="body2">{user.job}</Typography>
      <Typography variant="body2">{user.email}</Typography>
    </>
  );
}

export default function CardReservation({
  item = {
    space: {
      name: "space name",
    },
    status: {
      name: "space name",
    },
  },
  parentHandle,
  adminView = false,
  showActions = false,
  elevated = true,
}) {
  const getColor = () => {
    if (adminView) {
      return item.notifyAdministrator ? "success" : "default";
    }

    if (!item.notifyUser) {
      return "default";
    }

    if (item.status.id === 2) {
      return "success";
    } else {
      return "error";
    }
  };

  return (
    <Card
      sx={{
        minWidth: "30%",
        maxHeight: 250,
      }}
      elevation={0}
    >
      <CardContent sx={{ mb: -3, padding: 0 }}>
        <Stack
          sx={{
            padding: 0,
            display: "flex",
            justifyContent: "space-between",
          }}
          direction={"row"}
        >
          <Typography variant="h6" component="div" gutterBottom>
            {item.space.name}{" "}
          </Typography>
        </Stack>
        <Typography variant="body2" color={"text.secondary"}>
          {moment(item.start).format("dddd, MMMM Do YYYY")}
        </Typography>
        <Typography
          gutterBottom
          variant="body2"
          color={"text.secondary"}
        >{`${moment(item.start).format("HH:mm")} - ${moment(item.end).format(
          "HH:mm"
        )}`}</Typography>
        <Organizer user={item.user}></Organizer>
      </CardContent>
    </Card>
  );
}
