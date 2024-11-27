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
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import CelebrationIcon from "@mui/icons-material/Celebration";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import WhereToVoteIcon from "@mui/icons-material/WhereToVote";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PeopleIcon from "@mui/icons-material/People";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { idRol } from "../validation/enums/idRol";

export default function Sidebar({
  user,
  mobileOpen = false,
  setMobileOpen,
  setIsClosing,
}) {
  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  function ClosingListItem({ children }) {
    return (
      <ListItem disablePadding onClick={handleDrawerClose}>
        {children}
      </ListItem>
    );
  }

  const nonAuthOptions = (
    <>
      <Link to="/" id="Calendario" className="sidebar-link">
        <ClosingListItem>
          <ListItemButton>
            <ListItemIcon>
              <CalendarMonthIcon className="sidebar-link" />
            </ListItemIcon>
            <ListItemText primary="Calendario" />
          </ListItemButton>
        </ClosingListItem>
      </Link>
      <Link to="/eventos" id="Eventos" className="sidebar-link">
        <ClosingListItem>
          <ListItemButton>
            <ListItemIcon>
              <CelebrationIcon className="sidebar-link" />
            </ListItemIcon>
            <ListItemText primary="Eventos" />
          </ListItemButton>
        </ClosingListItem>
      </Link>
    </>
  );

  const authOptions = (
    <>
      <Link to="/Notificaciones" id="Notificaciones" className="sidebar-link">
        <ClosingListItem>
          <ListItemButton>
            <ListItemIcon>
              <NotificationsActiveIcon className="sidebar-link" />
            </ListItemIcon>
            <ListItemText primary="Notificaciones" />
          </ListItemButton>
        </ClosingListItem>
      </Link>

      <Link to="/reservar" id="Espacios" className="sidebar-link">
        <ClosingListItem>
          <ListItemButton>
            <ListItemIcon>
              <WhereToVoteIcon className="sidebar-link" />
            </ListItemIcon>
            <ListItemText primary="Reservaciones" />
          </ListItemButton>
        </ClosingListItem>
      </Link>
    </>
  );

  const coordinatorOptions = (
    <>
      <Link to="/usuarios" id="Eventos" className="sidebar-link">
        <ClosingListItem>
          <ListItemButton>
            <ListItemIcon>
              <PeopleIcon className="sidebar-link" />
            </ListItemIcon>
            <ListItemText primary="Usuarios" />
          </ListItemButton>
        </ClosingListItem>
      </Link>
    </>
  );

  function SidebarContent() {
    return (
      <>
        <Stack bgcolor={"#18529d"} flex={"1 1 auto"} color={"white"}>
          <Toolbar />
          <Typography variant="h4" sx={{ padding: "10px" }} align="center">
            SAEFEI
          </Typography>
          <Divider />
          <List sx={{ height: "100%" }}>
            {nonAuthOptions}
            {user && authOptions}
            <Divider />
            {user?.rol?.id === idRol.COORDINADOR && coordinatorOptions}
          </List>
          <Divider />
        </Stack>
      </>
    );
  }

  const drawerWidth = 240;

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
        bgcolor: "red",
      }}
      aria-label="mailbox folders"
      display={"flex"}
      height={"100%"}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {<SidebarContent />}
      </Drawer>
      <Stack display={{ xs: "none", sm: "flex" }} flex="1 1 auto">
        {<SidebarContent />}
      </Stack>
    </Box>
  );
}
