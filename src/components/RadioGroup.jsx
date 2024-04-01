import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function RowRadioButtonsGroup( {onRadioChange} ) {
  const [value, setValue] = React.useState(0);
  const handleChange = (event) => {
    onRadioChange(event.target.value);
  }
  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Subtitulo</FormLabel>
      <RadioGroup
        column='true'
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        onChange={handleChange}
      >
        <FormControlLabel value="3" control={<Radio />} label="Sí" />
        <FormControlLabel value="1" control={<Radio />} label="No" />
        <FormControlLabel value="2" control={<Radio />} label="En parte" />

      </RadioGroup>
    </FormControl>
  );
}