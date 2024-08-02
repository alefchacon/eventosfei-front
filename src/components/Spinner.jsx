import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function Spinner({
  onClick,
  name = "valueName",
  label = "Número",
  step = 1,
  min = 0,
  max = 1000000,
}) {
  const [value, setValue] = useState(min);

  const handleValueChange = (valueToAdd) => {
    if (value + valueToAdd < min || value + valueToAdd > max) {
      return;
    }
    const newValue = value + valueToAdd;
    setValue(newValue);
    onClick(name, newValue);
  };

  return (
    <>
      <FormControl>
        <Stack direction={"column"}>
          <FormLabel>{label}</FormLabel>
          <Stack direction={"row"}>
            <Button variant="outlined" onClick={() => handleValueChange(-step)}>
              <Typography variant="h6">-</Typography>
            </Button>
            <TextField type="number" value={value} fullWidth></TextField>
            <Button variant="outlined" onClick={() => handleValueChange(step)}>
              <Typography variant="h6">+</Typography>
            </Button>
          </Stack>
        </Stack>
      </FormControl>
    </>
  );
}
