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

import ReportView from "./ReportView.jsx";

import { showIfBig, showIfSmall } from "../validation/enums/breakpoints.js";
import { getEventReport } from "../api/EventService.js";
import ResponsiveDialog from "../components/ResponsiveDialog.jsx";
import { idRol } from "../validation/enums/idRol.js";
import axios from "axios";
import { backendUrl } from "../api/urls.js";
export default function Eventos(
  { notifications, handleGet, idUsuario = 0, setTitle, user },
  { setSelectedFEIEvent }
) {
  const [queriedEvents, setQueriedEvents] = useState([]);
  const [queriedPagination, setQueriedPagination] = useState(1);
  const [currentFilter, setCurrentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [disableDownload, setDisableDownload] = useState(true);

  const [ready, setReady] = useState(false);

  const textFieldRef = useRef(null);

  moment.locale("es-mx");
  const [date, setDate] = useState(null);

  const { isLoading } = useIsLoading();
  const { showSnackbar } = useSnackbar();

  const getFilteredEvents = async (fullFetch = false) => {
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

    return response;
  };

  const handleFilterChange = async (event) => {
    const newFilter = event.target.value;
    setCurrentFilter(newFilter);
    setCurrentPage(1);
  };

  const getEventsOnFilterChange = async () => {
    setReady(false);
    const filtered =
      Boolean(currentFilter) || Boolean(searchQuery) || Boolean(date);
    setDisableDownload(!filtered);
    const response = await getFilteredEvents();
    setQueriedEvents(response.data.data);
    setQueriedPagination(response.data.meta);
    setReady(true);
  };

  const handleClearSearchQuery = (e) => {
    setSearchQuery("");
    textFieldRef.current.value = "";

    setCurrentPage(1);
    setCurrentFilter("");
    setDate(null);
    setDisableDownload(true);
  };

  useEffect(() => {
    if (idUsuario === 0) {
      setTitle("Eventos");
    }
    getEventsOnFilterChange();
  }, []);

  const handlePageChange = async (event, newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (!ready) {
      return;
    }
    getEventsOnFilterChange();
  }, [currentPage, currentFilter, date, searchQuery]);

  const [generatingPDF, setGeneratingPDF] = useState(false);

  const handleSearchQueryChange = () => {
    setSearchQuery(textFieldRef.current.value);
  };

  const handleEnter = (e) => {
    switch (e.key) {
      case "Enter":
        handleSearchQueryChange();
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
          inputRef={textFieldRef}
          fullWidth
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
          onClick={handleSearchQueryChange}
        >
          <SearchIcon />
        </Button>
      </Stack>
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="es">
        <DatePicker
          sx={{ flexGrow1: 1 }}
          label={"Buscar por mes"}
          views={["month", "year"]}
          onMonthChange={(date) => setDate(date)}
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
    //const start = date.format("YYYY-MM-DD");
    //const end = date.clone().add(1, "month").subtract(1, "day").format("YYYY-MM-DD");

    console.log(await getEventReport(date));

    /*
    const dateCopy = date.clone();
    console.log(dateCopy.format("YYYY-MM-DD"));
    console.log(dateCopy.add(1, "month").subtract(1, "day").format("YYYY-MM-DD"))
    */
    /*
    showSnackbar("Obteniendo evidencias y generando el reporte...", "asdf");
    const response = await getFilteredEvents(true);
    setReportEvents(response.data.data);
    toggleReportGeneration();
    */
  };

  const toggleReportGeneration = () => setGeneratingPDF(!generatingPDF);

  const reportRef = useRef(null);
  return (
    <Stack>
      {generatingPDF && (
        <ReportView
          reportRef={reportRef}
          events={reportEvents}
          onFinishReport={() => setGeneratingPDF(false)}
          date={date}
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
        {user?.rol.id === idRol.COORDINADOR && (
          <Tooltip title={"Primero filtre los eventos"}>
            <div>
              <Button
                variant="outlined"
                onClick={generateReport}
                disabled={disableDownload}
              >
                Descargar reporte
              </Button>
            </div>
          </Tooltip>
        )}
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
