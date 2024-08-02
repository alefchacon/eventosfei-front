import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";

export default function ConditionalInput({
  children,
  value = false,
  name = "name",
  label = "Opciones",
  required = false,
  positiveLabel = "Sí",
  negativeLabel = "No",
  error = false,
  helperText = "error",
  onBlur,
  onChange,
}) {
  const [showChildren, setShowChildren] = useState(value);

  const handleChange = (e) => {
    const newShowChildren = e.target.value;
    setShowChildren(newShowChildren);
    onChange(name, newShowChildren);

    if (newShowChildren === "1") {
      return;
    }

    for (let child of children) {
      onChange(child.props.name, "");
    }
  };

  return (
    <>
      <FormControl error={error}>
        <FormLabel id={name} required={required}>
          {label}
        </FormLabel>
        {error && <FormHelperText>{helperText}</FormHelperText>}
        <RadioGroup
          aria-labelledby={name}
          name={name}
          row={false}
          defaultValue={false}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
        >
          <FormControlLabel
            value={1}
            control={<Radio />}
            label={positiveLabel}
          />
          <FormControlLabel
            value={0}
            control={<Radio />}
            label={negativeLabel}
          />
        </RadioGroup>
        {showChildren === "1" && (
          <Stack gap={3} paddingTop={3}>
            {children}
          </Stack>
        )}
      </FormControl>
    </>
  );
}
