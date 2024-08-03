import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";

import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";

function CustomRadio({ item, onClick }) {
  return (
    <ListItemButton onClick={() => onClick(item.name)} divider dense>
      <Stack
        direction={{ sm: "row", xs: "row-reverse" }}
        display={"flex"}
        alignItems={"center"}
        justifyContent={{ sm: "start", xs: "space-between" }}
        width={"100%"}
        spacing={0.5}
      >
        <FormControlLabel value={item.name} control={<Radio edge="start" />} />
        <ListItemText id={item.id} primary={`${item.name}`} />
      </Stack>
    </ListItemButton>
  );
}

export default function RadioList({
  onClick,
  label = "lav",
  valueName: name = "name",
  onTouch,
  error = true,
  selectedValue = "",
  helperText = "Debe seleccionar al menos una opción",

  items = [
    { id: 0, name: "Nombre 0" },
    { id: 1, name: "Nombre 1" },
    { id: 2, name: "Nombre 2" },
    { id: 3, name: "Nombre 3" },
    { id: 4, name: "Nombre 4" },
    { id: 5, name: "Nombre 5" },
    { id: 6, name: "Nombre 6" },
    { id: 7, name: "Nombre 7" },
    { id: 8, name: "Nombre 8" },
    { id: 9, name: "Nombre 9" },
    { id: 10, name: "Nombre 10" },
    { id: 11, name: "Nombre 11" },
    { id: 12, name: "Nombre 12" },
  ],
}) {
  const [selected, setSelected] = React.useState(selectedValue);

  const handleSelection = (value) => {
    setSelected(value);
    onClick(name, value);
    onTouch(name, true, true);
  };

  return (
    <FormControl error={error}>
      <FormLabel id="demo-radio-buttons-group-label">{label}</FormLabel>
      <FormHelperText>{helperText}</FormHelperText>

      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        row={false}
        value={selected}
      >
        {items.map((item, index) => {
          return (
            <CustomRadio key={index} item={item} onClick={handleSelection} />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
}
