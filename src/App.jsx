import { useState, useEffect } from "react";

import "./App.css";
import Evaluation from "./pages/Evaluation.jsx";
import EventList from "./pages/EventList.jsx";
import Notices from "./pages/Notices.jsx";
import ReservationList from "./pages/ReservationList.jsx";
import "./index.css";
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

import Calendar from "./components/Calendar.jsx";
import RouteGuard from "./pages/RouteGuard.jsx";

import LogInPage from "./pages/LogIn.jsx";
import ProfilePage from "./pages/Profile.jsx";
import Users from "./pages/Users.jsx";
import Reservation from "./forms/ReservationForm.jsx";
import { GetEvents, GetNotifications } from "./api/EventService.js";
import { LogOut } from "./api/UserService.js";

import { useNotices } from "./providers/NoticeProvider.jsx";

import Event from "./pages/Event.jsx";
import NewNotification from "./pages/NewNotification.jsx";
import TestForm from "./pages/TestForm.jsx";

import { useIsLoading } from "./providers/LoadingProvider.jsx";

const drawerWidth = 240;

function App(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [currentSection, setCurrentSection] = React.useState("Calendario");
  const [selectedFEIEvent, setSelectedFEIEvent] = React.useState();
  const [user, setUser] = React.useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const { noticeAmount, decreaseNotices } = useNotices();

  const { isLoading, setIsLoading } = useIsLoading();

  const handleLogIn = (authenticationOK) => {
    setIsAuthenticated(authenticationOK);
    setUser(JSON.parse(localStorage.getItem("user")));
    navigate("/calendario");
  };

  const handleLogOut = async () => {
    const response = await LogOut();
    handleMenuClose();
    if (response.status === 200) {
      navigate("/");
      setUser(null);
      setIsAuthenticated(false);
    }
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
    <Stack bgcolor={"#18529d"} flex={"1 1 auto"} color={"white"}>
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
                <ListItemText primary="Reservaciones" />
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
  const handleNavigateToProfile = () => {
    handleMenuClose();
    navigate("/usuario");
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
      <MenuItem divider onClick={handleNavigateToProfile}>
        Perfil
      </MenuItem>
      <MenuItem onClick={handleLogOut}>Cerrar sesión</MenuItem>
    </Menu>
  );
  return (
    <Box
      className="app"
      flexGrow={1}
      display={"flex"}
      height={"100%"}
      width={"100%"}
      border={"5px dotted red"}
      flexDirection={"row"}
    >
      <CssBaseline />

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
          container={container}
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
          {drawer}
        </Drawer>
        <Stack display={{ xs: "none", sm: "flex" }} flex="1 1 auto">
          {drawer}
        </Stack>
      </Box>

      <Stack direction={"column"} width={"100%"}>
        <AppBar
          position="relative"
          variant="outlined"
          elevation={0}
          sx={{
            width: "100%",
            bgcolor: "white",
            display: "flex",
            flexDirection: "row",
            color: "black",
            flex: "0 0 40px",
          }}
        >
          <Toolbar sx={{ width: "100%" }}>
            <Stack
              direction={"row"}
              display={"flex"}
              justifyContent={"space-between"}
              width={"100%"}
            >
              <Stack direction={"row"} alignItems={"center"}>
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
              </Stack>

              {isAuthenticated && user !== null && (
                <Stack direction={"row"} alignItems={"center"}>
                  <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                    onClick={() => navigate("/avisos")}
                  >
                    <Badge badgeContent={noticeAmount} color="error">
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
                    <Stack spacing={-1} alignItems={"start"}>
                      <Typography variant="caption">{user.names}</Typography>
                      <Typography variant="caption">{user.email}</Typography>
                    </Stack>
                  </IconButton>
                </Stack>
              )}
            </Stack>
          </Toolbar>
        </AppBar>
        <Stack className="content" padding={{ xs: 1, md: 5 }}>
          {isLoading && (
            <LinearProgress sx={{ height: "5px" }}></LinearProgress>
          )}
          <Routes>
            <Route path="/avisos" element={<Notices />}>
              {" "}
            </Route>
            <Route
              path="/eventos"
              element={
                <RouteGuard isAuthenticated={isAuthenticated}>
                  <EventList
                    notifications={false}
                    setSelectedFEIEvent={handleFEIEventSelection}
                    idUsuario={0}
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
                  <NewNotification></NewNotification>
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
            <Route
              path="/reservaciones"
              element={
                <RouteGuard isAuthenticated={isAuthenticated}>
                  <ReservationList></ReservationList>
                </RouteGuard>
              }
            >
              {" "}
            </Route>
            <Route
              path="/usuario"
              element={
                <RouteGuard isAuthenticated={isAuthenticated}>
                  <ProfilePage user={user}></ProfilePage>
                </RouteGuard>
              }
            >
              {" "}
            </Route>
            <Route
              path="/test"
              element={
                <RouteGuard isAuthenticated={isAuthenticated}>
                  <TestForm />
                </RouteGuard>
              }
            >
              {" "}
            </Route>
          </Routes>
        </Stack>
      </Stack>
      {renderMenu}
    </Box>
  );
}

export default App;
