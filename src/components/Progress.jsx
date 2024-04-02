import * as React from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

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
        height: '40vh', 
        padding: 5,
        width: 30,
        //bgcolor: 'green',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
      }}>
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
            width: '3vh',
            height: '3vh',
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
            width: '4vh',
            height: '4vh',
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
