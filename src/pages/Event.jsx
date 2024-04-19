import {
  useEffect, 
  useState
} from 'react';

import {
  useParams
} from 'react-router-dom';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Evaluation from '../pages/Evaluation'
import Button from '@mui/material/Button';
import EventResponseMobile from '../components/EventResponseMobile.jsx'

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Event() {
  const [value, setValue] = useState(0);
  const [showEventResponseMobile, setShowEventResponseMobile] = useState(false)

  let { eventId } = useParams();

  useEffect(() => {
    const updateOrientation = () => {
      setShowEventResponseMobile(window.innerWidth < 600);
    };

    window.addEventListener('resize', updateOrientation);

    updateOrientation();
    return () => window.removeEventListener('resize', updateOrientation);
  }, []);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
        <Box sx={{ width: '100%' }} >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Button>{eventId}</Button>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant='scrollable' scrollButtons>
                    <Tab label="Organizador" {...a11yProps(0)} />
                    <Tab label="Evento" {...a11yProps(1)} />
                    <Tab label="Logística" {...a11yProps(2)} />
                    <Tab label="Espacios" {...a11yProps(3)} />
                    <Tab label="Recursos" {...a11yProps(4)} />
                    <Tab label="Difusión" {...a11yProps(5)} />
                    <Tab label="Comentarios" {...a11yProps(6)} />
                    <Tab label="Evaluación" {...a11yProps(7)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                Item One
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                Item Two
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                Three
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                Four
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
                Four
            </CustomTabPanel>
            <CustomTabPanel value={value} index={5}>
                Four
            </CustomTabPanel>
            <CustomTabPanel value={value} index={6}>
                Four
            </CustomTabPanel>
            <CustomTabPanel value={value} index={7}>
                <Evaluation></Evaluation>
            </CustomTabPanel>
        </Box>
        
        <EventResponseMobile/>
    </>
  );
}