import { useState } from "react";
import {
  Button,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import SearchList from "../components/SearchList";
import { useDialog } from "../providers/DialogProvider.jsx";
import DialogTypes from "../providers/DialogTypes";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { BorderAll } from "@mui/icons-material";

export default function Reservation() {
  const { showDialog } = useDialog();

  const handleSelection = (space) => {
    showDialog(space.name, DialogTypes.userForm);
  };

  return (
    <>
      <SearchList
        modelName="cosas"
        options={[
          { id: 1, name: "cosa 1" },
          { id: 2, name: "hi" },
          { id: 3, name: "muad dib1!!!!" },
        ]}
        onSelect={handleSelection}
      ></SearchList>

      <ListItem divider>
        <Stack spacing={-1.5}>
          <ListItemText primary="Fecha" />
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              slotProps={{
                textField: {
                  InputProps: { color: "primary" },
                  fullWidth: true,
                  sx: {
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none", // Removes the border
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none", // Ensures the border remains removed on hover
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none", // Ensures the border remains removed on focus
                    },
                  },
                },
              }}
            />{" "}
          </LocalizationProvider>
        </Stack>
      </ListItem>
    </>
  );
}
