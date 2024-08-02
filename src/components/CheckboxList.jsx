import { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";

export default function CheckboxList({
  label = "lav",
  max = null,
  required = false,
  useId = false,
  error = false,
  helperText = "Debe seleccionar al menos una opción",
  selectedValues = [{}],
  selectable = true,
  other = false,
  onTouch,
  name = "name",
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
  const [checked, setChecked] = useState([]);

  const handleToggle = (selectedItem) => {
    const currentIndex = checked.findIndex(
      (item) => item.id === selectedItem.id
    );
    const newChecked = [...checked];

    const tryingToAdd =
      newChecked.findIndex((item) => item.id === selectedItem.id) === -1;

    if (max !== null && newChecked.length === max && tryingToAdd) {
      return;
    }

    if (required && newChecked.length === 0 && !tryingToAdd) {
      return;
    }

    const noneChecked = currentIndex === -1;

    if (noneChecked) {
      newChecked.push(selectedItem);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    selectedValues.splice(0, selectedValues.length, ...newChecked);
    onTouch(name, true, true);
  };

  return (
    <FormControl error={Boolean(error)}>
      <FormLabel required={required}>{label}</FormLabel>
      <FormHelperText>{helperText}</FormHelperText>
      {items.length > 0 ? (
        <List id={name} sx={{ bgcolor: "background.paper" }}>
          {items.map((item) => {
            const labelId = `checkbox-list-label-${item.id}`;

            return (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  role={undefined}
                  onClick={() => handleToggle(item)}
                  dense
                  divider
                >
                  <Stack
                    direction={{ sm: "row", xs: "row-reverse" }}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    width={"100%"}
                  >
                    {selectable && (
                      <Checkbox
                        edge="start"
                        checked={
                          checked.findIndex((_item) => _item.id === item.id) !==
                          -1
                        }
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    )}

                    <ListItemText id={labelId} primary={`${item.name}`} />
                  </Stack>
                </ListItemButton>
              </ListItem>
            );
          })}
          {other && (
            <ListItem divider>
              <TextField fullWidth label={"Otro"}></TextField>
            </ListItem>
          )}
        </List>
      ) : (
        <Typography>N/A</Typography>
      )}
    </FormControl>
  );
}
