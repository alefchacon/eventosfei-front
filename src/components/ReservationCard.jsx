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
import { useDialog } from "../providers/DialogProvider.jsx";
import DialogTypes from "../providers/DialogTypes";

import { Link } from "react-router-dom";

function CustomCardActions({ isEvaluated, reservation }) {
  const { showDialog } = useDialog();
  return (
    <>
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

export default function ReservationCard({
  item,
  parentHandle,
  adminView = false,
}) {
  const [isEvaluated, setIsEvaluated] = useState(false);

  function handle() {
    console.log();
    //parentHandle(props)
  }
  const handleClick = () => {
    console.info("You clicked the Chip.");
  };

  return (
    <Card
      sx={{
        minWidth: "30%",
        maxHeight: 250,
      }}
      elevation={adminView ? 1 : 0}
    >
      <CardContent sx={{ mb: -3 }}>
        <Stack
          sx={{ padding: 0, display: "flex", justifyContent: "space-between" }}
          direction={"row"}
        >
          <Typography variant="h6" fontSize={"1.1em"} component="div">
            {item.space.name}{" "}
          </Typography>
          {adminView && <Chip onClick={handleClick} label={item.status.name} />}
        </Stack>
        <Typography variant="body1" fontSize={"0.9em"}>
          {moment(item.start).format("dddd, MMMM Do YYYY")}
        </Typography>
        <Typography fontSize={"0.9em"} gutterBottom>{`${moment(
          item.start
        ).format("HH:mm")} - ${moment(item.end).format("HH:mm")}`}</Typography>
        {adminView && <Organizer user={item.user} />}
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
        {adminView && (
          <CustomCardActions
            isEvaluated={isEvaluated}
            reservation={item}
          ></CustomCardActions>
        )}
      </CardActions>
    </Card>
  );
}
