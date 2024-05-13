import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useState } from "react";
import {
  Button,
  ListItem,
  ListItemText,
  ListItemButton,
  TextField,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import moment from "moment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function CustomTimePicker({
  label = "Label",
  defaultTime = moment(),
  disabled = true,
  onAccept,
}) {
  return (
    <>
      <ListItemButton disabled={disabled}>
        <Stack
          spacing={-2}
          width={"100%"}
          display={"flex"}
          justifyContent={"center"}
        >
          <Typography variant="h6">{label}</Typography>

          <TimePicker
            value={defaultTime}
            onAccept={onAccept}
            ampm={false}
            slotProps={{
              textField: {
                InputProps: { color: "primary" },
                fullWidth: true,
                sx: {
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none", // Removes the border
                  },

                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "none", // Ensures the border remains removed on focus
                  },
                  "& .MuiInputBase-input": {
                    padding: "0",
                    paddingTop: "10px",
                  },
                },
              },
            }}
          />
        </Stack>
      </ListItemButton>
    </>
  );
}
