import { useState, useEffect, useRef } from 'react'
import ProgressNotificationHorizontal from '../components/ProgressNotificationHorizontal.jsx';
import ProgressNotification from '../components/ProgressNotification.jsx';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormik } from 'formik';
import { TextField } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Fragment } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

import axios from 'axios';
import { backendUrl } from '../api/urls.js';


import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

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



function NewNotification() {

    useEffect(() => {
        getDatos()
    }, [])

    const submitNotification = async (values) => {
        try {

            values.fechaInicio = fechaInicio.format("YYYY-MM-DD")
            values.fechaFin = fechaFin.format("YYYY-MM-DD")
            values.cronograma = cronograma

            const formData = new FormData();
            formData.append('nombreOrganizador', "Uriel")
            formData.append('puesto', "Admin")
            formData.append('email', "urielvh84@gmail.com")
            formData.append('nombre', values.nombre);
            formData.append('idPrograma', values.idPrograma);
            formData.append('idTipo', values.idTipo);
            formData.append('descripcion', values.descripcion);
            formData.append('inicio', values.fechaInicio);
            formData.append('fin', values.fechaFin);
            formData.append('numParticipantes', values.numParticipantes);
            formData.append('idModalidad', values.idModalidad);
            // formData.append('idEspacio', values.idEspacio);
            formData.append('idPlataforma', values.idPlataforma);
            formData.append('requisitosCentroComputo', values.requisitosCentroComputo);
            formData.append('numParticipantesExternos', values.numParticipantesExternos);
            formData.append('requiereEstacionamiento', values.requiereEstacionamiento);
            formData.append('requiereFinDeSemana', values.requiereFinDeSemana);
            formData.append('requiereMaestroDeObra', values.requiereMaestroDeObra);
            formData.append('requiereNotificarPrensaUV', values.requiereNotificarPrensaUV);
            formData.append('adicional', values.adicional);
            formData.append('idUsuario', 1);
            formData.append('idEstado', values.idEstado);
            formData.append('cronograma', cronograma);


            const response = await axios.post(backendUrl + "/api/eventos", formData)
            console.log(response.data);
            if (material.length != 0) {
                subirMaterial(response.data.evento)
            }

        } catch (error) {
            console.log(error);
        }
    }

    const subirMaterial = async (idEvento) => {
        try {
            for (const element of material) {
                const formData = new FormData();
                formData.append("idEvento", idEvento);
                formData.append("archivo", element);
                const respuesta = await axios.post(backendUrl + "/api/materialDifusion", formData);
                console.log(respuesta.data.message); 
            }
        } catch (error) {
            console.log(error);
        }
    };

    const [espacios, setEspacios] = useState([])
    const [modalidades, setModalidades] = useState([])
    const [plataformas, setPlataformas] = useState([])
    const [programas, setProgramas] = useState([])
    const [tipos, setTipos] = useState([])

    const [cronograma, setCronograma] = useState(null)
    const handleFileChange = (event) => {
        setCronograma(event.target.files[0]);
    };

    const [material, setMaterial] = useState([])
    const handleChangeMultiple = (event) => {
        const files = Array.from(event.target.files);
        setMaterial(files);
    };

    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);

    const [value, setValue] = useState(5);
    const [showProgressHorizontal, setShowProgressHorizontal] = useState(false)
    const [programa, setPrograma] = useState('');
    const [tipo, setTipo] = useState('');
    const uploadInputRef = useRef(null);


    const getDatos = async () => {
        axios.all(
            [
                axios.get(backendUrl + '/api/espacios'),
                axios.get(backendUrl + '/api/modalidades'),
                axios.get(backendUrl + '/api/plataformas'),
                axios.get(backendUrl + '/api/programasEducativos'),
                axios.get(backendUrl + '/api/tipos')
            ]
        ).then(axios.spread((resEspacios, resModalidades, resPlataformas, resProgramas, resTipos) => {
            setEspacios(resEspacios.data)
            setModalidades(resModalidades.data)
            setPlataformas(resPlataformas.data)
            setProgramas(resProgramas.data)
            setTipos(resTipos.data)
        }
        ))
    }

    const {
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting
    } = useFormik({
        initialValues: {
            nombre: '',
            idPrograma: '',
            idTipo: '',
            descripcion: '',
            // fechaFin: null,
            numParticipantes: '',
            idModalidad: '',
            idEspacio: '',
            idPlataforma: '',
            requisitosCentroComputo: '',

            numParticipantesExternos: '',
            requiereEstacionamiento: '',
            requiereFinDeSemana: '',
            requiereMaestroDeObra: '',
            requiereNotificarPrensaUV: '',
            adicional: '',
            idUsuario: 1,
            idEstado: 1,
        },
        // validationSchema: evaluationSchema,
        onSubmit: submitNotification
    });



    // const handleChangeSelect1 = (event) => {
    //     setPrograma(event.target.value);
    // };
    // const handleChangeSelect2 = (event) => {
    //     setTipo(event.target.value);
    // };

    const handleChangePage = (pageIndex) => {
        if (pageIndex > -1 && pageIndex < 6) {
            setValue(pageIndex)

        }
    };

    return (
        <>
            <Stack direction={{ md: 'row', xs: 'column' }} >
                <Box
                    noValidate
                    autoComplete="off"
                    flexGrow={1}
                    className='form-box'

                >
                    <form autoComplete="off" onSubmit={handleSubmit}>
                        {/* Detalles del evento */}
                        <CustomTabPanel value={value} index={5}>
                            <Stack direction="column" spacing={3}>
                                <Typography variant='h5' textAlign="center">Detalles del evento</Typography>
                                <TextField variant='outlined' name='nombre' value={values.nombre} onChange={handleChange} onBlur={handleBlur} label="Nombre del evento:" />
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Programa educativo: </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Programa educativo"
                                        // onChange={handleChangeSelect1}
                                        name='idPrograma'
                                        value={values.idPrograma} onChange={handleChange} onBlur={handleBlur}
                                    >
                                        {
                                            programas.map((programa) => (
                                                <MenuItem value={programa.id} key={programa.id}>{programa.nombre}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Tipo de evento: </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Programa educativo"
                                        name='idTipo'
                                        value={values.idTipo} onChange={handleChange} onBlur={handleBlur}
                                    >
                                        {
                                            tipos.map((tipo) => (
                                                <MenuItem value={tipo.id} key={tipo.id}>{tipo.nombre}</MenuItem>
                                            ))
                                        }
                                        {/* <MenuItem value="academico">Academico</MenuItem>
                                        <MenuItem value="cultural">Cultural</MenuItem>
                                        <MenuItem value="deportivo">Deportivo</MenuItem>
                                        <MenuItem value="mixto">Mixto</MenuItem> */}

                                    </Select>
                                </FormControl>
                                <TextField variant='outlined' name='descripcion' value={values.descripcion} onChange={handleChange} onBlur={handleBlur} label="Descripcion del evento: " multiline maxRows={3} />
                            </Stack>
                        </CustomTabPanel>
                        {/* Detalles logisticos */}
                        <CustomTabPanel value={value} index={4}>
                            <Stack direction={'column'} spacing={3}>
                                <Typography variant='h5' textAlign={'center'}>Detalles logisticos</Typography>
                                <Stack direction={'row'} gap={3} >
                                    <Stack direction={'column'} textAlign={'center'}>
                                        <Typography>Fecha de inicio del evento</Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                                            <DatePicker value={fechaInicio} onChange={(newValue) => setFechaInicio(newValue)} label="Fecha de inicio:" />
                                        </LocalizationProvider>
                                        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['TimePicker']}>
                                                <TimePicker views={['hours']} name='horaInicio' />
                                            </DemoContainer>
                                        </LocalizationProvider> */}
                                    </Stack>
                                    <Stack direction={'column'} textAlign={'center'}>
                                        <Typography>Fecha de  del evento</Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker value={fechaFin} label="Fecha de fin:" name='fechaFin' onChange={(newValue) => setFechaFin(newValue)} />
                                        </LocalizationProvider>
                                        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['TimePicker']}>
                                                <TimePicker views={['hours']} name='horaFin' />
                                            </DemoContainer>
                                        </LocalizationProvider> */}
                                    </Stack>
                                </Stack>
                                <TextField variant='outlined' name='numParticipantes' value={values.numParticipantes} onChange={handleChange} onBlur={handleBlur} label="Numero estimado de participantes: " />
                                <Fragment>
                                    <input ref={cronograma} type="file" accept=".pdf" name="cronograma" id="archivo" onChange={handleFileChange} />
                                    {/* <input
                                        ref={uploadInputRef}
                                        type="file"
                                        accept=".pdf"
                                        style={{ display: "none" }}
                                    />
                                    <Button
                                        onClick={() => uploadInputRef.current && uploadInputRef.current.click()}
                                        variant="contained"
                                    >
                                        Subir cronograma
                                    </Button> */}
                                </Fragment>
                            </Stack>
                        </CustomTabPanel>
                        {/* Espacios del evento */}
                        <CustomTabPanel value={value} index={3}>
                            <Stack spacing={3} direction={'column'}>
                                <Typography variant='h5' textAlign={'center'}>Espacios del evento</Typography>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Modalidad: </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Programa educativo"
                                        name='idModalidad'
                                        value={values.idModalidad} onChange={handleChange} onBlur={handleBlur}
                                    >
                                        {
                                            modalidades.map((modalidad) => (
                                                <MenuItem value={modalidad.id} key={modalidad.id}>{modalidad.nombre}</MenuItem>
                                            ))
                                        }


                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Espacios fisicos: </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="espacios"
                                        name='idEspacio'
                                        value={values.idEspacio} onChange={handleChange} onBlur={handleBlur}
                                    >
                                        {
                                            espacios.map((espacio) => (
                                                <MenuItem value={espacio.id} key={espacio.id}>{espacio.nombre}</MenuItem>
                                            ))
                                        }

                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Plataformas: </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="espacios"
                                        name='idPlataforma'
                                        value={values.idPlataforma} onChange={handleChange} onBlur={handleBlur}
                                    >
                                        {
                                            plataformas.map((plataforma) => (
                                                <MenuItem value={plataforma.id} key={plataforma.id}>{plataforma.nombre}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Stack>
                        </CustomTabPanel>
                        {/* Recursos adicionales */}
                        <CustomTabPanel value={value} index={2}>
                            <Stack direction={'column'} spacing={3}>

                                <Typography variant='h5' textAlign={'center'}>Recursos adicionales</Typography>
                                <Stack direction={'row'} spacing={5} justifyContent={'start'}>
                                    <FormControl>
                                        <FormLabel id="demo-radio-buttons-group-label">¿Requiere estacionamiento?</FormLabel>
                                        <RadioGroup
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            defaultValue=""
                                            name="requiereEstacionamiento"
                                            row
                                            value={values.requiereEstacionamiento} onChange={handleChange} onBlur={handleBlur}
                                        >
                                            <FormControlLabel value="1" control={<Radio />} label="Si" />
                                            <FormControlLabel value="0" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel id="demo-radio-buttons-group-label">¿Requiere ingreso en fin de semana?</FormLabel>
                                        <RadioGroup
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            defaultValue=""
                                            name="requiereFinDeSemana"
                                            row
                                            value={values.requiereFinDeSemana} onChange={handleChange} onBlur={handleBlur}
                                        >
                                            <FormControlLabel value="1" control={<Radio />} label="Si" />
                                            <FormControlLabel value="0" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Stack>
                                <Stack direction={'row'} spacing={5} justifyContent={'start'}>
                                    <FormControl>
                                        <FormLabel id="demo-radio-buttons-group-label">¿Requiere maestro de ceremonias?</FormLabel>
                                        <RadioGroup
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            defaultValue=""
                                            name="requiereMaestroDeObra"
                                            value={values.requiereMaestroDeObra} onChange={handleChange} onBlur={handleBlur}
                                            row

                                        >
                                            <FormControlLabel value="1" control={<Radio />} label="Si" />
                                            <FormControlLabel value="0" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel id="demo-radio-buttons-group-label">¿Requiere notificar a prensa UV?</FormLabel>
                                        <RadioGroup
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            defaultValue=""
                                            name="requiereNotificarPrensaUV"
                                            row
                                            value={values.requiereNotificarPrensaUV} onChange={handleChange} onBlur={handleBlur}
                                        >
                                            <FormControlLabel value="1" control={<Radio />} label="Si" />
                                            <FormControlLabel value="0" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Stack>
                                <TextField name="numParticipantesExternos" value={values.numParticipantesExternos} onChange={handleChange} onBlur={handleBlur} label="Numero de participantes externos: " />
                                <TextField name='requisitosCentroComputo' value={values.requisitosCentroComputo} onChange={handleChange} onBlur={handleBlur} label="Requisitos del centro de computo: " multiline rows={4} />
                            </Stack>
                        </CustomTabPanel>
                        {/* Difision del evento */}
                        <CustomTabPanel value={value} index={1}>
                            <Stack direction={'column'} spacing={3}>
                                <Typography variant='h5' textAlign={'center'}>Difusion del evento</Typography>
                                <Stack direction={'row'} spacing={5} justifyContent={'center'}>
                                </Stack>
                                <Typography> Si cuenta con material de difusion, por favor subalo en este apartado.</Typography>
                                <Fragment>
                                    <input ref={material} multiple type="file" accept=".jpg" name="cronograma" id="archivo" onChange={handleChangeMultiple} />
                                    {/* <input
                                        ref={uploadInputRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                    />
                                    <Button
                                        onClick={() => uploadInputRef.current && uploadInputRef.current.click()}
                                        variant="contained"
                                    >
                                        Subir material de difusion
                                    </Button> */}
                                </Fragment>
                            </Stack>

                        </CustomTabPanel>
                        {/* Comentarios adicionales */}
                        <CustomTabPanel value={value} index={0}>
                            <Stack direction={'column'} spacing={3}>
                                <Typography variant='h5' textAlign={'center'}>Comentarios adicionales</Typography>
                                <TextField variant='outlined' name='adicional' value={values.adicional} onChange={handleChange} onBlur={handleBlur} label="Escriba comentarios adicionales" multiline rows={5} />
                            </Stack>
                        </CustomTabPanel>
                        <Stack direction={'row'} padding={3} display={'flex'} justifyContent={'flex-end'} spacing={2}>
                            <Button onClick={() => handleChangePage(value + 1)}>Regresar</Button>
                            <Button variant='outlined' onClick={() => handleChangePage(value - 1)}>Siguiente</Button>
                            {value == 0 && <Button variant='contained' type='submit'>Enviar</Button>}
                        </Stack>
                    </form>
                </Box>
                {!showProgressHorizontal && <ProgressNotification value={value} changePage={handleChangePage}></ProgressNotification>}
            </Stack>
            {showProgressHorizontal && <ProgressNotificationHorizontal value={value} changePage={handleChangePage}></ProgressNotificationHorizontal>}
        </>

    )
}

export default NewNotification