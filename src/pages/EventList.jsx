import { useState, useEffect, useRef } from "react";

import Card from "../components/Card.jsx";
import { Stack } from "@mui/material";
import { GetEvents, GetNotifications } from "../api/EventService.js";
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

export default function Eventos(
  { notifications, handleGet },
  { setSelectedFEIEvent }
) {
  const [queriedEvents, setQueriedEvents] = useState([]);
  const [defaultEvents, setDefaultEvents] = useState([]);
  const [queriedPagination, setQueriedPagination] = useState(null);
  const [defaultPagination, setDefaultPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("porFechaEnvio");
  const [currentPage, setCurrentPage] = useState(1);
  const [idUsuario, setIdUsuario] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width < 900;

  const handle = (FEIEvent) => {
    console.log(FEIEvent);
    setSelectedFEIEvent(FEIEvent);
  };

  const handleFilterChange = async (event) => {
    const newFilter = event.target.value;
    setCurrentFilter(newFilter);
    console.log("wtf");
    const response = await handleGet(idUsuario, currentPage, newFilter);
    console.log(response);

    setQueriedEvents(response.data.data);
    setCurrentPage(1);
  };

  const handleEventSearch = async (e) => {
    console.log(searchQuery);
    let response = await GetEvents([
      `idUsuario[eq]=${idUsuario}`,
      `nombre=${searchQuery}`,
    ]);
    setQueriedEvents(response.data.data);
    setQueriedPagination(response.data.meta);
  };

  const handleSearchQueryChange = async (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearchQuery = (e) => {
    setSearchQuery("");
    console.log(defaultEvents);
    setQueriedEvents(defaultEvents);
    setQueriedPagination(defaultPagination);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = [];

        if (notifications) {
          response = await GetNotifications();
        } else {
          response = await handleGet(idUsuario, currentPage, currentFilter);
        }

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
    const response = await handleGet(idUsuario, newPage, currentFilter);
    setQueriedEvents(response.data.data);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <>
        <Container
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress></CircularProgress>
        </Container>
      </>
    );
  }
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
        {isMobile ? (
          ""
        ) : (
          <Button variant="contained">Nueva notificación</Button>
        )}
      </Stack>

      <Stack spacing={{ md: 2 }} margin={{ md: 1 }}>
        {queriedEvents.map((item) => (
          <Card props={item} key={item.id} parentHandle={handle}></Card>
        ))}
      </Stack>
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
    </>
  );
}
