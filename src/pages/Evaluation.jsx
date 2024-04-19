import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import RadioGroup from '../components/RadioGroup.jsx'
import UploadArea from '../components/UploadArea.jsx'
import Rating from '../components/Rating.jsx'
import Progress from '../components/Progress.jsx'
import ProgressHorizontal from '../components/ProgressHorizontal.jsx'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CreateEvaluation from '../api/EvaluationService.js';
import ItemUpload from '../components/ItemUpload.jsx';
import TextArea from '../components/TextArea.jsx';
import Stack from '@mui/material/Stack';
import CustomToggleButton from '../components/ToggleButton.jsx';
import Toolbar from '@mui/material/Toolbar'
import Divider from '@mui/material/Divider'
import CardActionArea from '@mui/material/CardActionArea'
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import { evaluationSchema } from '../validation/modelSchemas/evaluationSchema.js';

import Typography from '@mui/material/Typography';

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

          <Box sx={{ p: 3 }}>
            <div>{children}</div>
          </Box>
        
      </div>
    );
  }

export default function Form () {

    const [value, setValue] = useState(0);

    const [attentionRating, setAttentionRating] = useState(0);
    const [spaceRating, setSpaceRating] = useState(0);
    const [computerCenterRating, setComputerCenterRating] = useState(0);
    const [resourcesRating, setResourcesRating] = useState(0);
    const [communicationRating, setCommunicationRating] = useState(0);

    const [showProgressHorizontal, setShowProgressHorizontal] = useState(false)

    useEffect(() => {
      const updateOrientation = () => {
        setShowProgressHorizontal(window.innerWidth < 900);
      };
  
      window.addEventListener('resize', updateOrientation);
  
      updateOrientation();
  
      return () => window.removeEventListener('resize', updateOrientation);
    }, []);

    const handleChangePage = (pageIndex) => {
        if (pageIndex > -1 && pageIndex < 5 ){
            setValue(pageIndex)

        }
    };

    const { 
        values, 
        errors, 
        touched,
        handleBlur, 
        handleChange, 
        handleSubmit,
        isSubmitting
      } = useFormik ({
        initialValues: {
            calificacionAtencion: 0,
            razonCalificacionAtencion: '',
        },
        validationSchema: evaluationSchema,
      });

return (
    <>
        <Stack direction={{md: 'row', xs: 'column'}} >
            <Box
                noValidate
                autoComplete="off"
                flexGrow={1}
                className='form-box'

            >
                <form autoComplete="off" onSubmit={handleSubmit}>

                    <CustomTabPanel value={value} index={4}>
                        <div className="form-page">
                        <Typography variant='h5'>Coordinación de Eventos Académicos</Typography>

                            <Rating
                                question="¿Cómo calificaría la atención recibida por parte de la Coordinación de Eventos Académicos?                            " 
                                setRating={setAttentionRating}></Rating>
                            <Toolbar></Toolbar>
                            <Stack
                                spacing={1}>
                                <Typography variant='p'>Por favor, explique los factores que contribuyeron a su calificación anterior:</Typography>
                                <TextField 
                                    id= 'razonCalificacionAtencion'
                                    name='razonCalificacionAtencion'
                                    variant='filled' 
                                    label='Razón de la calificación'
                                    multiline
                                    maxRows={3}
                                    
                                    value={values.razonCalificacionAtencion}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(errors.razonCalificacionAtencion) && touched.razonCalificacionAtencion}
                                    helperText={touched.razonCalificacionAtencion && errors.razonCalificacionAtencion}
                                    ></TextField>
                            </Stack>
                            <Toolbar></Toolbar>


                            <Typography variant='p'>¿La comunicación fue clara y oportuna?</Typography>
                            <CustomToggleButton options={["Sí", "No", "En parte"]}></CustomToggleButton>

                            <Toolbar></Toolbar>
                            <Stack
                                spacing={2}>
                                <Typography variant='p'>¿Hubo algún aspecto en el que el apoyo de la Coordinación de Eventos pudiera haber mejorado? (Describa brevemente):</Typography>
                                <TextField 
                                    variant='filled' 
                                    label='Mejoras'
                                    multiline
                                    maxRows={3}></TextField>
                            </Stack>

                        </div>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={3}>
                        <div className="form-page">
                            <Typography variant='h5'>Espacio</Typography>
                            <Rating
                                question="¿Cómo calificaría el espacio donde se llevó acabo el evento, en términos de cumplir con sus expectativas y requisitos?" 
                                setRating={setAttentionRating}></Rating>
                            <Stack
                                spacing={2}>
                                <Typography variant='p'>¿Hubo algún problema relacionado con el espacio (por ejemplo, capacidad, comodidad, equipamiento, limpieza)? (Describa brevemente):</Typography>
                                <TextField 
                                    variant='filled' 
                                    label='Mejoras'
                                    multiline
                                    maxRows={3}></TextField>
                            </Stack>
                        </div>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        <Stack className="form-page" spacing={5}>
                            <Typography variant='h5'>Apoyo en el Centro de Cómputo</Typography>
                            <Rating
                                question="¿Cómo calificaría la eficiencia del apoyo del Centro de Cómputo para la atención de su evento?" 
                                setRating={setAttentionRating}></Rating>
                            <Stack
                                spacing={2}>
                                <Typography variant='p'>Por favor, explique los factores que contribuyeron a su calificación anterior:</Typography>
                                <TextField 
                                    variant='filled' 
                                    label='Factores'
                                    multiline
                                    maxRows={3}></TextField>
                            </Stack>
                            <Rating
                                question="¿Cómo calificaría la eficiencia del apoyo del Centro de Cómputo para la atención de su evento?" 
                                setRating={setAttentionRating}></Rating>
                            <Stack
                                spacing={2}>
                                <Typography variant='p'>Por favor, explique los factores que contribuyeron a su calificación anterior:</Typography>
                                <TextField 
                                    variant='filled' 
                                    label='Factores'
                                    multiline
                                    maxRows={3}></TextField>
                            </Stack>

                            <Stack
                                spacing={2}>
                                <Typography variant='p'>¿Hubo algún aspecto en el que el apoyo técnico pudiera haber mejorado? (Describa brevemente): </Typography>
                                <TextField 
                                    variant='filled' 
                                    label='Mejoras'
                                    multiline
                                    maxRows={3}></TextField>
                            </Stack>
                        </Stack>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <Typography variant='h5'>Evidencias del evento</Typography>
                        <Typography variant='p'>Por favor, si cuenta con ellos, comparta evidencias de la realización del evento (por ejemplo, fotografías, videos, listas de asistencia, etc.)</Typography>

                        <UploadArea></UploadArea>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={0}>
                        <div className="form-page">
                            <Typography variant='h5'>Comentarios Adicionales</Typography>
                            <Typography variant='p'>Por favor, comparta cualquier comentario que quiera agregar sobre la organización y ejecución del evento: </Typography>
                            <TextField 
                                variant='filled' 
                                label='Comentario adicional'
                                multiline
                                maxRows={3}></TextField>
                        </div>
                    </CustomTabPanel>
                    <Stack direction={'row'} padding={3} display={'flex'}  justifyContent={'flex-end'} spacing={2}>
                        <Button onClick={() => handleChangePage(value+1)}>Regresar</Button>
                        <Button variant='outlined' onClick={() => handleChangePage(value-1)}>Siguiente</Button>
                        {value==0 && <Button variant='contained' type='submit'>Enviar</Button>}
                    </Stack>

                </form>

            </Box>

                {!showProgressHorizontal && <Progress value={value} changePage={handleChangePage}></Progress>}
        </Stack>
         {showProgressHorizontal && <ProgressHorizontal value={value} changePage={handleChangePage}></ProgressHorizontal> }
    </>
    );
}