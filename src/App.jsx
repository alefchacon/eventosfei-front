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

import EventCalendar from "./components/Calendar.jsx";
import RouteGuard from "./pages/RouteGuard.jsx";

import LogInPage from "./pages/LogIn.jsx";
import ProfilePage from "./pages/Profile.jsx";
import Users from "./pages/Users.jsx";
import ReservationForm from "./forms/ReservationForm.jsx";

import { useNotices } from "./providers/NoticeProvider.jsx";

import Event from "./pages/Event.jsx";
import NewNotification from "./pages/NewNotification.jsx";
import ReportView from "./pages/ReportView.jsx";

import { useIsLoading } from "./providers/LoadingProvider.jsx";

import { useAuth } from "./providers/AuthProvider.jsx";

import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import { idRol } from "./validation/enums/idRol.js";

function App(props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [currentSection, setCurrentSection] = React.useState("Calendario");
  const [selectedFEIEvent, setSelectedFEIEvent] = React.useState();

  const { noticeAmount, decreaseNotices } = useNotices();

  const [title, setTitle] = useState("Calendario");

  const { user, token, logIn, logOut } = useAuth();
  const [isStaff, setIsStaff] = useState(
    user ? user.rol.id > idRol.ORGANIZADOR : false
  );

  const [isAuthenticated, setIsAuthenticated] = React.useState(Boolean(user));

  useEffect(() => {
    setIsAuthenticated(Boolean(user));
    console.log(Boolean(user));
  }, []);

  const handleFEIEventSelection = (FEIEvent) => {
    setSelectedFEIEvent(FEIEvent);
    //setCurrentSection(FEIEvent.name);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

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
      <Sidebar
        user={user}
        setIsClosing={setIsClosing}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <Stack direction={"column"} width={"100%"}>
        <Topbar
          noticeAmount={noticeAmount}
          onMenuIconClick={handleDrawerToggle}
          onLogOutClick={logOut}
          isAuthenticated={isAuthenticated}
          user={user}
          title={title}
        ></Topbar>

        <Stack className="content" padding={{ xs: 0, md: 3 }}>
          <Routes>
            <Route path="/avisos" element={<Notices isStaff={isStaff} />}>
              {" "}
            </Route>
            <Route
              path="/eventos"
              element={
                <EventList
                  user={user}
                  notifications={false}
                  setSelectedFEIEvent={handleFEIEventSelection}
                  idUsuario={0}
                  setTitle={setTitle}
                />
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
              element={<EventCalendar setTitle={setTitle} />}
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
                  <NewNotification
                    idUsuario={user ? user.id : 0}
                    setTitle={setTitle}
                  ></NewNotification>
                </RouteGuard>
              }
            >
              {" "}
            </Route>
            <Route
              path="/eventos/:idEvento/:idAviso?"
              element={
                <Event FEIEvent={selectedFEIEvent} setTitle={setTitle} />
              }
            >
              {" "}
            </Route>
            <Route
              path="/reservar"
              element={
                <RouteGuard isAuthenticated={isAuthenticated}>
                  <ReservationForm
                    idUsuario={user ? user.id : null}
                    setTitle={setTitle}
                  ></ReservationForm>
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
                  <ProfilePage user={user} setTitle={setTitle}></ProfilePage>
                </RouteGuard>
              }
            >
              {" "}
            </Route>
            <Route
              path="/test"
              element={
                <RouteGuard isAuthenticated={isAuthenticated}>
                  <ReportView />
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
