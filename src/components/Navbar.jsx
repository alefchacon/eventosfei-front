import { Fragment, useState } from 'react'
import '.././App.css'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { Hidden } from '@mui/material';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";


function Navbar() {
    return (
        <div className='sidebar' >
    <Box sx={{ flexGrow: 1, textOverflow: 'ellipsis', maxWidth: 360, bgcolor: "--main-blue"}}>
        <nav aria-label="main mailbox folders">
            <List>
            <ListItem disablePadding >
                <ListItemButton>
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Calendario"  secondary="asdf"  />
                </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
                <ListItemButton>
                <ListItemIcon>
                    <DraftsIcon />
                </ListItemIcon>
                <ListItemText primary="Notificaciones" />
                </ListItemButton>
            </ListItem>

            <Link to="/miseventos">
                <ListItem disablePadding>
                    <ListItemButton>
                    <ListItemIcon>
                        <DraftsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Eventos" />
                    </ListItemButton>
                </ListItem>
            </Link>

            <Link to="/Evaluaciones">
                <ListItem disablePadding>
                    <ListItemButton>
                    <ListItemIcon>
                        <DraftsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Evaluaciones" />
                    </ListItemButton>
                </ListItem>
            </Link>

            </List>
        </nav>
        <Divider />
        <nav aria-label="secondary mailbox folders">
            <List>
            <ListItem disablePadding>
                <ListItemButton>
                <ListItemText primary="Trash" />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component="a" href="#simple-list">
                <ListItemText primary="Spam" />
                </ListItemButton>
            </ListItem>
            </List>
        </nav>
    </Box>
        </div>
    );
}

export default Navbar;