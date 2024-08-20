import { useState, useEffect, useLayoutEffect } from "react";
import Progress from "../components/Progress.jsx";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormik } from "formik";
import { FormHelperText, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Fragment } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import LoadingButton from "../components/LoadingButton.jsx";
import { Link } from "react-router-dom";

import { modalidad } from "../validation/enums/modalidad.js";

import ConditionalInput from "../components/ConditionalInput.jsx";

import DotMobileStepper from "../components/MobileStepper.jsx";

import ResponsiveDialog from "../components/ResponsiveDialog.jsx";
import DialogContentText from "@mui/material/DialogContentText";
import CheckboxList from "../components/CheckboxList.jsx";
import RadioList from "../components/RadioList.jsx";
import Spinner from "../components/Spinner.jsx";
import ReservationCheckboxList from "../components/ReservationCheckboxList.jsx";

import { useNavigate } from "react-router-dom";

import axios from "axios";
import { backendUrl } from "../api/urls.js";
import { GetAvailableReservations } from "../api/ReservationService.js";
import { GetProgramasEducativos } from "../api/ProgramasEducativosService.js";
import { StoreEvent } from "../api/EventService.js";

import useWindowSize from "../hooks/useWindowSize.jsx";

import Typography from "@mui/material/Typography";
import moment from "moment";
import { eventSchema } from "../validation/modelSchemas/eventSchema.js";

import DialogContent from "@mui/material/DialogContent";

import { estado } from "../validation/enums/estado.js";

function BooleanRadio({
  label = "Pregunta",
  name = "name",
  value = false,
  onChange,
  error = false,
  helperText = "Hay un error",
  onBlur,
  required = false,
}) {
  return (
    <FormControl error={error}>
      <FormLabel id={`id-${name}`} required={required}>
        {label}
      </FormLabel>
      {error && <FormHelperText>{helperText}</FormHelperText>}
      <RadioGroup
        aria-labelledby={`id-${name}`}
        defaultValue=""
        name={name}
        row={false}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      >
        <FormControlLabel value={1} control={<Radio />} label="Si" />
        <FormControlLabel value={0} control={<Radio />} label="No" />
      </RadioGroup>
    </FormControl>
  );
}

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
      <Box>{children}</Box>
    </div>
  );
}

