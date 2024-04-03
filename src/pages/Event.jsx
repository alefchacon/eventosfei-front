import { useState, useEffect, useRef } from 'react'

import Card from '../components/Card.jsx'
import { Stack } from '@mui/material';
import GetEvents from '../api/EventApi.js';
import Typography from '@mui/material/Typography';
import CircularProgress from '../components/CircularProgress.jsx';
import { Container } from '@mui/material';
import Tabs from '../components/Tabs.jsx';

export default function Eventos ({FEIEvent}) {
    console.log(FEIEvent)
    return (
        <>
            <Typography variant='h5'> {FEIEvent.name} </Typography>
            <Tabs children={"asdf"}></Tabs>
            
        </>
    );
}