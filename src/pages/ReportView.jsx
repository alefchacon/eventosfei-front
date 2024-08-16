import { useEffect, useState, useRef } from "react";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import html2pdf from "html2pdf.js";

import FileItem from "../components/FileItem";
import { GetEvidencesFor } from "../api/EvidenceService";
import { useNotices } from "../providers/NoticeProvider";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CardEvent from "../components/CardEvent";
import CircularProgress from "@mui/material/CircularProgress";

import { useIsLoading } from "../providers/LoadingProvider";

//import { events } from "./events";

//const event = events[0];

function createData(name, calories) {
  return { name, calories };
}

const getRows = (event) => {
  return [
    createData("Descripción", event.description),
    createData("Página", event.page),
    createData("Tipo", event.type?.name),
    createData("Audiencias", event.audiences),
    createData("Ámbito", event.scope),
    createData("Modalidad", event.mode?.name),
    createData("Éje del Programa de Trabajo", event.axi),
    createData("Temática(s)", event.themes),
    createData(
      "Requerimientos técnicos del CC",
      event.computerCenterRequirements
    ),
    createData(
      "Requiere transmisión en vivo",
      event.needsLivestream ? "✔" : "✘"
    ),
    createData("Decoración", event.decoration),
    createData("Participantes estimados", event.numParticipants),
    createData(
      "Participantes externos estimados",
      event.numExternalParticipants
    ),
    createData(
      "Requiere estacionamiento para participantes externos",
      event.needsParking ? "✔" : "✘"
    ),
    createData(
      "Requiere autorización para ingresar el fin de semana",
      event.needsWeekend ? "✔" : "✘"
    ),
    createData("Medios de difusión", event.media),
    createData("Requiere constancias", event.needsRecords ? "✔" : "✘"),
    createData("Presidium", event.presidium),
  ];
};

export default function ReportView({
  reportRef,
  events,
  onFinishReport,
  dateString = "dateString",
}) {
  //
  //const reportRef = useRef(null);
  const [evidences, setEvidencies] = useState([]);
  const [fetched, setFetched] = useState(false);

  const { setIsLoading } = useIsLoading();

  useEffect(() => {
    async function fetchEvidences() {
      const idEvaluaciones = events.map((event) => event["idEvaluacion"]);
      const evidences = (
        await GetEvidencesFor(idEvaluaciones.filter((id) => id))
      ).data;
      setEvidencies(evidences);
      setFetched(true);
    }
    console.log(events);
    setIsLoading(true);
    if (!fetched) {
      fetchEvidences();
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (fetched) {
      convertToPdf();
    }
  }, [fetched]);

  function EventReport({ event }) {
    const rows = getRows(event);
    return (
      <>
        {evidences[10]?.map((evidence, index) => {
          <img
            key={index}
            src={`data:${evidence.type};base64,${evidence.file}`}
            alt="Base64 Image"
          />;
        })}
        <CardEvent props={event}></CardEvent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="left">{row.calories}</TableCell>
                  <TableCell align="left">{row.fat}</TableCell>
                  <TableCell align="left">{row.carbs}</TableCell>
                  <TableCell align="left">{row.protein}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h5" sx={{ pageBreakBefore: "always" }}>
          Evidencias
        </Typography>
        {Object.entries(evidences).length > 0 &&
          evidences[event.idEvaluacion]?.map((evidence, index) => (
            <>
              <Typography variant="h6">Evidencia {index + 1}</Typography>
              <br />
              <img
                src={`data:${evidence.type};base64,${evidence.file}`}
                alt="Base64 Image"
              />
              <div style={{ pageBreakAfter: "always" }}></div>
            </>
          ))}
      </>
    );
  }

  const options = {
    filename: "my-document.pdf",
    margin: 1,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  const convertToPdf = () => {
    const content = reportRef.current.innerHTML;
    setGeneratingPDF(true);
    //reportRef.current.style.display = "block";

    html2pdf()
      .set(options)
      .from(content)
      .save()
      .then(() => {
        onFinishReport();
        //reportRef.current.style.display = "none";
        //setGeneratingPDF(false);
      });
  };

  const [generatingPDF, setGeneratingPDF] = useState(false);

  return (
    <Stack>
      <div ref={reportRef} style={{ display: "none" }}>
        <Stack gap={3}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"start"}
          >
            <div>
              <Typography variant="h4">Reporte de Eventos</Typography>

              <Typography color="text.secondary" variant="h5">
                {dateString}
              </Typography>
            </div>

            <Stack maxWidth={"250px"} justifyContent={"center"}>
              <Typography variant="h4" textAlign={"end"}>
                SAEFEI
              </Typography>
              <Typography variant="caption" textAlign={"end"}>
                Sistema de Administración de Eventos de la Facultad de
                Estadística e Informática
              </Typography>
            </Stack>
          </Stack>
          {events.map((event, index) => (
            <Stack key={index}>
              <EventReport event={event} />
            </Stack>
          ))}
        </Stack>
      </div>
    </Stack>
  );
}
