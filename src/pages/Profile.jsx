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

import { GetUserEvents } from "../api/EventService";
import { GetProfile } from "../api/UserService";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Stack
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      height={"100%"}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </Stack>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Profile({ user }) {
  const [value, setValue] = useState(0);
  const [idUsuario, setIdUsuario] = useState(1);

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
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="notificaciones" {...a11yProps(0)} />
            <Tab label="eventos" {...a11yProps(1)} />
            <Tab label="reservaciones" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Eventos
            notifications={false}
            handleGet={GetUserEvents}
            idUsuario={1}
          ></Eventos>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          Item Two
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Item Three
        </CustomTabPanel>
      </Box>
    </Stack>
  );
}
