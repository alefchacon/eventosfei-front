import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { GetCronogram } from "../api/CronogramService.js";
import { GetPublicity } from "../api/PublicityService.js";

import GetFullDateString from "../util/GetFullDateString.js";

import moment from "moment";
import CheckboxList from "../components/CheckboxList.jsx";
import ReservationCheckboxList from "../components/ReservationCheckboxList.jsx";

import { jsPDF } from "jspdf";

import { Typography, Button, Stack, ListItem, List } from "@mui/material";

import FileItem from "../components/FileItem.jsx";

import SendIcon from "@mui/icons-material/Send";
import { useIsLoading } from "../providers/LoadingProvider.jsx";

import Evaluation from "../pages/Evaluation";
import EventResponseMobile from "../components/EventResponseMobile.jsx";
import NotificationResponse from "../components/NotificationResponseRedux.jsx";
import DialogContentText from "@mui/material/DialogContentText";

import BasicTabs from "../components/Tabs.jsx";

import { GetEventById } from "../api/EventService.js";
import EvaluationView from "./EvaluationView.jsx";

import { useNotices } from "../providers/NoticeProvider.jsx";

import { useAuth } from "../providers/AuthProvider.jsx";
import { idRol } from "../validation/enums/idRol.js";
import { estado } from "../validation/enums/estado.js";
import { stringConstants } from "../validation/enums/stringConstants.js";

import InfoItem from "./InfoItem.jsx";

export default function NoticeView({ notice }) {
  return (
    <>
      <Typography variant="h5">Respuesta</Typography>

      <InfoItem label={"Estado"} value={notice.status.name}></InfoItem>
      <InfoItem label={"Observaciones"} value={notice.response}></InfoItem>
    </>
  );
}
