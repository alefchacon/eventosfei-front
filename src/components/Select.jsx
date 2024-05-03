import { useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { FormHelperText } from "@mui/material";
import Select from "@mui/material/Select";

export default function BasicSelect({
  label = "label",
  items = [
    { id: 1, name: "one" },
    { id: 2, name: "two" },
  ],

  //FORMIK:
  name,
  id,
  disabled = false,
  value,
  onChange = null,
  onBlur = null,
  touched,
  errors,
}) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl
        fullWidth
        disabled={disabled}
        error={touched && Boolean(errors)}
      >
        <InputLabel id="select-label">{label}</InputLabel>
        <Select
          labelId="select"
          name={name}
          id={id}
          label={label}
          disabled={disabled}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        >
          {items.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
        {touched && errors ? (
          <FormHelperText>{errors}</FormHelperText>
        ) : (
          <FormHelperText> </FormHelperText>
        )}
      </FormControl>
    </Box>
  );
}
