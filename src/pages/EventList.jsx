import { useState, useEffect, useRef } from "react";

import Card from "../components/CardEvent.jsx";
import { Stack } from "@mui/material";
import { GetEvents, GetNotifications } from "../api/EventService.js";
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
import ClearIcon from "@mui/icons-material/Clear";
import useWindowSize from "../hooks/useWindowSize.jsx";
import Tooltip from "@mui/material/Tooltip";
import { useIsLoading } from "../providers/LoadingProvider.jsx";
import { useSnackbar } from "../providers/SnackbarProvider.jsx";

import { DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import "moment/dist/locale/es-mx";

import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import CustomFab from "../components/CustomFab.jsx";

import ReportGenerator from "./ReportView.jsx";

import { showIfBig, showIfSmall } from "../validation/enums/breakpoints.js";

import ResponsiveDialog from "../components/ResponsiveDialog.jsx";

export default function Eventos(
  { notifications, handleGet, idUsuario = 0, setTitle },
  { setSelectedFEIEvent }
) {
  const [queriedEvents, setQueriedEvents] = useState([]);
  const [defaultEvents, setDefaultEvents] = useState([]);
  const [queriedPagination, setQueriedPagination] = useState(1);
  const [defaultPagination, setDefaultPagination] = useState(1);
  const [currentFilter, setCurrentFilter] = useState("porFechaEnvio");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [ready, setReady] = useState(false);

  moment.locale("es-mx");
  const [date, setDate] = useState(null);
  const { width } = useWindowSize();
  const isMobile = width < 600;
  const reportRef = useRef(null);

  const { isLoading, setIsLoading } = useIsLoading();
  const { showSnackbar } = useSnackbar();

  const fetchEvents = async (fullFetch = false) => {
    setIsLoading(true);

    let filters = [`page=${currentPage}`, `${currentFilter}=true`];

    if (fullFetch) {
      filters.push(`todo=true`);
      filters.push(`evidencias=true`);
    }
    if (date) {
      filters.push(`inicio=${date.format("YYYY-MM")}`);
    }
    if (idUsuario > 0) {
      filters.push(`idUsuario[eq]=${idUsuario}`);
    }
    if (searchQuery) {
      filters.push(`nombre=${searchQuery}`);
    }
    const response = await GetEvents(filters);

    setIsLoading(false);

    return response;
  };

  const handleFilterChange = async (event) => {
    const newFilter = event.target.value;
    setCurrentFilter(newFilter);

    getEventsOnFilterChange();

    setCurrentPage(1);
  };

  const handleSearchQueryChange = async (e) => {
    setSearchQuery(e.target.value);
  };

  const getEventsOnFilterChange = async () => {
    const response = await fetchEvents();
    setQueriedEvents(response.data.data);
    setQueriedPagination(response.data.meta);
  };

  const handleClearSearchQuery = (e) => {
    setSearchQuery("");
    setQueriedEvents(defaultEvents);
    setQueriedPagination(defaultPagination);
    setCurrentPage(1);
    setCurrentFilter("");
    setDate(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchEvents();
      setQueriedEvents(response.data.data);
      setQueriedPagination(response.data.meta);
      setDefaultPagination(response.data.meta);
      setDefaultEvents(response.data.data);
      setReady(true);
    };
    if (idUsuario === 0) {
      setTitle("Eventos");
    }
    fetchData();
  }, []);

  const handlePageChange = async (event, newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (!ready) {
      return;
    }
    getEventsOnFilterChange();
  }, [currentPage, currentFilter, date]);

  const [generatingPDF, setGeneratingPDF] = useState(false);

  const handleEnter = (e) => {
    switch (e.key) {
      case "Enter":
        getEventsOnFilterChange();
        break;
      case "Escape":
        setSearchQuery("");
        break;
      default:
        break;
    }
  };

  const filters = (
    <Stack
      direction={{ md: "row", xs: "column" }}
      padding={2}
      spacing={3}
      display={"flex"}
      className="fuck"
    >
      <Stack id={"text-field"} direction={"row"} flexGrow={2}>
        <TextField
          onKeyDown={handleEnter}
          fullWidth
          onChange={handleSearchQueryChange}
          value={searchQuery}
          placeholder="Buscar por título u organizador"
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
          disableElevation
          onClick={fetchEvents}
        >
          <SearchIcon />
        </Button>
      </Stack>
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="es">
        <DatePicker
          sx={{ flexGrow1: 1 }}
          label={"Buscar por mes"}
          views={["month", "year"]}
          onYearChange={(date) => setDate(date)}
          value={date}
        />
      </LocalizationProvider>
      <FormControl sx={{ flexGrow: 2, minWidth: "13rem" }}>
        <InputLabel id="demo-simple-select-label">Ordenar por</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Ordenar por"
          value={currentFilter}
          onChange={handleFilterChange}
          fullWidth
        >
          <MenuItem value={"porFechaEnvio"}>Fecha de notificación</MenuItem>
          <MenuItem value={"porAlfabetico"}>Orden alfabético</MenuItem>
        </Select>
      </FormControl>

      <Tooltip title="Limpiar filtros">
        <Button variant="outlined" onClick={handleClearSearchQuery}>
          <FilterAltOffIcon />
        </Button>
      </Tooltip>
    </Stack>
  );

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);
  const [reportEvents, setReportEvents] = useState({});

  const generateReport = async () => {
    showSnackbar("Obteniendo evidencias y generando el reporte...", "asdf");
    const response = await fetchEvents(true);
    setReportEvents(response.data.data);
    toggleReportGeneration();
  };

  const toggleReportGeneration = () => setGeneratingPDF(!generatingPDF);

  return (
    <Stack>
      {generatingPDF && (
        <ReportGenerator
          reportRef={reportRef}
          events={reportEvents}
          onFinishReport={() => setGeneratingPDF(false)}
          dateString={
            date ? date.format("MMMM YYYY") : moment().format("MMMM YYYY")
          }
        />
      )}
      <Stack display={showIfBig}>{filters}</Stack>

      <ResponsiveDialog
        open={showModal}
        onClose={toggleModal}
        showPrimary={false}
        secondaryLabel="Regresar"
      >
        {filters}
      </ResponsiveDialog>

      <Stack
        direction={"row"}
        padding={2}
        spacing={3}
        display={"flex"}
        justifyContent={"end"}
      >
        <Button variant="outlined" onClick={generateReport}>
          Descargar reporte
        </Button>
        <Button
          variant="outlined"
          onClick={toggleModal}
          sx={{ display: showIfSmall }}
        >
          Filtros
        </Button>
        <CustomFab></CustomFab>
      </Stack>

      <Stack spacing={{ md: 2 }} margin={{ md: 1 }}>
        {queriedEvents.map((item) => (
          <Card props={item} key={item.id} isProfile={idUsuario !== 0}></Card>
        ))}
      </Stack>
      {!isLoading && (
        <Pagination
          count={queriedPagination.total_pages ?? queriedPagination.last_page}
          onChange={handlePageChange}
          color="primary"
          size="large"
          page={currentPage}
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: 3,
          }}
        />
      )}
    </Stack>
  );
}
