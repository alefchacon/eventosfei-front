import { useState, useEffect, useRef } from "react";

import Card from "../components/CardEvent.jsx";
import { Stack } from "@mui/material";
import { GetEvents, GetNewEvents } from "../api/EventService.js";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import Pagination from "@mui/material/Pagination";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Tabs from "../components/CustomTabs.jsx";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import useWindowSize from "../hooks/useWindowSize.jsx";

import { useIsLoading } from "../providers/LoadingProvider.jsx";

import { DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import "moment/locale/es";

import { jsPDF } from "jspdf";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";

export default function NoticeList(
  { notifications, handleGet, idUsuario = 1 },
  { setSelectedFEIEvent }
) {
  const [queriedNotifications, setQueriedNotifications] = useState([]);
  const [defaultEvents, setDefaultEvents] = useState([]);
  const [queriedPagination, setQueriedPagination] = useState(1);
  const [defaultPagination, setDefaultPagination] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("porFechaEnvio");
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

    let filters = [`page=${currentPage}`, `${currentFilter}=true`];
    for (const filter of extraFilters) {
      filters.push(filter);
    }
    if (idUsuario > 0) {
      filters.push(`idUsuario[eq]=${idUsuario}`);
    }
    const response = await GetNewEvents(filters);

    setIsLoading(false);

    return response.data.data;
  };

  const handle = (FEIEvent) => {
    console.log(FEIEvent);
    setSelectedFEIEvent(FEIEvent);
  };

  const handleFilterChange = async (event) => {
    const newFilter = event.target.value;
    setCurrentFilter(newFilter);

    const events = await handleGetEvents();

    setQueriedNotifications(events);
    setCurrentPage(1);
  };

  const handleDateChange = async (date) => {
    setDate(date);
    const extraFilter = `inicio=${date.format("YYYY-MM")}`;
    const events = await handleGetEvents([extraFilter]);
    setQueriedNotifications(events);
    setQueriedPagination(events);
  };

  const handleEventSearch = async () => {
    const extraFilter = `nombre=${searchQuery}`;
    const events = await handleGetEvents([extraFilter]);
    setQueriedNotifications(events);
    setQueriedPagination(events);
  };

  const handleSearchQueryChange = async (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearchQuery = (e) => {
    setSearchQuery("");
    setQueriedNotifications(defaultEvents);
    setQueriedPagination(defaultPagination);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        let response = [];

        let initialFilters = [`page=${currentPage}`, `${currentFilter}=true`];
        console.log(initialFilters);

        if (idUsuario > 0) {
          initialFilters.push(`idUsuario[eq]=${idUsuario}`);
        }

        response = await GetNewEvents(initialFilters);
        console.log(response);

        if (!response.status === 200) {
          throw new Error("Network response was not ok");
        }

        const data = response.data;
        const events = data.data;
        setQueriedNotifications(events);
        setDefaultEvents(events);
        setQueriedPagination(data.meta);
        setDefaultPagination(data.meta);

        setLoading(false);
        //setItems(response)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = async (event, newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    async function fetchEvents() {
      const events = await handleGetEvents();
      setQueriedNotifications(events);
      window.scrollTo(0, 0);
    }
    fetchEvents();
  }, [currentPage, currentFilter]);

  return (
    <>
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

      <Stack
        direction={{ lg: "row", sm: "column" }}
        padding={2}
        spacing={3}
        display={"flex"}
        justifyContent={"end"}
      ></Stack>
      <Stack spacing={{ md: 2 }} margin={{ md: 1 }}>
        {queriedNotifications.map((item) => (
          <Card
            props={item}
            key={item.id}
            parentHandle={handle}
            isProfile={idUsuario !== 0}
          ></Card>
        ))}
      </Stack>
      {!isLoading && (
        <Stack
          spacing={2}
          paddingTop={3}
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
