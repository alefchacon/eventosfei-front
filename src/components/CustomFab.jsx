import { Link, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { Stack, Button, Typography, Fab, IconButton } from "@mui/material";

import { showIfSmall, showIfBig } from "../validation/enums/breakpoints";

export default function CustomFab() {
  return (
    <>
      <Link className="a" to={"/notificaciones"}>
        <Button
          variant="contained"
          disableElevation
          fullWidth
          sx={{
            display: showIfBig,
          }}
        >
          Nueva notificación
        </Button>
      </Link>
      <Stack
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          padding: 4,
          margin: "20px 10px",
          display: showIfSmall,
        }}
      >
        <Fab color="primary" variant="extended" aria-label="add">
          <Link className="a" to={"/notificaciones"}>
            <AddIcon /> Notificar evento
          </Link>
        </Fab>
      </Stack>
    </>
  );
}
