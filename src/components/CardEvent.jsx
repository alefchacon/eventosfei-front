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
import { useAuth } from "../providers/AuthProvider";

import { Link } from "react-router-dom";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

export default function CardEvent(
  { props, isProfile, elevated = true },
  { key }
) {
  const [isEvaluated, setIsEvaluated] = useState(false);

  const {
    id = 0,
    name = "nombre del evento",
    status = { name: "estado" },
    user = { id: 0, names: "asdf", paternalName: "asdf" },
    program = "Programa educativo",
    start = "31 de diciembre del 9999 - 23:59 hrs",
    createdAt = "asdf",
    space = { name: "espacio" },
  } = props;

  const handleClick = () => {
    console.info("You clicked the Chip.");
  };

  useEffect(() => {
    setIsEvaluated(status.id === 3);
  }, [status]);

  return (
    <Card
      sx={{
        minWidth: "30%",
        maxHeight: 250,
        bgcolor: "white",
      }}
      elevation={elevated ? 1 : 0}
    >
      <CardContent sx={{ padding: 2 }}>
        <Stack
          sx={{ display: "flex", justifyContent: "space-between" }}
          direction={"row"}
        >
          <Typography variant="h6" component="div">
            <Link to={`/eventos/${id}`}> {name} </Link>
          </Typography>
          <Chip label={status.name} onClick={handleClick} />
        </Stack>
        <br />
        {!isProfile && (
          <Typography color="text.primary">
            Organizador:
            <Link to="/calendario">
              {" "}
              {user.names} {user.paternalName}
            </Link>
          </Typography>
        )}
        <Typography color="text.primary">
          Fecha de notificación: {moment(createdAt).format("DD MMMM, YYYY")}
        </Typography>
        <Typography color="text.primary">
          Inicio: {moment(start).format("DD MMMM, YYYY")}
        </Typography>
      </CardContent>
    </Card>
  );
}
