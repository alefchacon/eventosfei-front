import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';


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
    >
      <Typography component="legend">{question}</Typography>
      <Rating
        name="simple-controlled"
        value={value}
        size="large"
        onChange={(event, newRating) => {
          setValue(newRating);
          sendRatingToParent(newRating)
        }}
      />
    </Box>
  );
}