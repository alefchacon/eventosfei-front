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
import html2pdf from "html2pdf.js";

import ReportView from "./ReportView.jsx";

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

export default function Reports(
  { notifications, handleGet, idUsuario = 0, setTitle },
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
  const [date, setDate] = useState(null);
  const { width } = useWindowSize();
  const isMobile = width < 600;
  const reportRef = useRef(null);

  const { isLoading, setIsLoading } = useIsLoading();

  const navigate = useNavigate();
  const location = useLocation();

  const handleGetEvents = async (extraFilters = []) => {
    setIsLoading(true);

    let filters = [`?`, `page=${currentPage}`, `${currentFilter}=true`];
    for (const filter of extraFilters) {
      filters.push(filter);
    }
    if (date) {
      filters.push(`inicio=${date.format("YYYY-MM")}`);
    }
    if (idUsuario > 0) {
      filters.push(`idUsuario[eq]=${idUsuario}`);
    }
    const response = await GetEvents(filters);

    console.log(response.data);
    setQueriedEvents(response.data.data);
    setIsLoading(false);
  };

  useEffect(() => {
    handleGetEvents();
  }, [date]);

  const handle = (FEIEvent) => {
    console.log(FEIEvent);
    setSelectedFEIEvent(FEIEvent);
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

        setLoading(false);
        //setItems(response)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    /*
    if (idUsuario === 0) {
      setTitle("Reportes");
    }*/
    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount

  const handlePageChange = async (event, newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    async function fetchEvents() {
      await handleGetEvents();
      window.scrollTo(0, 0);
    }
    fetchEvents();
  }, [currentPage, currentFilter]);

  const [generatingPDF, setGeneratingPDF] = useState(false);

  const convertToPdf = () => {
    const report = <ReportView reportRef={reportRef} events={queriedEvents} />;
    console.log(report);
    const content = reportRef.current;
    html2pdf().set(options).from(report).save();
  };

  const options = {
    filename: "my-document.pdf",
    margin: 1,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  const toggleReportGeneration = () => setGeneratingPDF(!generatingPDF);

  const filters = (
    <Stack
      direction={{ md: "row", xs: "column" }}
      padding={2}
      spacing={3}
      display={"flex"}
      className="fuck"
    >
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="es-MX">
        <DatePicker
          label={"Buscar por mes"}
          views={["month", "year"]}
          onYearChange={(date) => setDate(date)}
          value={date}
        />
      </LocalizationProvider>
      <Button variant="outlined" onClick={toggleReportGeneration}>
        Descargar reporte
      </Button>
    </Stack>
  );

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  return (
    <Stack>
      {generatingPDF && (
        <ReportView
          reportRef={reportRef}
          events={queriedEvents}
          onFinishReport={toggleReportGeneration}
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
    </Stack>
  );
}
