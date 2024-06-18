import { useState, useEffect, useRef } from "react";
import ProgressHorizontal from "../components/ProgressHorizontal.jsx";
import Progress from "../components/Progress.jsx";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormik } from "formik";
import { TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Fragment } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import CheckboxList from "../components/CheckboxList.jsx";
import RadioList from "../components/RadioList.jsx";
import Spinner from "../components/Spinner.jsx";
import ReservationCard from "../components/ReservationCard.jsx";

import axios from "axios";
import { backendUrl } from "../api/urls.js";
import { GetAvailableReservations } from "../api/ReservationService.js";
import { GetProgramasEducativos } from "../api/ProgramasEducativosService.js";

import useWindowSize from "../hooks/useWindowSize.jsx";

import Typography from "@mui/material/Typography";
import dayjs from "dayjs";

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
      <Box sx={{ p: 3 }}>{children}</Box>
    </div>
  );
}

function NewNotification() {
  const [programasEducativos, setProgramasEducativos] = useState([
    { id: 0, name: "" },
  ]);

  useEffect(() => {
    getDatos();

    const getData = async () => {
      const programasResponse = await GetProgramasEducativos();
      setProgramasEducativos(programasResponse.data.data);

      const response = await GetAvailableReservations();
      setReservations(response.data.data);
    };

    getData();
  }, []);

  const submitNotification = async (values) => {
    try {
      values.fechaInicio = fechaInicio.format("YYYY-MM-DD");
      values.fechaFin = fechaFin.format("YYYY-MM-DD");
      values.cronograma = cronograma;

      const formData = new FormData();
      formData.append("nombreOrganizador", "Uriel");
      formData.append("puesto", "Admin");
      formData.append("email", "urielvh84@gmail.com");
      formData.append("nombre", values.nombre);
      formData.append("idPrograma", values.idPrograma);
      formData.append("idTipo", values.idTipo);
      formData.append("descripcion", values.descripcion);
      formData.append("inicio", values.fechaInicio);
      formData.append("fin", values.fechaFin);
      formData.append("numParticipantes", values.numParticipantes);
      formData.append("idModalidad", values.idModalidad);
      // formData.append('idEspacio', values.idEspacio);
      formData.append("idPlataforma", values.idPlataforma);
      formData.append(
        "requisitosCentroComputo",
        values.requisitosCentroComputo
      );
      formData.append(
        "numParticipantesExternos",
        values.numParticipantesExternos
      );
      formData.append(
        "requiereEstacionamiento",
        values.requiereEstacionamiento
      );
      formData.append("requiereFinDeSemana", values.requiereFinDeSemana);
      formData.append("requiereMaestroDeObra", values.requiereMaestroDeObra);
      formData.append(
        "requiereNotificarPrensaUV",
        values.requiereNotificarPrensaUV
      );
      formData.append("adicional", values.adicional);
      formData.append("idUsuario", 1);
      formData.append("idEstado", values.idEstado);
      formData.append("cronograma", cronograma);

      const response = await axios.post(backendUrl + "/api/eventos", formData);
      console.log(response.data);
      if (material.length != 0) {
        subirMaterial(response.data.evento);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const subirMaterial = async (idEvento) => {
    try {
      for (const element of material) {
        const formData = new FormData();
        formData.append("idEvento", idEvento);
        formData.append("archivo", element);
        const respuesta = await axios.post(
          backendUrl + "/api/materialDifusion",
          formData
        );
        console.log(respuesta.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [reservations, setReservations] = useState([]);

  const [modalidades, setModalidades] = useState([]);
  const [tipos, setTipos] = useState([]);
  const { width } = useWindowSize();
  const isMobile = width < 900;

  const [cronograma, setCronograma] = useState(null);
  const handleFileChange = (event) => {
    setCronograma(event.target.files[0]);
  };

  const [material, setMaterial] = useState([]);
  const handleChangeMultiple = (event) => {
    const files = Array.from(event.target.files);
    setMaterial(files);
  };

  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  const [value, setValue] = useState(5);
  const [showProgressHorizontal, setShowProgressHorizontal] = useState(false);
  const [programa, setPrograma] = useState("");
  const [tipo, setTipo] = useState("");
  const uploadInputRef = useRef(null);

  const getDatos = async () => {
    axios
      .all([
        axios.get(backendUrl + "/api/espacios"),
        axios.get(backendUrl + "/api/modalidades"),
        axios.get(backendUrl + "/api/plataformas"),

        axios.get(backendUrl + "/api/tipos"),
      ])
      .then(
        axios.spread(
          (
            resModalidades,

            resTipos
          ) => {
            setModalidades(resModalidades.data);

            setTipos(resTipos.data);
          }
        )
      );
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues: {
      nombre: "",
      idPrograma: "",
      idTipo: "",
      descripcion: "",
      // fechaFin: null,
      numParticipantes: "",
      idModalidad: "",
      idEspacio: "",
      idPlataforma: "",
      requisitosCentroComputo: "",

      numParticipantesExternos: "",
      requiereEstacionamiento: "",
      requiereFinDeSemana: "",
      requiereMaestroDeObra: "",
      requiereNotificarPrensaUV: "",
      adicional: "",
      idUsuario: 1,
      idEstado: 1,
    },
    // validationSchema: evaluationSchema,
    onSubmit: submitNotification,
  });

  // const handleChangeSelect1 = (event) => {
  //     setPrograma(event.target.value);
  // };
  // const handleChangeSelect2 = (event) => {
  //     setTipo(event.target.value);
  // };

  const handleChangePage = (pageIndex) => {
    if (pageIndex > -1 && pageIndex < 6) {
      setValue(pageIndex);
    }
  };

  return (
    <>
      <Stack
        direction={{ md: "row", xs: "column" }}
        overflow={"auto"}
        paddingBottom={{ lg: "60px", sm: "0" }}
      >
        <Box
          noValidate
          autoComplete="off"
          flexGrow={1}
          className="form-box"
          overflow={"auto"}
        >
          <form autoComplete="off" onSubmit={handleSubmit}>
            {/* Detalles del evento */}
            <CustomTabPanel value={value} index={5}>
              <Stack direction="column" spacing={3}>
                <Typography variant="h5" textAlign="center">
                  Detalles del evento
                </Typography>
                <TextField
                  variant="outlined"
                  name="nombre"
                  value={values.nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Nombre del evento"
                  required
                />
                <TextField
                  variant="outlined"
                  name="descripcion"
                  value={values.descripcion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Descripción del evento"
                  multiline
                  maxRows={3}
                />
                <TextField
                  variant="outlined"
                  name="pagina"
                  value={values.descripcion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Página web para consultar mayores detalles"
                />

                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Tipo de evento:{" "}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Programa educativo"
                    name="idTipo"
                    value={values.idTipo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    {tipos.map((tipo) => (
                      <MenuItem value={tipo.id} key={tipo.id}>
                        {tipo.nombre}
                      </MenuItem>
                    ))}
                    {/* <MenuItem value="academico">Academico</MenuItem>
                                        <MenuItem value="cultural">Cultural</MenuItem>
                                        <MenuItem value="deportivo">Deportivo</MenuItem>
                                        <MenuItem value="mixto">Mixto</MenuItem> */}
                  </Select>
                </FormControl>

                <CheckboxList
                  label="Programa educativo"
                  items={programasEducativos}
                  required={true}
                ></CheckboxList>

                <CheckboxList
                  label="Evento dirigido a"
                  items={[
                    { id: 0, name: "Estudiantes" },
                    { id: 1, name: "Académicos" },
                    { id: 2, name: "Personal Administrativo" },
                    { id: 3, name: "Público en general" },
                  ]}
                  required={true}
                ></CheckboxList>
                <RadioList
                  label="Ámbito"
                  items={[
                    { id: 0, name: "Local/Regional" },
                    { id: 1, name: "Estatal" },
                    { id: 2, name: "Nacional" },
                    { id: 3, name: "Inernacional" },
                  ]}
                  required={true}
                ></RadioList>
                <RadioList
                  label="Eje del Programa de Trabajo al que impacta"
                  items={[
                    { id: 0, name: "Derechos Humanos" },
                    { id: 1, name: "Sustentabilidad" },
                    { id: 2, name: "Docencia e innovación académnica" },
                    { id: 3, name: "Investigación e innovación" },
                    {
                      id: 4,
                      name: "Difusión de la cultura y extensión de los servicios",
                    },
                  ]}
                  required={true}
                ></RadioList>
                <CheckboxList
                  label="Temáticas principales que aborda el evento (mínimo 1, máximo 3)"
                  items={[
                    { id: 0, name: "Biodiversidad e integridad ecosistémica" },
                    { id: 1, name: "Calidad ambiental y gestión de campus" },
                    {
                      id: 2,
                      name: "Cultura de paz/Erradicación de la violencia/Integridad Académica",
                    },
                    { id: 3, name: "Difusión de la oferta educativa" },
                    { id: 4, name: "Derechos Humanos" },
                    { id: 5, name: "Disciplinar" },
                    { id: 6, name: "Estilos de vida y patrones de consumo" },
                    { id: 7, name: "Equidad de género y diversidad sexual" },
                    { id: 8, name: "Interculturalidad" },
                    { id: 9, name: "Salud y deporte" },
                    { id: 10, name: "Consciencia ecológica" },
                    {
                      id: 11,
                      name: "Inclusión y no discriminación",
                    },
                  ]}
                  required={true}
                  max={3}
                ></CheckboxList>
              </Stack>
            </CustomTabPanel>

            {/* Detalles logisticos */}
            <CustomTabPanel value={value} index={4}>
              <Stack direction={"column"} spacing={3}>
                <Typography variant="h5" textAlign={"center"}>
                  Detalles logisticos
                </Typography>
                <Stack direction={"column"} gap={3}>
                  <Stack direction={"column"} textAlign={"center"}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={fechaInicio}
                        onChange={(newValue) => setFechaInicio(newValue)}
                        label="Fecha de inicio"
                      />
                    </LocalizationProvider>
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['TimePicker']}>
                                                <TimePicker views={['hours']} name='horaInicio' />
                                            </DemoContainer>
                                        </LocalizationProvider> */}
                  </Stack>
                  <Stack direction={"column"} textAlign={"center"}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={fechaFin}
                        label="Fecha de finalización"
                        name="fechaFin"
                        onChange={(newValue) => setFechaFin(newValue)}
                      />
                    </LocalizationProvider>
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={['TimePicker']}>
                                                <TimePicker views={['hours']} name='horaFin' />
                                            </DemoContainer>
                                        </LocalizationProvider> */}
                  </Stack>
                </Stack>

                <Spinner
                  label="Número estimado de participantes"
                  min={0}
                  max={1000000}
                  step={10}
                ></Spinner>

                <Fragment>
                  <input
                    ref={cronograma}
                    type="file"
                    accept=".pdf"
                    name="cronograma"
                    id="archivo"
                    onChange={handleFileChange}
                  />
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
              <Stack spacing={3} direction={"column"}>
                <Typography variant="h5" textAlign={"center"}>
                  Espacios del evento
                </Typography>

                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Modalidad
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Programa educativo"
                    name="idModalidad"
                    value={values.idModalidad}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    {modalidades.map((modalidad) => (
                      <MenuItem value={modalidad.id} key={modalidad.id}>
                        {modalidad.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Stack>
                  {reservations.map((item) => {
                    return <ReservationCard item={item} />;
                  })}
                </Stack>

                <TextField
                  label={"Plataforma(s)"}
                  helperText={"e.g. Zoom, Google Meet, etc."}
                ></TextField>
              </Stack>
            </CustomTabPanel>
            {/* Recursos adicionales */}
            <CustomTabPanel value={value} index={2}>
              <Stack direction={"column"} spacing={3}>
                <Typography variant="h5" textAlign={"center"}>
                  Recursos adicionales
                </Typography>
                <Stack
                  direction={"column"}
                  spacing={5}
                  justifyContent={"start"}
                >
                  <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">
                      ¿Requiere estacionamiento?
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue=""
                      name="requiereEstacionamiento"
                      row={false}
                      value={values.requiereEstacionamiento}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label="Si"
                      />
                      <FormControlLabel
                        value="0"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                  <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">
                      ¿Requiere ingreso en fin de semana?
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue=""
                      name="requiereFinDeSemana"
                      column
                      value={values.requiereFinDeSemana}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label="Si"
                      />
                      <FormControlLabel
                        value="0"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Stack>
                <Stack
                  direction={"column"}
                  spacing={5}
                  justifyContent={"start"}
                >
                  <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">
                      ¿Requiere maestro de ceremonias?
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue=""
                      name="requiereMaestroDeObra"
                      value={values.requiereMaestroDeObra}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      column
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label="Si"
                      />
                      <FormControlLabel
                        value="0"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                  <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">
                      ¿Requiere notificar a prensa UV?
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue=""
                      name="requiereNotificarPrensaUV"
                      column
                      value={values.requiereNotificarPrensaUV}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label="Si"
                      />
                      <FormControlLabel
                        value="0"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Stack>
                <Spinner
                  label="Número estimado de participantes externos"
                  min={0}
                  max={1000000}
                  step={10}
                ></Spinner>
                <TextField
                  name="requisitosCentroComputo"
                  value={values.requisitosCentroComputo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Requisitos del centro de computo: "
                  multiline
                  maxRows={4}
                />
              </Stack>
            </CustomTabPanel>
            {/* Difision del evento */}
            <CustomTabPanel value={value} index={1}>
              <Stack direction={"column"} spacing={3}>
                <Typography variant="h5" textAlign={"center"}>
                  Difusion del evento
                </Typography>
                <Stack
                  direction={"row"}
                  spacing={5}
                  justifyContent={"center"}
                ></Stack>
                <Typography>
                  {" "}
                  Si cuenta con material de difusion, por favor subalo en este
                  apartado.
                </Typography>
                <Fragment>
                  <input
                    ref={material}
                    multiple
                    type="file"
                    accept=".jpg"
                    name="cronograma"
                    id="archivo"
                    onChange={handleChangeMultiple}
                  />
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
              <Stack direction={"column"} spacing={3}>
                <Typography variant="h5" textAlign={"center"}>
                  Comentarios adicionales
                </Typography>
                <TextField
                  variant="outlined"
                  name="adicional"
                  value={values.adicional}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Escriba comentarios adicionales"
                  multiline
                  rows={5}
                />
              </Stack>
            </CustomTabPanel>
            <Stack
              direction={"row"}
              padding={3}
              display={"flex"}
              justifyContent={"flex-end"}
              spacing={2}
            >
              <Button onClick={() => handleChangePage(value + 1)}>
                Regresar
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleChangePage(value - 1)}
              >
                Siguiente
              </Button>
              {value == 0 && (
                <Button variant="contained" type="submit">
                  Enviar
                </Button>
              )}
            </Stack>
          </form>
        </Box>
        {!isMobile && (
          <Progress
            stepAmount={6}
            value={value}
            changePage={handleChangePage}
          ></Progress>
        )}
      </Stack>
      {isMobile && (
        <ProgressHorizontal
          stepAmount={6}
          value={value}
          changePage={handleChangePage}
        ></ProgressHorizontal>
      )}
    </>
  );
}

export default NewNotification;
