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

export default function CardNotice({ item = {}, event = true, children }) {
  console.log(item);

  return (
    <Card
      sx={{
        minWidth: "30%",
        maxHeight: 250,
      }}
      elevation={1}
    >
      <CardActionArea>
        <CardContent sx={{ mb: 0 }}>
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
              {item.notifyUser !== 0 || item.notifyStaff !== 0 ? bull : ""}
              {event
                ? "Notificación de evento actualizada"
                : "Reservación de espacio actualizada"}
            </Typography>
            <Divider></Divider>

            {children}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
