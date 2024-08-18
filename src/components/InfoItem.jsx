import { Typography, Button, Stack, ListItem, List } from "@mui/material";

export default function InfoItem({
  label = "label",
  value = "N/A",
  maxWidth = "auto",
}) {
  return (
    <ListItem disableGutters>
      <Stack display={"flex"} width={maxWidth} maxWidth={maxWidth}>
        <Typography color={"text.secondary"}>{label}</Typography>
        <Stack bgcolor={"lightgray"} padding={"0.77em"} borderRadius={1}>
          {value ? value : "N/A"}
        </Stack>
      </Stack>
    </ListItem>
  );
}
