import { Typography, Button, Stack, ListItem, List } from "@mui/material";

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
