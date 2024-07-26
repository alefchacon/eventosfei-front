import { useEffect, useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";

import { useParams } from "react-router-dom";

import { GetCronogram } from "../api/CronogramService.js";
import { GetPublicity } from "../api/PublicityService.js";

import PropTypes from "prop-types";

import BasicTable from "../components/Table.jsx";

import GetFullDateString from "../util/GetFullDateString.js";

import moment from "moment";
import DownloadIcon from "@mui/icons-material/Download";
import CheckboxList from "../components/CheckboxList.jsx";
import ReservationCheckboxList from "../components/ReservationCheckboxList.jsx";

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
  ListItem,
  ListItemButton,
  List,
  ListItemText,
} from "@mui/material";

import FileItem from "../components/FileItem.jsx";

import SendIcon from "@mui/icons-material/Send";
import { useIsLoading } from "../providers/LoadingProvider.jsx";

import Evaluation from "../pages/Evaluation";
import EventResponseMobile from "../components/EventResponseMobile.jsx";
import NotificationResponse from "../components/NotificationResponse.jsx";

import BasicTabs from "../components/Tabs.jsx";

import { GetEventById } from "../api/EventService.js";

function InfoItem({ label = "label", value = "N/A", maxWidth = "auto" }) {
  return (
    <ListItem disableGutters>
      <Stack display={"flex"} width={maxWidth} maxWidth={maxWidth}>
        <Typography color={"text.secondary"}>{label}</Typography>
        <Stack bgcolor={"lightgray"} padding={"0.77em"} borderRadius={1}>
          <Typography color={"text.primary"} variant="body1">
            {value ? value : "N/A"}
          </Typography>
        </Stack>
      </Stack>
    </ListItem>
  );
}

