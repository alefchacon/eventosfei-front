import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import ResponsiveDialog from "./ResponsiveDialog.jsx";

import { estado } from "../validation/enums/estado.js";

import { useAuth } from "../providers/AuthProvider.jsx";

import { idRol } from "../validation/enums/idRol.js";

import NotificationResponse from "./NotificationResponseRedux.jsx";

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
            {!item.read ? "Responder" : "Ver respuesta"}
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
