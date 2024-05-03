import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import PropTypes from "prop-types";

import {
  Tabs,
  Tab,
  Typography,
  Box,
  Button,
  Stack,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

import Evaluation from "../pages/Evaluation";
import EventResponseMobile from "../components/EventResponseMobile.jsx";
import NotificationResponse from "../components/NotificationResponse.jsx";

import { GetEventById } from "../api/EventService.js";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
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

export default function Event({ setTitle }) {
  const [value, setValue] = useState(0);
  const [FEIEvent, setEvent] = useState(null);

  let { eventId } = useParams();

  useEffect(() => {
    const updateOrientation = () => {
      //setShowEventResponseMobile(window.innerWidth < 600);
    };

    window.addEventListener("resize", updateOrientation);

    updateOrientation();

    const fetchData = async () => {
      try {
        const response = await GetEventById(eventId);

        if (!response.status === 200) {
          throw new Error("Network response was not ok");
        }

        console.log(response.data.data);
        setEvent(response.data.data);
        setTitle(response.data.data.name);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => window.removeEventListener("resize", updateOrientation);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <NotificationResponse idEvento={eventId}></NotificationResponse>
      {FEIEvent && (
        <Box
          sx={{
            width: "100%",
            paddingTop: 3,
            height: "100%",
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              variant="scrollable"
              scrollButtons
            >
              <Tab label="Organizador" {...a11yProps(0)} />
              <Tab label="Evento" {...a11yProps(1)} />
              <Tab label="Logística" {...a11yProps(2)} />
              <Tab label="Espacios" {...a11yProps(3)} />
              <Tab label="Recursos" {...a11yProps(4)} />
              <Tab label="Difusión" {...a11yProps(5)} />
              <Tab label="Comentarios" {...a11yProps(6)} />
              <Tab label="Evaluación" {...a11yProps(7)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Stack spacing={4}>
              <Typography variant="h5">Organizador</Typography>
              <TextField
                name="names"
                value={`${FEIEvent.user.names} ${FEIEvent.user.paternalName} ${FEIEvent.user.maternalName}`}
                id="names"
                InputProps={{
                  readOnly: true,
                }}
                variant="filled"
                label="Nombre"
              ></TextField>
              <TextField
                name="job"
                id="job"
                value={`${FEIEvent.user.job}`}
                variant="filled"
                label="Puesto"
                InputProps={{
                  readOnly: true,
                }}
              ></TextField>
              <TextField
                name="email"
                id="email"
                value={`${FEIEvent.user.email}`}
                variant="filled"
                label="Email"
                InputProps={{
                  readOnly: true,
                }}
              ></TextField>
            </Stack>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            Item Two
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            Three
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            Four
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            Four
          </CustomTabPanel>
          <CustomTabPanel value={value} index={5}>
            Four
          </CustomTabPanel>
          <CustomTabPanel value={value} index={6}>
            Four
          </CustomTabPanel>
          <CustomTabPanel value={value} index={7}>
            <Evaluation
              idEvento={eventId}
              FEIEvent={FEIEvent}
              onSubmit={setEvent}
            ></Evaluation>
          </CustomTabPanel>
        </Box>
      )}
    </>
  );
}
