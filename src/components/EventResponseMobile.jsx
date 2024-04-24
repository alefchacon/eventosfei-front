import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

const drawerBleeding = 56;

const Root = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor:
    theme.palette.mode === "light"
      ? grey[100]
      : theme.palette.background.default,
}));

const StyledBox = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
  border: "1px solid lightgray",
}));

const Puller = styled("div")(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

function LocalToggleButton() {
  const [alignment, setAlignment] = useState("web");

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
      sx={{
        display: "flex",
      }}
    >
      <ToggleButton value="Rechazar" sx={{ flexGrow: 1 }}>
        Rechazar
      </ToggleButton>
      <ToggleButton value="Aceptar" sx={{ flexGrow: 1 }}>
        Aceptar
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

function SwipeableEdgeDrawer(props) {
  const { window } = props;
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    document.getElementById("drawer").style.pointerEvents = "auto";
    setOpen(newOpen);
  };

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(50% - ${drawerBleeding}px)`,
            width: "50%",
            overflow: "visible",
          },
        }}
      />

      <SwipeableDrawer
        id="drawer"
        anchor="bottom"
        open={open}
        onClose={() => {}}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        style={{ pointerEvents: "none" }}
        ModalProps={{
          keepMounted: true,
          BackdropProps: {
            invisible: true, // Makes backdrop invisible and allows clicking through it
          },
        }}
      >
        <StyledBox
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <Typography sx={{ p: 2, color: "text.secondary" }}>
            Responder notificación
          </Typography>
        </StyledBox>
        <StyledBox
          sx={{
            px: 3,
            pb: 2,
            height: "100%",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <LocalToggleButton></LocalToggleButton>
          <TextField
            variant="filled"
            label="Respuesta"
            multiline
            rows={5}
            sx={{
              flexGrow: "1",
            }}
          />
          <Button variant="contained">Responder notificación</Button>
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}

export default SwipeableEdgeDrawer;