function NewNotification({ idUsuario, setTitle }) {
  const numSteps = 7;
  const [programasEducativos, setProgramasEducativos] = useState([]);
  const [reservations, setReservations] = useState([]);
  useLayoutEffect(() => {}, []);

  const [modalidades, setModalidades] = useState([]);
  const [tipos, setTipos] = useState([]);
  const { width } = useWindowSize();
  const isMobile = width < 900;
  const [cronograma, setCronograma] = useState(null);
  const [currentStep, setCurrentStep] = useState(numSteps - 1);
  const [showReservations, setShowReservations] = useState(false);
  const [reservationsFetched, setReservationsFetched] = useState(false);
  const [showPlatforms, setShowPlatforms] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showComputerCenterRequirements, setShowComputerCenterRequirements] =
    useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const noReservationMessage =
    "Para notificar un evento presencial o híbrido, primero debe contar con reservaciones de espacios aprobadas por administración, de lo contrario sólo podrá notificar eventos virtuales.";

  const navigate = useNavigate();

  const audiencias = [
    { id: 1, name: "Estudiantes" },
    { id: 2, name: "Académicos" },
    { id: 3, name: "Personal Administrativo" },
    { id: 4, name: "Público en general" },
  ];

  const ambitos = [
    { id: 1, name: "Local/Regional" },
    { id: 2, name: "Estatal" },
    { id: 3, name: "Nacional" },
    { id: 4, name: "Inernacional" },
  ];

  const tematicas = [
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
  ];

  const ejes = [
    { id: 1, name: "Derechos Humanos" },
    { id: 2, name: "Sustentabilidad" },
    { id: 3, name: "Docencia e innovación académnica" },
    { id: 4, name: "Investigación e innovación" },
    {
      id: 5,
      name: "Difusión de la cultura y extensión de los servicios",
    },
  ];

  const medios = [
    { id: 1, name: "Página Web Institucional de la Facultad" },
    { id: 2, name: "Correo Institucional de la Facultad" },
    { id: 3, name: "Redes Sociales (Facebook, Instagram, X/Twitter)" },
    { id: 4, name: "Comunicación UV" },
    { id: 5, name: "Radio UV" },
  ];

  useEffect(() => {
    getDatos();

    const getData = async () => {
      const programasResponse = await GetProgramasEducativos();
      setProgramasEducativos(programasResponse.data.data);
    };

    getData();
    setTitle("Notificar");
  }, []);

  const handleSubmitEvent = async () => {
    await StoreEvent(values);
    setShowSuccessModal(true);
  };

  async function getReservations() {
    const response = await GetAvailableReservations();
    const fetchedReservations = response.data.data;
    setReservations(fetchedReservations);
    setShowReservationModal(fetchedReservations.length === 0);
    if (fetchedReservations.length === 0) {
      setFieldValue("idModalidad", modalidad.VIRTUAL);
    }
  }

  const handleChangeSteps = (newStep) => {
    if (newStep > -1 && newStep < numSteps) {
      setCurrentStep(newStep);
    }
  };

  const getDatos = async () => {
    axios
      .all([
        axios.get(backendUrl + "/api/modalidades"),

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
    setFieldValue,
    setFieldTouched,
    isSubmitting,
  } = useFormik({
    initialValues: {
      nombre: "",
      descripcion: "",
      pagina: "",
      ambito: "",
      audiencias: [],
      eje: "",
      tematicas: [],
      idTipo: 1,
      programas: [],

      //DETALLES LOGISTICOS
      inicio: moment(),
      fin: moment(),
      numParticipantes: 10,

      cronograma: null,

      //ESPACIOS DEL EVENTO,
      idModalidad: 1,
      plataformas: "",
      reservaciones: [],

      // RECURSOS ADICIONALES
      requiereCentroComputo: "",
      requisitosCentroComputo: "",
      requiereTransmisionEnVivo: "",
      presidium: "",
      decoracion: "",
      numParticipantesExternos: 0,
      asistiraPublicoExterno: "",
      requiereEstacionamiento: "",
      requiereFinDeSemana: "",

      medios: [],

      requiereConstancias: "",
      ponientes: "",

      proporcionaraPublicidad: "",
      publicidad: [],

      adicional: "",

      idUsuario: idUsuario,
      idEstado: estado.NUEVO,
    },

    validateOnChange: false,
    validationSchema: eventSchema,
    onSubmit: handleSubmitEvent,
  });

  useEffect(() => {
    if (!reservationsFetched) {
      getReservations();
      setReservationsFetched(true);
    }

    if (values.idModalidad === modalidad.VIRTUAL) {
      values.reservaciones = [];
    }

    const _showReservations =
      values.idModalidad === modalidad.PRESENCIAL ||
      values.idModalidad === modalidad.HIBRIDA;

    const _showPlatforms =
      values.idModalidad === modalidad.VIRTUAL ||
      values.idModalidad === modalidad.HIBRIDA;

    setShowReservations(_showReservations);
    setShowPlatforms(_showPlatforms);
  }, [values.idModalidad]);

  const maxRows = 4;

  return (
    <>
      <ResponsiveDialog
        title="No ha reservado espacios"
        secondaryLabel="Notificar evento virtual"
        primaryLabel="Solicitar reservación"
        onPrimaryClick={() => navigate("/reservar")}
        onClose={() => setShowReservationModal(false)}
        open={showReservationModal}
        oneTimeOnly
      >
        <DialogContent>
          <DialogContentText>{noReservationMessage}</DialogContentText>
        </DialogContent>
      </ResponsiveDialog>
      <ResponsiveDialog
        title="Notificación enviada"
        secondaryLabel="Regresar al calendario"
        showPrimary={false}
        onPrimaryClick={() => navigate("/reservar")}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/");
        }}
        open={showSuccessModal}
        oneTimeOnly
      >
        <DialogContentText>
          ¡Gracias por notificarnos de su evento! En breve nos pondremos en
          contacto con usted por correo electrónico para la programación del
          mismo.
        </DialogContentText>
      </ResponsiveDialog>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Stack
          direction={{ md: "row", xs: "column" }}
          overflow={"auto"}
          padding={{ md: 0, xs: "20px 20px 50px 20px" }}
          paddingBottom={5}
        >
          <Box
            noValidate
            autoComplete="off"
            flexGrow={1}
            className="form-box"
            overflow={"auto"}
          >
            {/* Detalles del evento */}
            <CustomTabPanel value={currentStep} index={6}>
              <Stack direction="column" spacing={3}>
                <Typography variant="h5" textAlign="center">
                  Detalles del evento
                </Typography>
                <TextField
                  inputProps={{ maxLength: 1000 }}
                  name="nombre"
                  label="Nombre del evento *"
                  variant="outlined"
                  value={values.nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.nombre) && touched.nombre}
                  helperText={touched.nombre && errors.nombre}
                />
                <TextField
                  variant="outlined"
                  name="descripcion"
                  value={values.descripcion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.descripcion) && touched.descripcion}
                  helperText={touched.descripcion && errors.descripcion}
                  label="Descripción del evento *"
                  multiline
                  maxRows={maxRows}
                  inputProps={{ maxLength: 1000 }}
                />
                <TextField
                  variant="outlined"
                  name="pagina"
                  value={values.pagina}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(errors.pagina) && touched.pagina}
                  helperText={touched.pagina && errors.pagina}
                  label="Página web para consultar mayores detalles"
                  inputProps={{ maxLength: 1000 }}
                />

                {tipos.length > 0 && (
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label" required>
                      Tipo de evento{" "}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Tipo de evento"
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
                    </Select>
                  </FormControl>
                )}

                {programasEducativos.length > 0 && (
                  <CheckboxList
                    name="programas"
                    label="Programa educativo"
                    selectedValues={values.programas}
                    items={programasEducativos}
                    required={true}
                    onTouch={setFieldTouched}
                    error={Boolean(errors.programas) && touched.programas}
                    helperText={touched.programas && errors.programas}
                  ></CheckboxList>
                )}

                <CheckboxList
                  name="audiencias"
                  label="Evento dirigido a"
                  selectedValues={values.audiencias}
                  items={audiencias}
                  required={true}
                  onTouch={setFieldTouched}
                  error={Boolean(errors.audiencias) && touched.audiencias}
                  helperText={touched.audiencias && errors.audiencias}
                ></CheckboxList>
                <RadioList
                  label="Ámbito"
                  onClick={setFieldValue}
                  valueName="ambito"
                  onTouch={setFieldTouched}
                  error={Boolean(errors.ambito) && touched.ambito}
                  helperText={touched.ambito && errors.ambito}
                  selectedValue={values.ambito}
                  items={ambitos}
                  required={true}
                ></RadioList>
                <RadioList
                  label="Eje del Programa de Trabajo al que impacta"
                  onClick={setFieldValue}
                  valueName="eje"
                  onTouch={setFieldTouched}
                  error={Boolean(errors.eje) && touched.eje}
                  helperText={touched.eje && errors.eje}
                  selectedValue={values.eje}
                  items={ejes}
                  required={true}
                ></RadioList>
                <CheckboxList
                  name="tematicas"
                  label="Temáticas principales que aborda el evento (mínimo 1, máximo 3)"
                  selectedValues={values.tematicas}
                  items={tematicas}
                  required={true}
                  max={3}
                  onTouch={setFieldTouched}
                  error={Boolean(errors.tematicas) && touched.tematicas}
                  helperText={touched.tematicas && errors.tematicas}
                ></CheckboxList>
              </Stack>
            </CustomTabPanel>

            {/* Detalles logisticos */}
            <CustomTabPanel value={currentStep} index={5}>
              <Stack direction={"column"} spacing={3}>
                <Typography variant="h5" textAlign={"center"}>
                  Detalles logisticos
                </Typography>
                <Stack direction={"column"} gap={3}>
                  <Stack direction={"column"} textAlign={"center"}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        minDate={moment()}
                        value={values.inicio}
                        label="Fecha de inicio"
                        onChange={(date) => setFieldValue("inicio", date)}
                      />
                    </LocalizationProvider>
                  </Stack>
                  <Stack direction={"column"} textAlign={"center"}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        minDate={values.inicio}
                        value={values.fin}
                        label="Fecha de finalización"
                        name="fin"
                        onChange={(date) => setFieldValue("fin", date)}
                      />
                    </LocalizationProvider>
                  </Stack>
                </Stack>

                <Spinner
                  name="numParticipantes"
                  onClick={setFieldValue}
                  label="Número estimado de participantes"
                  min={10}
                  max={1000000}
                  step={10}
                ></Spinner>

                <Typography color={"GrayText"} htmlFor="archivo">
                  Si cuenta con un cronograma detallado del evento, favor de
                  proporcionarlo.
                </Typography>

                <input
                  ref={cronograma}
                  type="file"
                  accept=".pdf"
                  name="cronograma"
                  id="archivo"
                  onChange={(event) =>
                    setFieldValue("cronograma", event.currentTarget.files[0])
                  }
                />
              </Stack>
            </CustomTabPanel>
            {/* Espacios del evento */}
            <CustomTabPanel value={currentStep} index={4}>
              <Stack spacing={3} direction={"column"}>
                <Typography variant="h5" textAlign={"center"}>
                  Espacios del evento
                </Typography>
                {modalidades.length > 0 && reservations.length > 0 && (
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Modalidad
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Modalidad"
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
                )}
                {showReservations && (
                  <ReservationCheckboxList
                    valueName="reservaciones"
                    onClick={setFieldValue}
                    label="Espacios físicos reservados donde se realizará"
                    items={reservations}
                    required
                  ></ReservationCheckboxList>
                )}

                {reservationsFetched && reservations.length === 0 && (
                  <FormLabel
                    sx={{ bgcolor: "#f3ecc1", padding: 2, borderRadius: 2 }}
                  >
                    {noReservationMessage}
                    <Link to={"/reservar"}>
                      {" "}
                      Solicite sus reservaciones aquí.
                    </Link>
                  </FormLabel>
                )}

                {showPlatforms && (
                  <TextField
                    name="plataformas"
                    value={values.plataformas}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label={"Plataformas virtuales donde se realizará *"}
                    maxRows={maxRows}
                    inputProps={{ maxLength: 1000 }}
                    error={Boolean(errors.plataformas) && touched.plataformas}
                    helperText={touched.plataformas && errors.plataformas}
                  ></TextField>
                )}
              </Stack>
            </CustomTabPanel>
            {/* Recursos adicionales */}
            <CustomTabPanel value={currentStep} index={3}>
              <Stack direction={"column"} spacing={3}>
                <Typography variant="h5" textAlign={"center"}>
                  Recursos adicionales
                </Typography>
                <Stack
                  direction={"column"}
                  spacing={5}
                  justifyContent={"start"}
                >
                  <ConditionalInput
                    label="¿Se requiere apoyo del personal del Centro de Cómputo durante el evento? *"
                    name="requiereCentroComputo"
                    value={values.requiereCentroComputo}
                    onChange={setFieldValue}
                    onBlur={handleBlur}
                    error={
                      Boolean(errors.requiereCentroComputo) &&
                      touched.requiereCentroComputo
                    }
                    helperText={
                      touched.requiereCentroComputo &&
                      errors.requiereCentroComputo
                    }
                  >
                    <FormControl>
                      <FormLabel>
                        Por favor, detalle los requerimientos técnicos del
                        Centro de Cómputo (por ejemplo, equipo de cómputo,
                        instalación de software especializado, equipos
                        audiovisuales, acceso a internet, entre otros)
                      </FormLabel>
                      <TextField
                        name="requisitosCentroComputo"
                        value={values.requisitosCentroComputo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        multiline
                        maxRows={maxRows}
                        inputProps={{ maxLength: 1000 }}
                      />
                    </FormControl>

                    <BooleanRadio
                      label="¿Necesita que el evento sea transmitido en vivo?"
                      name="requiereTransmisionEnVivo"
                      value={values.requiereTransmisionEnVivo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        Boolean(errors.requiereTransmisionEnVivo) &&
                        touched.requiereTransmisionEnVivo
                      }
                      helperText={
                        touched.requiereTransmisionEnVivo &&
                        errors.requiereTransmisionEnVivo
                      }
                    />

                    <FormControl>
                      <FormLabel>
                        ¿Se prevé la presencia de un presidium durante el
                        evento? Por favor, proporcione los nombres, cargos y
                        direcciones de correo electrónico de los invitados
                        especiales.
                      </FormLabel>
                      <TextField
                        name="presidium"
                        value={values.presidium}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        multiline
                        maxRows={maxRows}
                        inputProps={{ maxLength: 1000 }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>
                        ¿Desea algún tipo de material de decoración o
                        señalización para el evento? Por favor, especifique qué
                        elementos necesita (por ejemplo, mantelería,
                        personificadores, banderas, entre otros)
                      </FormLabel>
                      <TextField
                        name="decoracion"
                        value={values.decoracion}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        multiline
                        maxRows={maxRows}
                        inputProps={{ maxLength: 1000 }}
                      />
                    </FormControl>
                  </ConditionalInput>

                  <ConditionalInput
                    label="¿Asistirá público externo? *"
                    name="asistiraPublicoExterno"
                    value={values.asistiraPublicoExterno}
                    onChange={setFieldValue}
                    onBlur={handleBlur}
                    error={
                      Boolean(errors.asistiraPublicoExterno) &&
                      touched.asistiraPublicoExterno
                    }
                    helperText={
                      touched.asistiraPublicoExterno &&
                      errors.asistiraPublicoExterno
                    }
                  >
                    <Spinner
                      onClick={setFieldValue}
                      name="numParticipantesExternos"
                      label="¿Cuántas personas externas estiman recibir en el evento?"
                      min={0}
                      max={1000000}
                      step={10}
                    ></Spinner>

                    <BooleanRadio
                      label="¿Se requiere autorización para que público externo ingrese al estacionamiento durante el evento? *"
                      name="requiereEstacionamiento"
                      value={values.requiereEstacionamiento}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        Boolean(errors.requiereEstacionamiento) &&
                        touched.requiereEstacionamiento
                      }
                      helperText={
                        touched.requiereEstacionamiento &&
                        errors.requiereEstacionamiento
                      }
                    />
                    <BooleanRadio
                      label="¿Necesita autorización para el ingreso en fin de semana? *"
                      name="requiereFinDeSemana"
                      value={values.requiereFinDeSemana}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        Boolean(errors.requiereFinDeSemana) &&
                        touched.requiereFinDeSemana
                      }
                      helperText={
                        touched.requiereFinDeSemana &&
                        errors.requiereFinDeSemana
                      }
                    />
                  </ConditionalInput>
                </Stack>
              </Stack>
            </CustomTabPanel>
            {/* Difision del evento */}
            <CustomTabPanel value={currentStep} index={2}>
              <Stack direction={"column"} spacing={3}>
                <Typography variant="h5" textAlign={"center"}>
                  Difusion del evento
                </Typography>

                <CheckboxList
                  label="Seleccione los medios donde se requiere hacer difusión del evento *"
                  selectedValues={values.medios}
                  items={medios}
                  name="medios"
                  onTouch={setFieldTouched}
                  error={Boolean(errors.medios) && touched.medios}
                  helperText={touched.medios && errors.medios}
                ></CheckboxList>

                <ConditionalInput
                  label="¿Se proporcionará material promocional? *"
                  negativeLabel="No (En caso de no contar con un diseño específico, se empleará un diseño básico preestablecido por la facultad)"
                  name="proporcionaraPublicidad"
                  value={values.proporcionaraPublicidad}
                  onChange={setFieldValue}
                  onBlur={handleBlur}
                  error={
                    Boolean(errors.proporcionaraPublicidad) &&
                    touched.proporcionaraPublicidad
                  }
                  helperText={
                    touched.proporcionaraPublicidad &&
                    errors.proporcionaraPublicidad
                  }
                >
                  <FormLabel required>
                    Por favor, proporcione los recursos que se van a publicar.
                  </FormLabel>
                  <input
                    multiple
                    type="file"
                    accept=".jpg"
                    name="publicidad"
                    id="publicidad"
                    onChange={(event) =>
                      setFieldValue("publicidad", event.currentTarget.files)
                    }
                  />
                </ConditionalInput>
              </Stack>
            </CustomTabPanel>

            {/* Constancias */}
            <CustomTabPanel value={currentStep} index={1}>
              <Stack direction={"column"} spacing={3}>
                <Typography variant="h5" textAlign={"center"}>
                  Constancias
                </Typography>

                <BooleanRadio
                  label="¿Requiere la generación de constancias para ponentes u organizadores? *"
                  name="requiereConstancias"
                  value={values.requiereConstancias}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    Boolean(errors.requiereConstancias) &&
                    touched.requiereConstancias
                  }
                  helperText={
                    touched.requiereConstancias && errors.requiereConstancias
                  }
                />

                <FormControl>
                  <FormLabel>
                    Proporcione el grado y nombres de los ponentes u
                    organizadores, especificando su rol.
                  </FormLabel>
                  <TextField
                    name="ponientes"
                    value={values.ponientes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    multiline
                    maxRows={maxRows}
                    inputProps={{ maxLength: 1000 }}
                  />
                </FormControl>
              </Stack>
            </CustomTabPanel>

            {/* Comentarios adicionales */}
            <CustomTabPanel value={currentStep} index={0}>
              <Stack direction={"column"} gap={2}>
                <Typography variant="h5" textAlign={"center"}>
                  Comentarios adicionales
                </Typography>
                <FormLabel>
                  Espacio para cualquier comentario adicional o solicitud
                  especial relacionada con el evento.
                </FormLabel>
                <TextField
                  variant="outlined"
                  name="adicional"
                  value={values.adicional}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  multiline
                  rows={maxRows}
                  inputProps={{ maxLength: 1000 }}
                />
              </Stack>
            </CustomTabPanel>
            {!isMobile && (
              <Stack
                direction={"row"}
                padding={3}
                display={"flex"}
                justifyContent={"flex-end"}
                spacing={2}
              >
                <Button onClick={() => handleChangeSteps(currentStep + 1)}>
                  Regresar
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleChangeSteps(currentStep - 1)}
                >
                  Siguiente
                </Button>
                {currentStep == 0 && (
                  <Button variant="contained" onClick={handleSubmitEvent}>
                    Enviar
                  </Button>
                )}
              </Stack>
            )}
          </Box>
          {!isMobile && (
            <Progress
              stepAmount={numSteps}
              value={currentStep}
              changePage={handleChangeSteps}
            ></Progress>
          )}
        </Stack>
        {isMobile && (
          <DotMobileStepper
            steps={numSteps}
            onChange={handleChangeSteps}
            isSubmitting={isSubmitting}
          />
        )}
      </form>
    </>
  );
}

export default NewNotification;
