import * as React from 'react';
import TextField from '@mui/material/TextField';
import '.././App.css'
import RadioGroup from './RadioGroup.jsx'
import Rating from './Rating.jsx'
import Box from '@mui/material/Box';

export default function Form () {
    return (
            <Box
                component="form"
                sx={{
                    display: 'flex',
                    flexDirection: 'column'
                }}
                noValidate
                autoComplete="off"
            >
                <Rating></Rating>
                <TextField
                    id="standard-multiline-flexible"
                    label="Multiline"
                    multiline
                    maxRows={4}
                    variant="filled"
                />
                <RadioGroup></RadioGroup>
            </Box>
    );
}