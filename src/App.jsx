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
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";

import Calendar from "./components/Calendar.jsx";
import RouteGuard from "./pages/RouteGuard.jsx";

import LogInPage from "./pages/LogIn.jsx";
import ProfilePage from "./pages/Profile.jsx";
import Users from "./pages/Users.jsx";
import Reservation from "./forms/ReservationForm.jsx";

import { useNotices } from "./providers/NoticeProvider.jsx";

import Event from "./pages/Event.jsx";
import NewNotification from "./pages/NewNotification.jsx";
import TestForm from "./pages/TestForm.jsx";

import { useIsLoading } from "./providers/LoadingProvider.jsx";

import { useAuth } from "./providers/AuthProvider.jsx";

import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";

const drawerWidth = 240;

function App(props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [currentSection, setCurrentSection] = React.useState("Calendario");
  const [selectedFEIEvent, setSelectedFEIEvent] = React.useState();

  const navigate = useNavigate();
  const location = useLocation();

  const { noticeAmount, decreaseNotices } = useNotices();

  const { isLoading, setIsLoading } = useIsLoading();

  const { user, token, logIn, logOut } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = React.useState(user !== null);

  const handleFEIEventSelection = (FEIEvent) => {
    setSelectedFEIEvent(FEIEvent);
    //setCurrentSection(FEIEvent.name);
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

  const sideBar = <Sidebar user={user} />;

  return (
    <Box
      className="app"
      flexGrow={1}
      display={"flex"}
      height={"100%"}
      width={"100%"}
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
          {sideBar}
        </Drawer>
        <Stack display={{ xs: "none", sm: "flex" }} flex="1 1 auto">
          {sideBar}
        </Stack>
      </Box>

      <Stack direction={"column"} width={"100%"}>
        <Topbar
          noticeAmount={noticeAmount}
          onMenuIconClick={handleDrawerToggle}
          onLogOutClick={logOut}
          isAuthenticated={isAuthenticated}
          user={user}
        ></Topbar>

        {isLoading && <LinearProgress sx={{ height: "5px" }}></LinearProgress>}
        <Stack className="content" padding={{ xs: 0, md: 3 }}>
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

            <Route path="/" element={<LogInPage></LogInPage>}>
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
    </Box>
  );
}

export default App;
