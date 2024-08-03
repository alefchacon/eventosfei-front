import { useState, useEffect } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import FestivalIcon from "@mui/icons-material/Festival";
import PeopleIcon from "@mui/icons-material/People";
import LinearProgress from "@mui/material/LinearProgress";

import { idRol } from "../validation/enums/idRol";

const nonAuthOptions = (
  <>
    <Link to="/calendario" id="Calendario" className="sidebar-link">
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <CalendarMonthIcon className="sidebar-link" />
          </ListItemIcon>
          <ListItemText primary="Calendario" />
        </ListItemButton>
      </ListItem>
    </Link>
    <Link to="/eventos" id="Eventos" className="sidebar-link">
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <FestivalIcon className="sidebar-link" />
          </ListItemIcon>
          <ListItemText primary="Eventos" />
        </ListItemButton>
      </ListItem>
    </Link>
  </>
);

const authOptions = (
  <>
    <Link to="/Notificaciones" id="Notificaciones" className="sidebar-link">
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <NotificationsActiveIcon className="sidebar-link" />
          </ListItemIcon>
          <ListItemText primary="Notificaciones" />
        </ListItemButton>
      </ListItem>
    </Link>

    <Link to="/reservar" id="Espacios" className="sidebar-link">
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <PeopleIcon className="sidebar-link" />
          </ListItemIcon>
          <ListItemText primary="Reservaciones" />
        </ListItemButton>
      </ListItem>
    </Link>
  </>
);

const coordinatorOptions = (
  <>
    <Link to="/usuarios" id="Eventos" className="sidebar-link">
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <PeopleIcon className="sidebar-link" />
          </ListItemIcon>
          <ListItemText primary="Usuarios" />
        </ListItemButton>
      </ListItem>
    </Link>
  </>
);

export default function Sidebar({
  user = {
    rol: {
      id: 0,
    },
  },
}) {
  return (
    <Stack bgcolor={"#18529d"} flex={"1 1 auto"} color={"white"}>
      <Toolbar />
      <Typography variant="h4" sx={{ padding: "10px" }} align="center">
        SAEFEI
      </Typography>
      <Divider />
      <List sx={{ height: "100%" }}>
        {nonAuthOptions}
        {user !== null && authOptions}
        <Divider />
        {user !== null
          ? user.rol.id === idRol.COORDINADOR && coordinatorOptions
          : false}
      </List>
      <Divider />
    </Stack>
  );
}
