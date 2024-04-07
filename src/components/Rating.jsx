import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import '../App.css'
import Stack  from '@mui/material/Stack';

export default function BasicRating(props, { setRating }) {

  const {question = "Pregunta", asdf} = props

  const [value, setValue] = React.useState(0);

  const sendRatingToParent = (rating) => {
    setRating(rating);
  };

  return (
    <Box
      sx={{
        '& > legend': { mt: 2 },
      }}
      display={'flex'}
      flexDirection={'column'}
    >
      <Typography component="legend">{question}</Typography>
      <Stack display={'flex'} direction={'row'}>
        <Box flexGrow={1}></Box>
        <Rating
          name="simple-controlled"
          value={value}
          size="large"
          flexGrow={2}
          sx={{
            fontSize: "2.5rem",
            color: '#18529d'
          }}
          onChange={(event, newRating) => {
            setValue(newRating);
            sendRatingToParent(newRating)
          }}
        />
        <Box flexGrow={1}></Box>
      </Stack>
    </Box>
  );
}