import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
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
}) {
  const [showChildren, setShowChildren] = useState(false);

  const handleChange = (e) => {
    const boolValue = e.target.value === "true";
    setShowChildren(boolValue);
    console.log(showChildren);
  };

  return (
    <>
      <FormControl>
        <FormLabel id={name} required={required}>
          {label}
        </FormLabel>
        <RadioGroup
          aria-labelledby={name}
          name={name}
          row={false}
          defaultValue={false}
          value={showChildren}
          onChange={handleChange}
        >
          <FormControlLabel
            value={true}
            control={<Radio />}
            label={positiveLabel}
          />
          <FormControlLabel
            value={false}
            control={<Radio />}
            label={negativeLabel}
          />
        </RadioGroup>
        {showChildren && (
          <Stack gap={3} paddingTop={3}>
            {children}
          </Stack>
        )}
      </FormControl>
    </>
  );
}
