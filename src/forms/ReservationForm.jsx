import { useState } from "react";
import {
  ListItem,
  ListItemText,
  ListItemButton,
  TextField,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import { useDialog } from "../providers/DialogProvider.jsx";
import DialogTypes from "../providers/DialogTypes";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { BorderAll } from "@mui/icons-material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import moment from "moment";

import SearchList from "../components/CustomSelect.jsx";
import CustomTimePicker from "../components/CustomTimePicker.jsx";
import LoadingButton from "../components/LoadingButton.jsx";

export default function Reservation({ onCancel, onSubmit }) {
  const { showDialog } = useDialog();
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const handleSelection = (space) => {
    showDialog(space.name, DialogTypes.userForm);
  };
  const handleOpenDatePicker = () => {
    setOpenDatePicker(!openDatePicker);
    console.log(openDatePicker);
  };

  const options = [
    { id: 1, name: "cosa 1" },
    { id: 2, name: "hi" },
    { id: 3, name: "muad dib1!!!!" },
    { id: 4, name: "cosa 1" },
    { id: 5, name: "hi" },
    { id: 6, name: "muad dib1!!!!" },
    { id: 7, name: "cosa 1" },
    { id: 8, name: "hi" },
    { id: 9, name: "muad dib1!!!!" },
    { id: 10, name: "cosa 1" },
    { id: 11, name: "hi" },
    { id: 12, name: "muad dib1!!!!" },
    { id: 13, name: "cosa 1" },
    { id: 14, name: "hi" },
    { id: 15, name: "muad dib1!!!!" },
    { id: 16, name: "cosa 1" },
    { id: 17, name: "hi" },
    { id: 18, name: "muad dib1!!!!" },
  ];

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ListItemButton onClick={handleOpenDatePicker}>
          <Stack spacing={-2} width={"100%"} paddingLeft={5} paddingRight={5}>
            <Typography variant="h6">Fecha</Typography>
            <DatePicker
              open={openDatePicker}
              slotProps={{
                textField: {
                  InputProps: { color: "primary" },
                  fullWidth: true,
                  sx: {
                    "& .MuiInputBase-input": {
                      padding: "0",
                      paddingTop: "10px",
                    },

                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none", // Removes the border
                    },

                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none", // Ensures the border remains removed on focus
                    },
                  },
                },
              }}
            />{" "}
          </Stack>
        </ListItemButton>

        <Divider></Divider>

        <CustomTimePicker label="Inicio"></CustomTimePicker>
        <Divider></Divider>

        <CustomTimePicker label="Fin"></CustomTimePicker>
        <Divider></Divider>
      </LocalizationProvider>
      <Stack
        width={"100%"}
        paddingLeft={7}
        paddingTop={2}
        overflow={"auto"}
        maxHeight={"300px"}
      >
        <FormControl fullWidth>
          <Typography variant="h6">Espacios</Typography>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
          >
            {options.map((option) => (
              <FormControlLabel
                key={option.id}
                value={option.id}
                control={<Radio />}
                label={option.name}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Stack>
      <Stack
        direction={"row"}
        spacing={3}
        justifyContent={"end"}
        paddingTop={5}
      >
        <Button autoFocus onClick={onCancel}>
          Cerrar
        </Button>
        <LoadingButton label="Solicitar"></LoadingButton>
      </Stack>
    </>
  );
}
