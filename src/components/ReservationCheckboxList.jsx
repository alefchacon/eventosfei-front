import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import ReservationCard from "./ReservationCard";

export default function CheckboxList({
  label = "lav",
  max = null,
  required = false,
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
  const [checked, setChecked] = React.useState([{ id: 0 }]);

  React.useEffect(() => {
    console.log(items.at(0));
    setChecked([items.at(0).id]);
  }, [items.length > 1]);

  const handleToggle = (value) => () => {
    console.log(value);
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    const tryingToAdd = newChecked.indexOf(value) === -1;

    if (max !== null && newChecked.length === max && tryingToAdd) {
      return;
    }

    if (required && newChecked.length === 1 && !tryingToAdd) {
      return;
    }

    const noneChecked = currentIndex === -1;

    if (noneChecked) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    console.log(newChecked);
    setChecked(newChecked);
  };

  return (
    <Stack>
      <FormControl>
        <FormLabel>{label}</FormLabel>
        <List sx={{ bgcolor: "background.paper" }}>
          {items.map((item) => {
            const labelId = `checkbox-list-label-${item.id}`;

            return (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  role={undefined}
                  onClick={handleToggle(item.id)}
                  dense
                  divider
                >
                  <Stack
                    direction={{ sm: "row", xs: "row-reverse" }}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={{ sm: "start", xs: "space-between" }}
                    width={"100%"}
                  >
                    <Stack>
                      <Checkbox
                        edge="start"
                        checked={checked.indexOf(item.id) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </Stack>

                    <ReservationCard item={item}></ReservationCard>
                  </Stack>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </FormControl>
    </Stack>
  );
}