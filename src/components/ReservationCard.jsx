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

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

export default function ReservationCard({ reservation }) {
  const [isEvaluated, setIsEvaluated] = useState(false);

  const { showDialog } = useDialog();

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
        bgcolor: isEvaluated ? "#f4f4f4" : "white",
      }}
    >
      <CardContent sx={{ mb: -3 }}>
        <Stack
          sx={{ padding: 0, display: "flex", justifyContent: "space-between" }}
          direction={"row"}
        >
          <Typography variant="h6" component="div">
            <Link to={`/eventos/`} onClick={handle}>
              {" "}
              {reservation.space.name}{" "}
            </Link>
          </Typography>
          <Chip onClick={handleClick} />
        </Stack>
        <Typography variant="h7">
          {moment(reservation.start).format("dddd, MMMM Do YYYY")}
        </Typography>
        <Typography gutterBottom>{`${moment(reservation.start).format(
          "HH:mm"
        )} - ${moment(reservation.end).format("HH:mm")}`}</Typography>
        <Typography variant="body1">{`${reservation.user.names} ${reservation.user.paternalName} ${reservation.user.maternalName}`}</Typography>
        <Typography variant="body2">{reservation.user.job}</Typography>
        <Typography variant="body2">{reservation.user.email}</Typography>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          size="medium"
          onClick={() =>
            showDialog("Responder reservación", DialogTypes.reservationResponse)
          }
          disabled={isEvaluated}
        >
          Editar
        </Button>
        <Button size="medium" color="error" disabled={isEvaluated}>
          Cancelar
        </Button>
      </CardActions>
    </Card>
  );
}
