import { useState, useEffect, useRef } from "react";

import Card from "../components/CardEvent.jsx";
import { Stack } from "@mui/material";
import { GetEvents, GetNotifications } from "../api/EventService.js";
import Typography from "@mui/material/Typography";
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
import Tooltip from "@mui/material/Tooltip";
import Fab from "@mui/material/Fab";
import { useIsLoading } from "../providers/LoadingProvider.jsx";

import { DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
import "moment/locale/es";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import CustomFab from "../components/CustomFab.jsx";

import { showIfBig, showIfSmall } from "../validation/enums/breakpoints.js";

import ResponsiveDialog from "../components/ResponsiveDialog.jsx";

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

export default function Eventos(
  { notifications, handleGet, idUsuario = 1 },
  { setSelectedFEIEvent }
) {
  const [queriedEvents, setQueriedEvents] = useState([]);
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

    let filters = [`?`, `page=${currentPage}`, `${currentFilter}=true`];
    console.log(currentPage);
    for (const filter of extraFilters) {
      filters.push(filter);
    }
    if (idUsuario > 0) {
      filters.push(`idUsuario[eq]=${idUsuario}`);
    }
    console.log(filters);
    const response = await GetEvents(filters);

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

        response = await GetEvents(initialFilters);

        if (!response.status === 200) {
          throw new Error("Network response was not ok");
        }

        const data = response.data;
        const events = data.data;
        setQueriedEvents(events);
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
  }, []); // Empty dependency array means this effect runs once on mount

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

  const getReport = () => {
    const doc = new jsPDF("p", "mm", "a4");
    // Dimensiones del documento
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageMargin = 20; // Margin on each side
    const tableWidth = pageWidth - 2 * pageMargin;

    // Ancho de columnas
    const col1Width = tableWidth * 0.4;
    const col2Width = tableWidth * 0.6;

    // El cursor se controla con estas variables:
    let startX = pageMargin;
    let startY = 20;
    let originalStartY = startY;
    doc.text(
      "Coordinación de Eventos de la Facultad de Estadística e Informática",
      startX,
      startY
    );
    startY += 10;

    let text = `Reporte mensual`;
    let textX = (doc.internal.pageSize.getWidth() - doc.getTextWidth(text)) / 2;
    doc.text(text, textX, startY);

    startY += 10;

    doc.setFontSize(12);

    let data = [
      ["Mes", moment(date).format("MMMM YYYY")],
      ["Número de eventos", queriedEvents.length],
    ];

    // PRIMERA TABLA:
    data.forEach((row, rowIndex) => {
      let maxHeight = 0;

      row.forEach((cell, colIndex) => {
        let cellWidth = colIndex === 0 ? col1Width : col2Width;
        let lines = doc.splitTextToSize(cell, cellWidth - 15); // Aquí es donde se calcula el salto de línea

        let cellHeight = lines.length * 10; // 10 is the line height
        maxHeight = Math.max(maxHeight, cellHeight);
      });

      // Dibujar celdas
      row.forEach((cell, colIndex) => {
        let cellWidth = colIndex === 0 ? col1Width : col2Width;
        let lines = doc.splitTextToSize(cell, cellWidth - 15); // Aquí es donde se calcula el salto de línea

        // Estilo
        if (colIndex === 0) {
          doc.setFont("helvetica", "bold");
          doc.setFillColor(220, 220, 220);
          //doc.setFillColor(255, 255, 255);
        } else {
          doc.setFont("helvetica", "normal");
          doc.setFillColor(255, 255, 255);
        }

        doc.rect(
          startX + (colIndex === 0 ? 0 : col1Width),
          startY,
          cellWidth,
          maxHeight,
          "FD"
        );

        // Dibujar texto
        let textY = startY + 5;
        lines.forEach((line) => {
          doc.text(
            line,
            startX +
              (colIndex === 0 ? cellWidth / 2 : col1Width + cellWidth / 2),
            textY,
            { align: "center", baseline: "middle" }
          );
          textY += 10; // Move to the next line
        });
      });

      startY += maxHeight;
    });

    startY += 10; // Bajando el cursor

    doc.setFontSize(16);
    text = `Eventos`;
    textX = (doc.internal.pageSize.getWidth() - doc.getTextWidth(text)) / 2;
    doc.text(text, textX, startY);

    doc.output("dataurlnewwindow");
  };

  const filters = (
    <>
      <Stack
        direction={{ md: "row", xs: "column" }}
        padding={2}
        spacing={3}
        display={"flex"}
      >
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

        <Stack direction={"row"}>
          <TextField
            fullWidth={{ md: "false", xs: "true" }}
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
            onClick={handleEventSearch}
          >
            <SearchIcon />
          </Button>
        </Stack>
        <Tooltip title="Limpiar filtros">
          <Button variant="outlined" onClick={handleClearSearchQuery}>
            <FilterAltOffIcon />
          </Button>
        </Tooltip>
      </Stack>
    </>
  );

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  return (
    <Stack>
      <Stack display={showIfBig}>{filters}</Stack>
      <Stack display={showIfSmall} padding={2}>
        <Button variant="outlined" onClick={toggleModal}>
          Filtros
        </Button>
      </Stack>

      <ResponsiveDialog
        open={showModal}
        onClose={toggleModal}
        showPrimary={false}
        secondaryLabel="Regresar"
      >
        {filters}
      </ResponsiveDialog>

      <Stack
        direction={{ lg: "row", xs: "column" }}
        padding={2}
        spacing={3}
        display={"flex"}
        justifyContent={"end"}
      >
        <Button variant="outlined" onClick={getReport}>
          Descargar reporte
        </Button>

        <CustomFab></CustomFab>
      </Stack>

      <Stack spacing={{ md: 2 }} margin={{ md: 1 }}>
        {queriedEvents.map((item) => (
          <Card
            props={item}
            key={item.id}
            parentHandle={handle}
            isProfile={idUsuario !== 0}
          ></Card>
        ))}
      </Stack>
      {!isLoading && (
        <Pagination
          count={queriedPagination.total_pages}
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
