import { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";

import FileItem from "../components/FileItem";
import { GetEvidences } from "../api/EvidenceService";

import { useNotices } from "../providers/NoticeProvider";

export default function EvaluationView({ evaluation }) {
  //
  const [evidences, setEvidencies] = useState([]);

  const { removeNoticeEvent } = useNotices();

  useEffect(() => {
    const fetchEvidence = async () => {
      const response = await GetEvidences(evaluation.id);
      setEvidencies(response.data.data);
    };

    fetchEvidence();

    removeNoticeEvent(evaluation.idEvento);
  }, []);

  function wrapCell(content = "sin contenido") {
    if (isNumeric(content)) {
      return <Rating value={content}></Rating>;
    }

    return (
      <Typography fontSize={{ xs: "small", md: "medium" }}>
        {content}
      </Typography>
    );
  }

  function isNumeric(value) {
    return /^-?\d+$/.test(value);
  }

  function Question({ question, answer }) {
    return (
      <ListItem
        sx={{
          display: "flex",
          flexDirection: "column",

          alignItems: "start",
        }}
      >
        <Typography fontSize={{ xs: "small", md: "medium" }}>
          <b>{question}</b>
        </Typography>
        {wrapCell(answer)}
      </ListItem>
    );
  }

  return (
    <Stack gap={3}>
      <Stack gap={2}>
        <Typography variant={"h6"}>
          Coordinación de Eventos Académicos
        </Typography>
        <Question
          question={
            "¿Cómo calificaría la atención recibida por parte de la Coordinación de Eventos Académicos?"
          }
          answer={evaluation.ratingAttention}
        ></Question>
        <Question
          question={
            "Por favor, explique los factores que contribuyeron a su calificación anterior"
          }
          answer={evaluation.ratingAttentionReason}
        ></Question>
        <Question
          question={
            "¿Hubo algún aspecto en el que el apoyo de la Coordinación de Eventos pudiera haber mejorado? (Describa brevemente)"
          }
          answer={evaluation.improvementsSupport}
        ></Question>
      </Stack>
      <Divider></Divider>
      <Stack gap={2}>
        <Typography variant={"h6"}>Espacio</Typography>
        <Question
          question={
            "¿Cómo calificaría el espacio donde se llevó acabo el evento, en términos de cumplir con sus expectativas y requisitos?"
          }
          answer={evaluation.ratingSpace}
        ></Question>
        <Question
          question={
            "¿Hubo algún problema relacionado con el espacio (por ejemplo, capacidad, comodidad, equipamiento, limpieza)? (Describa brevemente)"
          }
          answer={evaluation.problemsSpace}
        ></Question>
      </Stack>
      <Divider></Divider>
      <Stack gap={2}>
        <Typography variant={"h6"}>Apoyo del Centro de Cómputo</Typography>
        <Question
          question={
            "¿Cómo calificaría la eficiencia del apoyo del Centro de Cómputo para la atención de su evento?"
          }
          answer={evaluation.ratingComputerCenter}
        ></Question>
        <Question
          question={
            "Por favor, explique los factores que contribuyeron a su calificación anterior"
          }
          answer={evaluation.ratingComputerCenterReason}
        ></Question>
        <Question
          question={
            "¿Cómo calificaría la adecuación de los recursos técnicos proporcionados para satisfacer las necesidades del evento?"
          }
          answer={evaluation.ratingResources}
        ></Question>
        <Question
          question={
            "Por favor, explique los factores que contribuyeron a su calificación anterior"
          }
          answer={evaluation.ratingResourcesReason}
        ></Question>
        <Question
          question={
            "¿Hubo algún aspecto en el que el apoyo técnico pudiera haber mejorado? (Describa brevemente)"
          }
          answer={evaluation.improvementsResources}
        ></Question>
      </Stack>
      <Divider></Divider>
      <Stack gap={2}>
        <Typography variant={"h6"}>Apoyo del Centro de Cómputo</Typography>
        <Question
          question={
            "¿Cómo calificaría la eficiencia del apoyo del Centro de Cómputo para la atención de su evento?"
          }
          answer={evaluation.ratingComputerCenter}
        ></Question>
        <Question
          question={
            "Por favor, explique los factores que contribuyeron a su calificación anterior"
          }
          answer={evaluation.ratingComputerCenterReason}
        ></Question>
        <Question
          question={
            "¿Cómo calificaría la adecuación de los recursos técnicos proporcionados para satisfacer las necesidades del evento?"
          }
          answer={evaluation.ratingResources}
        ></Question>
        <Question
          question={
            "Por favor, explique los factores que contribuyeron a su calificación anterior"
          }
          answer={evaluation.ratingResourcesReason}
        ></Question>
        <Question
          question={
            "¿Hubo algún aspecto en el que el apoyo técnico pudiera haber mejorado? (Describa brevemente)"
          }
          answer={evaluation.improvementsResources}
        ></Question>
      </Stack>
      <Divider></Divider>
      <Stack gap={2}>
        <Typography variant={"h6"}>Comentarios Adicionales</Typography>
        <Question
          question={
            "Por favor, comparta cualquier comentario que quiera agregar sobre la organización y ejecución del evento."
          }
          answer={evaluation.additional}
        ></Question>
      </Stack>
      <Divider></Divider>
      <Stack gap={2}>
        <Typography variant={"h6"}>Evidencia</Typography>
        {evidences.map((evidence, index) => (
          <FileItem fileObject={evidence} key={index} />
        ))}
      </Stack>
      <Divider></Divider>
    </Stack>
  );
}
