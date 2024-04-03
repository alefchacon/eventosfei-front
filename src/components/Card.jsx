import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function EventCard(props, key) {
  const {
    nombre,
    status = "Estado",
    organizer = "Nombre del organizador",
    program = "Programa educativo",
    schedule = "31 de diciembre del 9999 - 23:59 hrs",
    space = "Espacio",
  } = props.props 
  return (
    <Card sx={{ minWidth: '50%', maxHeight: 250 }}>
      <CardContent sx={{ mb: -3 }}>
        <Container disableGutters={true} sx = {{ padding: 0, display: 'flex', justifyContent: 'space-between'}}>
          <Typography variant="h6" component="div">
            <a href="">{nombre}</a>
          </Typography>
          <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
            {status}
          </Typography>
        </Container>
        <Typography color="text.primary">
          Organizador: {organizer}
        </Typography>
        <Typography color="text.primary">
          {program}
        </Typography>
        <Typography color="text.primary">
          {schedule}
        </Typography>
        <Typography  color="text.primary">
          {space}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end'}}>
        <Button size="medium">Editar</Button>
        <Button size="medium" color='error'>Cancelar</Button>
      </CardActions>
    </Card>
  );
}