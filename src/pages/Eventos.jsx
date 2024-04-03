import { useState, useEffect, useRef } from 'react'

import Card from '../components/Card.jsx'
import { Stack } from '@mui/material';
import GetEvents from '../api/EventApi.js';
import Typography from '@mui/material/Typography';
import CircularProgress from '../components/CircularProgress.jsx';
import { Container } from '@mui/material';

export default function Eventos () {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const itemRef = useRef(items)
    useEffect(() => {

        // Simulate fetching data with static data
        const fetchData = async ()=> {
            try{
                const response = await GetEvents();

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const events = data.data;
                setItems(events);
                setLoading(false);
                //setItems(response)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
      }, []); // Empty dependency array means this effect runs once on mount
      
      //{loading && <CircularProgress></CircularProgress>}
    return (
        <>
            {loading &&
                <Container sx = {{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <CircularProgress></CircularProgress>
                </Container>
            }
            <Stack spacing={2}>
            {items.map((item) => (
                <Card props={item} key={item.idEvento}></Card>
            ))}
            </Stack>
        </>
    )

}