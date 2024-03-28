import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function RowRadioButtonsGroup() {
  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Subtitulo</FormLabel>
      <RadioGroup
        column
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value="female" control={<Radio />} label="Opción 1" />
        <FormControlLabel value="male" control={<Radio />} label="Opción 2" />
        <FormControlLabel value="other" control={<Radio />} label="Opción 3" />

      </RadioGroup>
    </FormControl>
  );
}