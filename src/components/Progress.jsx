import * as React from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const marks = [
  {
    value: 4,
  },
  {
    value: 3,
  },
  {
    value: 2,
  },
  {
    value: 1,
  },
  {
    value: 0,
  },
];


export default function Progress({ changePage }) {

  const handleChange = (event, newValue) => {
    changePage(newValue); // Call the parent's callback function with the new value
  };

  return (
    <Box 
      height={300} 
      sx={{
        height: '60vh', 
        padding: 5,
        bgcolor: 'green',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <Typography
        sx = {{
          paddingBottom: '50px'
        }}
      >
        Progreso
      </Typography>
      <Slider
        onChangeCommitted={ handleChange }
        track='inverted'
        orientation="vertical"
        aria-label="Custom marks"
        defaultValue={4}
        min={0}
        step={1}
        max={4}
        valueLabelDisplay="off"
        marks={marks}
        sx={{
          // Increase the size of the marks
          '& .MuiSlider-mark': {
            width: '5vh',
            height: '5vh',
            borderRadius: '50%',
            backgroundColor: '#a7caed',
            '&.MuiSlider-markActive': {
              opacity: 1,
              backgroundColor: 'primary.main', // Custom color for the active mark
            },
          },
          // Adjust the mark label position if necessary
          '& .MuiSlider-markLabel': {
            marginLeft: '12px',
            marginBottom: '15px',

            color: 'primary.main', // Custom color for the label
          },
          // Custom styling for the thumb to ensure it doesn't get overshadowed
          '& .MuiSlider-thumb': {
            width: '6vh',
            height: '6vh',
            marginBottom: '2vh'
          },
          // Make sure the rail doesn't overshadow the marks
          '& .MuiSlider-rail': {
            width: '5px',
          },
        }}
      />
    </Box>
  );
}