export default function Event({ setTitle }) {
  const [FEIEvent, setEvent] = useState(null);
  const [cronogram, setCronogram] = useState(null);
  const [publicity, setPublicity] = useState([]);
  const [fetchedCronogram, setFetchedCronogram] = useState(false);
  const [fetchedPublicity, setFetchedPublicity] = useState(false);
  const { isLoading, setIsLoading } = useIsLoading();

  let { eventId } = useParams();

  useEffect(() => {
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
  }, []);

  const getReport = () => {
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

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    drawRow(header, startY);

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

  async function fetchCronogram() {
    if (fetchedCronogram) {
      return;
    }

    setIsLoading(true);

    setCronogram((await GetCronogram(FEIEvent.id)).data.data);
    setFetchedCronogram(true);

    setIsLoading(false);
  }
  async function fetchPublicity() {
    if (fetchedPublicity) {
      return;
    }

    setIsLoading(true);

    setPublicity((await GetPublicity(FEIEvent.id)).data.data);
    setFetchedPublicity(true);

    setIsLoading(false);
  }

  return (
    <>
      <NotificationResponse idEvento={eventId}></NotificationResponse>

      <Stack direction={"row"} padding={1} gap={2}>
        <Button variant="outlined" onClick={getReport}>
          Generar reporte
        </Button>
      </Stack>

      {FEIEvent && (
        <BasicTabs>
          {FEIEvent.hasEvaluation && (
            <BasicTable label={"Evaluación"} evaluation={FEIEvent.evaluation} />
          )}
          <div label="Organizador">
            <Typography variant="h5">Información del organizador</Typography>
            <InfoItem
              label={"Nombre"}
              value={`${FEIEvent.user.names} ${FEIEvent.user.paternalName}
              ${FEIEvent.user.maternalName}`}
            ></InfoItem>
            <InfoItem label={"Puesto"} value={FEIEvent.user.job}></InfoItem>
            <InfoItem label={"Email"} value={FEIEvent.user.email}></InfoItem>
          </div>

          <Stack label="Evento" gap={2}>
            <Typography variant="h5">Detalles del evento</Typography>
            <InfoItem label={"Nombre"} value={FEIEvent.name}></InfoItem>
            <InfoItem
              label={"Descripción"}
              value={FEIEvent.description}
            ></InfoItem>

            <CheckboxList
              label="Programas educativos"
              items={FEIEvent.programs}
              selectable={false}
            ></CheckboxList>

            <Typography color="text.secondary">Audiencia(s)</Typography>
            <ul>
              {FEIEvent.audiences.split(";").map((audience, index) => (
                <li key={index}>{audience}</li>
              ))}
            </ul>
            <Typography color="text.secondary">Temática(s)</Typography>
            <ul>
              {FEIEvent.themes.split(";").map((theme, index) => (
                <li key={index}>{theme}</li>
              ))}
            </ul>

            <InfoItem label={"Eje"} value={FEIEvent.axi}></InfoItem>
            <InfoItem
              label={"Tipo de evento"}
              value={FEIEvent.type.name}
            ></InfoItem>
          </Stack>

          <Stack label="Logística" onSelect={fetchCronogram} gap={2}>
            <Typography variant="h5">Detalles logísticos</Typography>
            <Stack direction={{ md: "row", xs: "column" }}>
              <InfoItem
                label={"Inicio"}
                value={GetFullDateString(new Date(FEIEvent.start))}
              ></InfoItem>
              <InfoItem
                label={"Fin"}
                value={GetFullDateString(new Date(FEIEvent.end))}
              ></InfoItem>
            </Stack>
            <InfoItem
              label={"Número estimado de participantes"}
              value={FEIEvent.numParticipants}
            ></InfoItem>
            <Typography variant="h5">Cronograma</Typography>

            {fetchedCronogram ? (
              <FileItem fileObject={cronogram} />
            ) : (
              <Stack alignItems={"center"} gap={2}>
                <Typography color={"text.secondary"}>
                  {fetchedCronogram && !cronogram
                    ? "Sin cronograma"
                    : "Obteniendo cronograma..."}
                </Typography>
              </Stack>
            )}
          </Stack>

          <Stack label="Espacios" gap={2}>
            <Typography variant="h5">Espacios del evento</Typography>
            <InfoItem
              label={"Plataformas"}
              value={FEIEvent.platforms}
            ></InfoItem>

            <ReservationCheckboxList
              label="Espacios"
              items={FEIEvent.reservations}
              selectable={false}
            ></ReservationCheckboxList>
          </Stack>
          <Stack label="Recursos" gap={2} onSelect={fetchPublicity}>
            <Typography variant="h5">Recursos</Typography>
            <ul>
              {Object.entries({
                needsComputerCenterSupport:
                  "Requiere apoyo del personal del Centro de Cómputo",
                needsConductor: "Requiere maestro de obras",
                needsNotifyUVPress: "Requiere notificar a la Prensa UV",
                needsParking: "Requiere estacionamiento",
                needsWeekend: "Requiere acceso el fin de semana",
              }).map(
                ([key, value]) =>
                  FEIEvent[key] > 0 && (
                    <li key={key}>
                      <Typography variant="body1">{value}</Typography>
                    </li>
                  )
              )}
            </ul>

            <InfoItem
              label={"Número estimado de participantes externos"}
              value={FEIEvent.numExternalParticipants}
            ></InfoItem>
            <InfoItem
              label={"Requisitos técnicos del Centro de Cómputo"}
              maxWidth={"auto"}
              value={FEIEvent.computerCenterRequirements}
            ></InfoItem>
            <Typography variant="h5">Publicidad</Typography>

            {fetchedPublicity && publicity ? (
              <List>
                {publicity.map((publicity, index) => (
                  <FileItem key={index} fileObject={publicity} />
                ))}
              </List>
            ) : (
              <Stack alignItems={"center"} gap={2}>
                <Typography color={"text.secondary"}>
                  {fetchedPublicity && !publicity
                    ? "Sin publicidad"
                    : "Obteniendo publicidad..."}
                </Typography>
              </Stack>
            )}
          </Stack>

          <Stack label="Adicional" gap={2}>
            <Typography variant="h5">Comentarios adicionales</Typography>
            <InfoItem label={""} value={FEIEvent.additional}></InfoItem>
          </Stack>
        </BasicTabs>
      )}
    </>
  );
}
