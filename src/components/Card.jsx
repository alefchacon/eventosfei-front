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

import { Link } from "react-router-dom";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

export default function EventCard({ props, parentHandle, isProfile }, { key }) {
  const [isEvaluated, setIsEvaluated] = useState(false);

  const {
    id = 0,
    name = "nombre del evento",
    status = { name: "estado" },
    organizer = "Nombre del organizador",
    program = "Programa educativo",
    start = "31 de diciembre del 9999 - 23:59 hrs",
    createdAt = "asdf",
    space = { name: "espacio" },
  } = props;

  function handle() {
    console.log(id);
    //parentHandle(props)
  }
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
    >
      <CardContent sx={{ mb: -3 }}>
        <Stack
          sx={{ padding: 0, display: "flex", justifyContent: "space-between" }}
          direction={"row"}
        >
          <Typography variant="h6" component="div">
            <Link to={`/eventos/${id}`} onClick={handle}>
              {" "}
              {name}{" "}
            </Link>
          </Typography>
          <Chip label={status.name} onClick={handleClick} />
        </Stack>
        {!isProfile && (
          <Typography color="text.primary">
            Organizador:
            <Link to="/calendario"> {organizer}</Link>
          </Typography>
        )}
        <Typography color="text.primary">
          Fecha de notificación: {moment(createdAt).format("DD MMMM, YYYY")}
        </Typography>
        <Typography color="text.primary">
          {moment(start).format("DD MMMM, YYYY")}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button size="medium" onClick={handle} disabled={isEvaluated}>
          Editar
        </Button>
        <Button size="medium" color="error" disabled={isEvaluated}>
          Cancelar
        </Button>
      </CardActions>
    </Card>
  );
}
