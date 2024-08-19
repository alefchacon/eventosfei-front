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

export default function CardUser({ user, onUpdate }) {
  const [isEvaluated, setIsEvaluated] = useState(false);

  const { showDialog } = useDialog();

  function handle() {
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
          sx={{ padding: 0, display: "flex", justifyContent: "start" }}
          direction={"row"}
        >
          <Typography variant="button" component="div">
            <Link to={`/eventos/`} onClick={handle}>
              {" "}
              {user.names +
                " " +
                user.paternalName +
                " " +
                user.maternalName}{" "}
            </Link>
          </Typography>
        </Stack>
        <Typography variant="caption" onClick={handleClick}>
          {user.rol.name}
        </Typography>
        <Typography>{user.job}</Typography>
        <Typography>{user.email}</Typography>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          size="medium"
          onClick={() =>
            showDialog(
              "Editar usuario",
              DialogTypes.userForm,
              () => onUpdate,
              user
            )
          }
          disabled={isEvaluated}
        >
          Editar
        </Button>
        <Button
          size="medium"
          color="error"
          onClick={() => console.log(user)}
          disabled={isEvaluated}
        >
          Eliminar
        </Button>
      </CardActions>
    </Card>
  );
}
