import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Eventos from "./EventList";

import CustomTabs from "../components/CustomTabs";

import { GetUserEvents } from "../api/EventService";
import { GetProfile } from "../api/UserService";

export default function Profile({ user, setTitle }) {
  const [value, setValue] = useState(0);
  const [idUsuario, setIdUsuario] = useState(1);

  setTitle("Usuario");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Stack display={"flex"}>
      <Stack padding={3} paddingBottom={0} justifyContent={"start"}>
        <Stack direction={"row"} alignItems={"center"} spacing={2}>
          <Typography variant="h6">
            {user.names} {user.paternalName} {user.maternalName}{" "}
            <Chip label={user.rol.name}></Chip>
          </Typography>
        </Stack>
        <Typography>{user.job}</Typography>
        <Typography variant="button">{user.email}</Typography>
      </Stack>
      <CustomTabs>
        <Stack label="Eventos">
          <Eventos
            notifications={false}
            handleGet={GetUserEvents}
            idUsuario={user.id}
          ></Eventos>
        </Stack>
        <Stack label="Reservaciones">asdf</Stack>
      </CustomTabs>
    </Stack>
  );
}
