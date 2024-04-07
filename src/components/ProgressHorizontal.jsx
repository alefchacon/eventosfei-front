import {useState, useEffect} from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const marks = [
  {
    value: 0,
  },
  {
    value: 1,
  },
  {
    value: 2,
  },
  {
    value: 3,
  },
  {
    value: 4,
  },
];


export default function Progress({props, changePage }) {

  const handleChange = (event, newValue) => {
    changePage(4 - newValue); // Call the parent's callback function with the new value
  };


  return (
    <div className='progress-horizontal'>
    <Box 
      display={'flex'}
      justifyContent={'center'}
      justifyItems={'center'}
      alignContent={'center'}
      alignItems={'center'}
      bgcolor={'white'}
      margin={1.5}
      padding={3}
    >
      <Slider
        onChangeCommitted={ handleChange }
        aria-label="Custom marks"
        defaultValue={0}
        min={0}
        step={1}
        max={4}
        valueLabelDisplay="off"
        marks={marks}
        sx={{
          width: '80%',
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

            color: 'primary.main', // Custom color for the label
          },
          // Custom styling for the thumb to ensure it doesn't get overshadowed
          '& .MuiSlider-thumb': {
            width: '6vh',
            height: '6vh',
            marginLeft: '20px'
          },
          // Make sure the rail doesn't overshadow the marks

        }}
      />
    </Box>
    </div>
  );
}
