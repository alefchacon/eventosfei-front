import { useState, useEffect, useRef } from "react";

import Card from "../components/Card.jsx";
import ReservationCard from "../components/ReservationCard.jsx";
import { Stack } from "@mui/material";
import { GetEvents, GetNotifications } from "../api/EventService.js";
import {
  GetNewReservation,
  GetReservations2,
} from "../api/ReservationService.js";
import Typography from "@mui/material/Typography";
import CircularProgress from "../components/CircularProgress.jsx";
import { Container } from "@mui/material";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import Pagination from "@mui/material/Pagination";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid";
import ClearIcon from "@mui/icons-material/Clear";
import emotionStyledBase from "@emotion/styled/base";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import useWindowSize from "../hooks/useWindowSize.jsx";
import Fab from "@mui/material/Fab";
import { useIsLoading } from "../providers/LoadingProvider.jsx";

import { DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import "moment/locale/es";

import { useNotices } from "../providers/NoticeProvider.jsx";

import { useNavigate, useLocation } from "react-router-dom";

import { MarkAsUserRead } from "../api/ReservationService.js";

export default function ReservationList(
  {
    notifications,
    handleGet,
    idUsuario = 1,
    showFilters = true,
    showButtons = true,
  },
  { setSelectedFEIEvent }
) {
  const [queriedEvents, setQueriedEvents] = useState([]);
  const [defaultEvents, setDefaultEvents] = useState([]);
  const [queriedPagination, setQueriedPagination] = useState(1);
  const [defaultPagination, setDefaultPagination] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [date, setDate] = useState(moment());
  const { width } = useWindowSize();
  const isMobile = width < 600;

  const { isLoading, setIsLoading } = useIsLoading();

  const navigate = useNavigate();
  const location = useLocation();

  const handleGetEvents = async (extraFilters = []) => {
    setIsLoading(true);

    let filters = [`page=${currentPage}`];
    for (const filter of extraFilters) {
      filters.push(filter);
    }
    if (idUsuario > 0) {
      filters.push(`idUsuario[eq]=${idUsuario}`);
      filters.push(`porAvisosUsuario=true`);
    } else {
      filters.push(`porAvisosAdministrador=true`);
    }
    const response = await GetReservations2(filters);

    setIsLoading(false);

    return response.data.data;
  };

  const handle = (FEIEvent) => {
    setSelectedFEIEvent(FEIEvent);
  };

  const handleFilterChange = async (event) => {
    const newFilter = event.target.value;
    setCurrentFilter(newFilter);

    const events = await handleGetEvents();

    setQueriedEvents(events);
    setCurrentPage(1);
  };

  const handleDateChange = async (date) => {
    setDate(date);
    const extraFilter = `inicio=${date.format("YYYY-MM")}`;
    const events = await handleGetEvents([extraFilter]);
    setQueriedEvents(events);
    setQueriedPagination(events);
  };

  const handleEventSearch = async () => {
    const extraFilter = `nombre=${searchQuery}`;
    const events = await handleGetEvents([extraFilter]);
    setQueriedEvents(events);
    setQueriedPagination(events);
  };

  const handleSearchQueryChange = async (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearchQuery = (e) => {
    setSearchQuery("");
    setQueriedEvents(defaultEvents);
    setQueriedPagination(defaultPagination);
    setCurrentPage(1);
  };

  const { removeUserNotices } = useNotices();
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      let response = [];

      let initialFilters = [`page=${currentPage}`];

      if (idUsuario > 0) {
        initialFilters.push(`idUsuario[eq]=${idUsuario}`);
        initialFilters.push(`porAvisosUsuario=true`);
      } else {
        initialFilters.push(`porAvisosAdministrador=true`);
      }

      response = await GetReservations2(initialFilters);

      const data = response.data;
      const events = data.data;
      setQueriedEvents(events);
      setDefaultEvents(events);
      setQueriedPagination(data.meta);
      setDefaultPagination(data.meta);

      setLoading(false);
      //setItems(response)
    };

    fetchData();
  }, []);

  useEffect(() => {
    const updateNotifications = async () => {
      if (idUsuario > 0) {
        const readReservations = queriedEvents.filter(
          (reservation) => reservation.notifyUser === 1
        );
        const response = await MarkAsUserRead(readReservations);
        removeUserNotices(readReservations);
      }
    };
    console.log("update");
    updateNotifications();
  }, [isLoading]);

  console.log("ASDF");
  const handlePageChange = async (event, newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    async function fetchEvents() {
      const events = await handleGetEvents();
      setQueriedEvents(events);
      window.scrollTo(0, 0);
    }
    fetchEvents();
  }, [currentPage, currentFilter]);

  return (
    <>
      {showFilters && (
        <Stack
          direction={{ lg: "row", sm: "column" }}
          padding={2}
          spacing={3}
          display={"flex"}
        >
          <Stack direction={"row"} flexGrow={2}>
            <TextField
              fullWidth
              onChange={handleSearchQueryChange}
              value={searchQuery}
              placeholder="Buscar eventos"
              sx={{ bgcolor: "white" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {searchQuery !== "" ? (
                      <IconButton
                        aria-label="search"
                        edge="end"
                        onClick={handleClearSearchQuery}
                      >
                        {false ? <ClearIcon /> : ""}
                        <ClearIcon />
                      </IconButton>
                    ) : (
                      ""
                    )}
                  </InputAdornment>
                ),
              }}
            ></TextField>
            <Button
              variant="contained"
              aria-label="search"
              edge="end"
              onClick={handleEventSearch}
            >
              <SearchIcon />
            </Button>
          </Stack>

          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="es">
            <DatePicker
              label={"Buscar por mes"}
              views={["month", "year"]}
              onYearChange={handleDateChange}
            />
          </LocalizationProvider>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Ordenar por</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Ordenar por"
              value={currentFilter}
              onChange={handleFilterChange}
            >
              <MenuItem value={"porFechaEnvio"}>Fecha de notificación</MenuItem>
              <MenuItem value={"porAlfabetico"}>Orden alfabético</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={handleClearSearchQuery}>
            Limpiar filtros
          </Button>
        </Stack>
      )}

      {showButtons && (
        <Stack
          direction={{ lg: "row", sm: "column" }}
          padding={2}
          spacing={3}
          display={"flex"}
          justifyContent={"end"}
        >
          {isMobile ? (
            <Fab
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                padding: 4,
                margin: 5,
              }}
              color="primary"
              variant="circular"
            >
              +
            </Fab>
          ) : (
            <Button variant="contained">Nueva reservación</Button>
          )}
        </Stack>
      )}
      <Stack spacing={{ md: 1 }} margin={{ md: 1 }}>
        {queriedEvents.map((item) => (
          <ReservationCard item={item} adminView={idUsuario === 0} />
        ))}
      </Stack>
      {!isLoading && (
        <Stack
          spacing={0}
          paddingTop={0}
          paddingBottom={15}
          display={"flex"}
          alignItems={"center"}
        >
          <Pagination
            count={queriedPagination.total_pages}
            onChange={handlePageChange}
            color="primary"
            size="large"
            page={currentPage}
          />
        </Stack>
      )}
    </>
  );
}
