import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import PropTypes from "prop-types";

import moment from "moment";

import { jsPDF } from "jspdf";

import {
  Tabs,
  Tab,
  Typography,
  Box,
  Button,
  Stack,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

import Evaluation from "../pages/Evaluation";
import EventResponseMobile from "../components/EventResponseMobile.jsx";
import NotificationResponse from "../components/NotificationResponse.jsx";

import { GetEventById } from "../api/EventService.js";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Event({ setTitle }) {
  const [value, setValue] = useState(0);
  const [FEIEvent, setEvent] = useState(null);

  let { eventId } = useParams();

  useEffect(() => {
    const updateOrientation = () => {
      //setShowEventResponseMobile(window.innerWidth < 600);
    };

    window.addEventListener("resize", updateOrientation);

    updateOrientation();

    const fetchData = async () => {
      try {
        const response = await GetEventById(eventId);

        if (!response.status === 200) {
          throw new Error("Network response was not ok");
        }

        console.log(response.data.data);
        setEvent(response.data.data);
        setTitle(response.data.data.name);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => window.removeEventListener("resize", updateOrientation);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const makeReport = () => {
    const doc = new jsPDF("p", "mm", "a4");

    let data = [
      ["Título del evento", FEIEvent.name],
      ["Dependencia", "Facultad de Estadística e Informática"],
      ["Página informativa", FEIEvent.page],
      ["Objetivo", FEIEvent.description],
      ["Eje(s)", FEIEvent.axi],
      ["Audiencia(s)", FEIEvent.audiences],
      ["Ámbito", FEIEvent.scope],
      ["Temática(s)", FEIEvent.themes],
    ];

    // Dimensiones del documento
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageMargin = 20; // Margin on each side
    const tableWidth = pageWidth - 2 * pageMargin;

    // Ancho de columnas
    const col1Width = tableWidth * 0.3;
    const col2Width = tableWidth * 0.7;

    // El cursor se controla con estas variables:
    let startX = pageMargin;
    let startY = 20;
    const originalStartY = startY;
    const cellHeight = 10;

    const fontSize = 12;
    doc.setFontSize(fontSize);

    // PRIMERA TABLA:
    data.forEach((row, rowIndex) => {
      let maxHeight = 0;

      row.forEach((cell, colIndex) => {
        let cellWidth = colIndex === 0 ? col1Width : col2Width;
        let lines = doc.splitTextToSize(cell, cellWidth - 15); // Aquí es donde se calcula el salto de línea

        let cellHeight = lines.length * 10; // 10 is the line height
        maxHeight = Math.max(maxHeight, cellHeight);
      });

      // Draw cells and text
      row.forEach((cell, colIndex) => {
        let cellWidth = colIndex === 0 ? col1Width : col2Width;
        let lines = doc.splitTextToSize(cell, cellWidth - 15); // Aquí es donde se calcula el salto de línea

        // Estilo
        if (colIndex === 0) {
          doc.setFont("helvetica", "bold");
          //doc.setFillColor(220, 220, 220);
          doc.setFillColor(255, 255, 255);
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

        // Draw text
        let textY = startY + 5; // Some padding from the top
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

    // SEGUNDA TABLA

    const header = ["Espacio", "Fecha", "Inicio", "Fin"];
    data = [];
    for (const reservation of FEIEvent.reservations) {
      data.push([
        reservation.space.name,
        moment(reservation.start).format("YYYY/MM/DD"),
        moment(reservation.start).format("HH:mm"),
        moment(reservation.end).format("HH:mm"),
      ]);
    }

    const colWidth = tableWidth / header.length;

    // Function to draw a row
    const drawRow = (row, y) => {
      row.forEach((cell, index) => {
        doc.rect(startX + index * colWidth, y, colWidth, cellHeight);
        doc.text(
          cell,
          startX + index * colWidth + colWidth / 2,
          y + cellHeight / 2,
          { align: "center", baseline: "middle" }
        );
      });
    };

    // Draw header
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    drawRow(header, startY);

    // Draw data rows
    doc.setFont("helvetica", "normal");
    startY += cellHeight;
    data.forEach((row) => {
      drawRow(row, startY);
      startY += cellHeight;
    });

    const imagesInBase64 = FEIEvent.evaluation.evidences.map(
      (evidence, index) => {
        doc.addPage();
        doc.text(`Evidencia ${index + 1}`, startX, originalStartY);
        let image = evidence["file"];
        doc.addImage(image, "JPEG", startX, originalStartY + 10, 180, 160);
      }
    );

    doc.save("reporte.pdf");
    //doc.output("dataurlnewwindow");
  };

  return (
    <>
      <NotificationResponse idEvento={eventId}></NotificationResponse>
      {FEIEvent && (
        <Box
          sx={{
            width: "100%",
            paddingTop: 3,
            height: "100%",
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              variant="scrollable"
              scrollButtons
            >
              <Tab label="Organizador" {...a11yProps(0)} />
              <Tab label="Evento" {...a11yProps(1)} />
              <Tab label="Logística" {...a11yProps(2)} />
              <Tab label="Espacios" {...a11yProps(3)} />
              <Tab label="Recursos" {...a11yProps(4)} />
              <Tab label="Difusión" {...a11yProps(5)} />
              <Tab label="Comentarios" {...a11yProps(6)} />
              <Tab label="Evaluación" {...a11yProps(7)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Stack spacing={4}>
              <Button onClick={makeReport}>Reporte :D</Button>
              <Typography variant="h5">Organizador</Typography>
              <TextField
                name="names"
                value={`${FEIEvent.user.names} ${FEIEvent.user.paternalName} ${FEIEvent.user.maternalName}`}
                id="names"
                InputProps={{
                  readOnly: true,
                }}
                variant="filled"
                label="Nombre"
              ></TextField>
              <TextField
                name="job"
                id="job"
                value={`${FEIEvent.user.job}`}
                variant="filled"
                label="Puesto"
                InputProps={{
                  readOnly: true,
                }}
              ></TextField>
              <TextField
                name="email"
                id="email"
                value={`${FEIEvent.user.email}`}
                variant="filled"
                label="Email"
                InputProps={{
                  readOnly: true,
                }}
              ></TextField>
            </Stack>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            Item Two
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            Three
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            Four
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            Four
          </CustomTabPanel>
          <CustomTabPanel value={value} index={5}>
            Four
          </CustomTabPanel>
          <CustomTabPanel value={value} index={6}>
            Four
          </CustomTabPanel>
          <CustomTabPanel value={value} index={7}>
            <Evaluation
              idEvento={eventId}
              FEIEvent={FEIEvent}
              onSubmit={setEvent}
            ></Evaluation>
          </CustomTabPanel>
        </Box>
      )}
    </>
  );
}
