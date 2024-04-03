import { useState } from 'react'

import './App.css'
import Evaluation from './pages/Evaluation.jsx'
import Eventos from './pages/Eventos.jsx'
import './index.css'
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";
import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import DraftsIcon from '@mui/icons-material/Drafts';

import Event from './pages/Event.jsx'

const drawerWidth = 240;


function App(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [currentSection, setCurrentSection] = React.useState('Calendario');
  const [selectedFEIEvent, setSelectedFEIEvent] = React.useState();

  const handleFEIEventSelection = (FEIEvent) =>{
    setSelectedFEIEvent(FEIEvent)
    console.log(FEIEvent)
  }

  const handleSelection = (event) => {
    setCurrentSection(event.currentTarget.id);
  }

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Typography variant='h4' sx={{ padding: '10px'}}>SEAFEI</Typography>
      <Divider />
      <List>
        <Link to="/miseventos" onClick={handleSelection} id='Calendario'>
            <ListItem disablePadding>
                <ListItemButton>
                <ListItemIcon>
                    <DraftsIcon />
                </ListItemIcon>
                <ListItemText primary="Calendario" />
                </ListItemButton>
            </ListItem>
        </Link>
        <Link to="/Notificaciones" onClick={handleSelection} id='Notificaciones'>
            <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                      <DraftsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Notificaciones"/>
                </ListItemButton>
            </ListItem>
        </Link>
        <Link to="/Eventos" onClick={handleSelection} id='Eventos'>
            <ListItem disablePadding>
                <ListItemButton>
                <ListItemIcon>
                    <DraftsIcon />
                </ListItemIcon>
                <ListItemText primary="Eventos" />
                </ListItemButton>
            </ListItem>
        </Link>
        <Link to="/Evaluaciones" onClick={handleSelection} id='Evaluaciones'>
            <ListItem disablePadding>
                <ListItemButton>
                <ListItemIcon>
                    <DraftsIcon />
                </ListItemIcon>
                <ListItemText primary="Evaluación" />
                </ListItemButton>
            </ListItem>
        </Link>


        
      </List>
      <Divider />
      <List>
        {['Otro coso'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '--secondary-blue'
        }}
      >
        <Toolbar >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }  }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {currentSection}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 },  }}
        aria-label="mailbox folders"
        
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

        <div className="content">
          <Routes>
            
            <Route path='/Eventos' element={<Eventos setSelectedFEIEvent={handleFEIEventSelection}/>}> </Route>
            <Route path='/Evaluaciones' element={<Evaluation/>}> </Route>
            <Route path='/Evento' element={<Event/>}> </Route>
          </Routes>
        </div>




    </Box>
  );
}


export default App;