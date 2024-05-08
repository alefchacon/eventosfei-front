import { useState } from "react";

import "./App.css";
import Evaluation from "./pages/Evaluation.jsx";
import EventList from "./pages/EventList.jsx";
import "./index.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import * as React from "react";
import PropTypes from "prop-types";
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
import DraftsIcon from "@mui/icons-material/Drafts";
import Button from "@mui/material/Button";
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

import Calendar from "./components/Calendar.jsx";
import RouteGuard from "./pages/RouteGuard.jsx";

import LogInPage from "./pages/LogIn.jsx";
import Users from "./pages/Users.jsx";
import Reservation from "./forms/ReservationForm.jsx";

import Event from "./pages/Event.jsx";

const drawerWidth = 240;

function App(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [currentSection, setCurrentSection] = React.useState("Calendario");
  const [selectedFEIEvent, setSelectedFEIEvent] = React.useState();
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);

  const navigate = useNavigate();

  const handleLogIn = (authenticationOK) => {
    setIsAuthenticated(authenticationOK);
    navigate("/eventos");
  };

  const handleFEIEventSelection = (FEIEvent) => {
    setSelectedFEIEvent(FEIEvent);
    setCurrentSection(FEIEvent.name);
  };

  const handleSelection = (event) => {
    setCurrentSection(event.currentTarget.id);
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <Stack bgcolor={"#18529d"} flexGrow={1} color={"white"}>
      <Toolbar />
      <Typography variant="h4" sx={{ padding: "10px" }} align="center">
        SEAFEI
      </Typography>
      <Divider />

      {isAuthenticated && (
        <List>
          <Link
            to="/calendario"
            onClick={handleSelection}
            id="Calendario"
            className="sidebar-link"
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <CalendarMonthIcon className="sidebar-link" />
                </ListItemIcon>
                <ListItemText primary="Calendario" />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link
            to="/Notificaciones"
            onClick={handleSelection}
            id="Notificaciones"
            className="sidebar-link"
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <NotificationsActiveIcon className="sidebar-link" />
                </ListItemIcon>
                <ListItemText primary="Notificaciones" />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link
            to="/eventos"
            onClick={handleSelection}
            id="Eventos"
            className="sidebar-link"
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <FestivalIcon className="sidebar-link" />
                </ListItemIcon>
                <ListItemText primary="Eventos" />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link
            to="/usuarios"
            onClick={handleSelection}
            id="Eventos"
            className="sidebar-link"
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <PeopleIcon className="sidebar-link" />
                </ListItemIcon>
                <ListItemText primary="Usuarios" />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link
            to="/reservar"
            onClick={handleSelection}
            id="Espacios"
            className="sidebar-link"
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <PeopleIcon className="sidebar-link" />
                </ListItemIcon>
                <ListItemText primary="Reservar Espacio" />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
      )}

      <Divider />
      <List>
        {["Otro coso"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );

  // Remove this const when copying and pasting into your project.
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const menuId = "primary-search-account-menu";

  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );
  return (
    <Box
      flexGrow={1}
      display={"flex"}
      height={"100%"}
      width={"100%"}
      bgcolor={"--grey-bg"}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "#DFE7F1",
          display: "flex",
          flexDirection: "row",
          color: "black",
        }}
      >
        {isAuthenticated && (
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" noWrap component="div">
              {currentSection}
            </Typography>

            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Toolbar>
        )}
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <div className="content">
        <Routes>
          <Route
            path="/eventos"
            element={
              <RouteGuard isAuthenticated={isAuthenticated}>
                <EventList
                  notifications={false}
                  setSelectedFEIEvent={handleFEIEventSelection}
                />
              </RouteGuard>
            }
          >
            {" "}
          </Route>

          <Route
            path="/usuarios"
            element={
              <RouteGuard isAuthenticated={isAuthenticated}>
                <Users />
              </RouteGuard>
            }
          >
            {" "}
          </Route>
          <Route
            path="/calendario"
            element={
              <RouteGuard isAuthenticated={isAuthenticated}>
                <Calendar />
              </RouteGuard>
            }
          >
            {" "}
          </Route>

          <Route
            path="/"
            element={<LogInPage onLoginIn={handleLogIn}></LogInPage>}
          >
            {" "}
          </Route>
          <Route
            path="/Notificaciones"
            element={
              <RouteGuard isAuthenticated={isAuthenticated}>
                <EventList
                  notifications={true}
                  setSelectedFEIEvent={handleFEIEventSelection}
                />
              </RouteGuard>
            }
          >
            {" "}
          </Route>
          <Route path="/Evaluaciones" element={<Evaluation />}>
            {" "}
          </Route>
          <Route
            path="/eventos/:eventId"
            element={
              <RouteGuard isAuthenticated={isAuthenticated}>
                <Event
                  FEIEvent={selectedFEIEvent}
                  setTitle={setCurrentSection}
                />
              </RouteGuard>
            }
          >
            {" "}
          </Route>
          <Route
            path="/reservar"
            element={
              <RouteGuard isAuthenticated={isAuthenticated}>
                <Reservation></Reservation>
              </RouteGuard>
            }
          >
            {" "}
          </Route>
        </Routes>
      </div>

      {renderMenu}
    </Box>
  );
}

export default App;
