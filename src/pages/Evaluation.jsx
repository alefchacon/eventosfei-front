import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import RadioGroup from "../components/RadioGroup.jsx";
import UploadArea from "../components/UploadArea.jsx";
import Rating from "@mui/material/Rating";
import Progress from "../components/Progress.jsx";
import ProgressHorizontal from "../components/ProgressHorizontal.jsx";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ItemUpload from "../components/ItemUpload.jsx";
import TextArea from "../components/TextArea.jsx";
import Stack from "@mui/material/Stack";
import CustomToggleButton from "../components/ToggleButton.jsx";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import CardActionArea from "@mui/material/CardActionArea";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import { evaluationSchema } from "../validation/modelSchemas/evaluationSchema.js";
import { useSnackbar } from "../providers/SnackbarProvider.jsx";

import AddEvaluation from "../api/EvaluationService.js";
import { AddEvidence } from "../api/EvidenceService.js";

import LoadingButton from "../components/LoadingButton.jsx";

import Typography from "@mui/material/Typography";

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
      <Box sx={{ p: 0 }}>
        <div>{children}</div>
      </Box>
    </div>
  );
}

export default function Form({ idEvento, FEIEvent, onSubmit: setFEIEvent }) {
  const [value, setValue] = useState(4);
  const [evidences, setEvidences] = useState([]);
  const [isEvaluated, setIsEvaluated] = useState(false);

  const questionSpacing = 1;
  const formSpacing = 6;
  const typographyVariant = "subtitle1";

  const [showProgressHorizontal, setShowProgressHorizontal] = useState(false);

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    //setFEIEvent(FEIEvent);
    //setIsEvaluated(FEIEvent && FEIEvent.evaluation !== null);

    const updateOrientation = () => {
      setShowProgressHorizontal(window.innerWidth < 900);
    };

    window.addEventListener("resize", updateOrientation);

    updateOrientation();

    return () => window.removeEventListener("resize", updateOrientation);
  }, []);

  const handleChangePage = (pageIndex) => {
    console.log(values.ratingCommunication);
    if (pageIndex > -1 && pageIndex < 5) {
      setValue(pageIndex);
    }
  };

  const handleRatingAttentionChange = (event, newRatingAttention) => {
    console.log(newRatingAttention);
    if (newRatingAttention !== null) {
      setFieldValue("ratingAttention", newRatingAttention);
    }
  };
  const handleRatingCommunicationChange = (newRatingAttention) => {
    console.log(newRatingAttention);
    if (newRatingAttention !== null) {
      setFieldValue("ratingCommunication", newRatingAttention);
    }
  };
  const handleRatingComputerCenterChange = (event, newRatingAttention) => {
    console.log(newRatingAttention);
    if (newRatingAttention !== null) {
      setFieldValue("ratingComputerCenter", newRatingAttention);
    }
  };
  const handleRatingResourcesChange = (event, newRatingAttention) => {
    console.log(newRatingAttention);
    if (newRatingAttention !== null) {
      setFieldValue("ratingResources", newRatingAttention);
    }
  };
  const handleRatingSpaceChange = (event, newRatingAttention) => {
    console.log(newRatingAttention);
    if (newRatingAttention !== null) {
      setFieldValue("ratingSpace", newRatingAttention);
    }
  };

  const submitEvaluation = async (values, actions) => {
    try {
      console.log(values);
      values.idEvento = FEIEvent.id;
      const response = await AddEvaluation(values, evidences);

      FEIEvent.evaluation = values;
      //setFEIEvent(FEIEvent);
      //setIsEvaluated(true);

      showSnackbar(response.data.message);
    } catch (error) {
      showSnackbar(error);
    }
  };

  const submitEvidences = async (idEvaluacion, evidences) => {
    for (let i = 0; i < evidences.length; i++) {
      const response = await AddEvidence(idEvaluacion, evidences[i]);
      if (response.status !== 201) {
        break;
      }
    }
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    setFieldValue,
  } = useFormik({
    initialValues: {
      ratingAttention: 1,
      ratingAttentionReason: "",
      ratingCommunication: 2,
      improvementsSupport: "",
      ratingSpace: 3,
      problemsSpace: "",
      ratingComputerCenter: 4,
      ratingComputerCenterReason: "",
      ratingResources: 5,
      ratingResourcesReason: "",
      improvementsResources: "",
      additional: "",
    },
    onSubmit: submitEvaluation,
  });

  return (
    <>
      <Stack direction={{ md: "row", xs: "column" }} className="fuck">
        <Box
          noValidate
          autoComplete="off"
          width={"100%"}
          padding={0}
          margin={0}
        >
          <form autoComplete="off" onSubmit={handleSubmit}>
            <CustomTabPanel value={value} index={4}>
              <div className="form-page">
                <Typography variant="h5">
                  Coordinación de Eventos Académicos
                </Typography>

                <Stack spacing={formSpacing}>
                  <Stack spacing={questionSpacing}>
                    <Typography component="legend">
                      {
                        "¿Cómo calificaría la atención recibida por parte de la Coordinación de Eventos Académicos?"
                      }
                    </Typography>
                    <Stack display={"flex"} direction={"row"}>
                      <Box flexGrow={1}></Box>
                      <Rating
                        name="ratingAttention"
                        value={values.ratingAttention}
                        size="large"
                        disabled={isSubmitting}
                        sx={{
                          fontSize: "2.5rem",
                          color: "#18529d",
                        }}
                        onChange={handleRatingAttentionChange}
                      />
                      <Box flexGrow={1}></Box>
                    </Stack>
                  </Stack>

                  <Stack spacing={questionSpacing}>
                    <Typography variant={typographyVariant}>
                      Por favor, explique los factores que contribuyeron a su
                      calificación anterior:
                    </Typography>
                    <TextField
                      id="ratingAttentionReason"
                      name="ratingAttentionReason"
                      variant="filled"
                      label="Razón de la calificación"
                      disabled={isSubmitting}
                      multiline
                      maxRows={3}
                      value={values.ratingAttentionReason}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        Boolean(errors.ratingAttentionReason) &&
                        touched.ratingAttentionReason
                      }
                      helperText={
                        touched.ratingAttentionReason &&
                        errors.ratingAttentionReason
                      }
                    ></TextField>
                  </Stack>

                  <Stack spacing={questionSpacing}>
                    <Typography variant={typographyVariant}>
                      ¿Hubo algún aspecto en el que el apoyo de la Coordinación
                      de Eventos pudiera haber mejorado? (Describa brevemente):
                    </Typography>
                    <TextField
                      id="improvementsSupport"
                      name="improvementsSupport"
                      variant="filled"
                      disabled={isSubmitting}
                      label="Mejoras"
                      multiline
                      maxRows={3}
                      value={values.improvementsSupport}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        Boolean(errors.improvementsSupport) &&
                        touched.improvementsSupport
                      }
                      helperText={
                        touched.improvementsSupport &&
                        errors.improvementsSupport
                      }
                    ></TextField>
                  </Stack>
                </Stack>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              <div className="form-page">
                <Typography variant="h5">Espacio</Typography>
                <Stack spacing={formSpacing}>
                  <Stack spacing={questionSpacing}>
                    <Typography component="legend">
                      {
                        "¿Cómo calificaría el espacio donde se llevó acabo el evento, en términos de cumplir con sus expectativas y requisitos?"
                      }
                    </Typography>
                    <Stack display={"flex"} direction={"row"}>
                      <Box flexGrow={1}></Box>
                      <Rating
                        name="attentionRating"
                        value={values.ratingSpace}
                        size="large"
                        sx={{
                          fontSize: "2.5rem",
                          color: "#18529d",
                        }}
                        onChange={handleRatingSpaceChange}
                      />
                      <Box flexGrow={1}></Box>
                    </Stack>
                  </Stack>

                  <Stack spacing={questionSpacing}>
                    <Typography variant="p">
                      ¿Hubo algún problema relacionado con el espacio (por
                      ejemplo, capacidad, comodidad, equipamiento, limpieza)?
                      (Describa brevemente):
                    </Typography>
                    <TextField
                      id="problemsSpace"
                      name="problemsSpace"
                      variant="filled"
                      disabled={isSubmitting}
                      label="Mejoras"
                      multiline
                      maxRows={3}
                      value={values.problemsSpace}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        Boolean(errors.problemsSpace) && touched.problemsSpace
                      }
                      helperText={touched.problemsSpace && errors.problemsSpace}
                    ></TextField>
                  </Stack>
                </Stack>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <Typography variant="h5">
                Apoyo en el Centro de Cómputo
              </Typography>
              <Stack className="form-page" spacing={formSpacing}>
                <Stack spacing={questionSpacing}>
                  <Typography component="legend">
                    {
                      "¿Cómo calificaría la eficiencia del apoyo del Centro de Cómputo para la atención de su evento?"
                    }
                  </Typography>
                  <Stack display={"flex"} direction={"row"}>
                    <Box flexGrow={1}></Box>
                    <Rating
                      disabled={isSubmitting}
                      name="attentionRating"
                      value={values.ratingComputerCenter}
                      size="large"
                      sx={{
                        fontSize: "2.5rem",
                        color: "#18529d",
                      }}
                      onChange={handleRatingComputerCenterChange}
                    />
                    <Box flexGrow={1}></Box>
                  </Stack>
                </Stack>

                <Stack spacing={2}>
                  <Typography variant="p">
                    Por favor, explique los factores que contribuyeron a su
                    calificación anterior:
                  </Typography>
                  <TextField
                    name="ratingComputerCenterReason"
                    variant="filled"
                    disabled={isSubmitting}
                    label="Factores"
                    multiline
                    maxRows={3}
                    value={values.ratingComputerCenterReason}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      Boolean(errors.ratingComputerCenterReason) &&
                      touched.ratingComputerCenterReason
                    }
                    helperText={
                      touched.ratingComputerCenterReason &&
                      errors.ratingComputerCenterReason
                    }
                  ></TextField>
                </Stack>

                <Stack spacing={questionSpacing}>
                  <Typography component="legend">
                    {
                      "¿Cómo calificaría la adecuación de los recursos técnicos proporcionados para satisfacer las necesidades del evento?"
                    }
                  </Typography>
                  <Stack display={"flex"} direction={"row"}>
                    <Box flexGrow={1}></Box>
                    <Rating
                      disabled={isSubmitting}
                      name="attentionRating"
                      value={values.ratingResources}
                      size="large"
                      sx={{
                        fontSize: "2.5rem",
                        color: "#18529d",
                      }}
                      onChange={handleRatingResourcesChange}
                    />
                    <Box flexGrow={1}></Box>
                  </Stack>
                </Stack>
                <Stack spacing={2}>
                  <Typography variant="p">
                    Por favor, explique los factores que contribuyeron a su
                    calificación anterior:
                  </Typography>
                  <TextField
                    id="ratingResourcesReason"
                    name="ratingResourcesReason"
                    disabled={isSubmitting}
                    variant="filled"
                    label="Factores"
                    multiline
                    maxRows={3}
                    value={values.ratingResourcesReason}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      Boolean(errors.ratingResourcesReason) &&
                      touched.ratingResourcesReason
                    }
                    helperText={
                      touched.ratingResourcesReason &&
                      errors.ratingResourcesReason
                    }
                  ></TextField>
                </Stack>

                <Stack spacing={2}>
                  <Typography variant="p">
                    ¿Hubo algún aspecto en el que el apoyo técnico pudiera haber
                    mejorado? (Describa brevemente):{" "}
                  </Typography>
                  <TextField
                    id="improvementsResources"
                    variant="filled"
                    label="Mejoras"
                    disabled={isSubmitting}
                    multiline
                    maxRows={3}
                    value={values.improvementsResources}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      Boolean(errors.improvementsResources) &&
                      touched.improvementsResources
                    }
                    helperText={
                      touched.improvementsResources &&
                      errors.improvementsResources
                    }
                  ></TextField>
                </Stack>
              </Stack>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Stack spacing={questionSpacing}>
                <Typography variant="h5">Evidencias del evento</Typography>
                <Typography variant="p">
                  Por favor, si cuenta con ellos, comparta evidencias de la
                  realización del evento (por ejemplo, fotografías, videos,
                  listas de asistencia, etc.)
                </Typography>

                <UploadArea
                  files={evidences}
                  setFiles={setEvidences}
                ></UploadArea>
              </Stack>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={0}>
              <div className="form-page">
                <Stack spacing={questionSpacing}>
                  <Typography variant="h5">Comentarios Adicionales</Typography>
                  <Typography variant="p">
                    Por favor, comparta cualquier comentario que quiera agregar
                    sobre la organización y ejecución del evento:{" "}
                  </Typography>
                  <TextField
                    disabled={isSubmitting}
                    id="additional"
                    variant="filled"
                    label="Comentario adicional"
                    multiline
                    maxRows={3}
                    value={values.additional}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.additional) && touched.additional}
                    helperText={touched.additional && errors.additional}
                  ></TextField>
                </Stack>
              </div>
            </CustomTabPanel>
            <Stack
              direction={"row"}
              padding={3}
              display={"flex"}
              justifyContent={"flex-end"}
              alignItems={"center"}
              spacing={2}
            >
              <Button
                disabled={isSubmitting}
                onClick={() => handleChangePage(value + 1)}
              >
                Anterior
              </Button>
              <Button
                disabled={isSubmitting}
                variant="outlined"
                onClick={() => handleChangePage(value - 1)}
              >
                Siguiente
              </Button>
              {value == 0 && !isEvaluated && (
                <LoadingButton
                  label="Evaluar evento"
                  isLoading={isSubmitting}
                ></LoadingButton>
              )}
            </Stack>
          </form>
        </Box>

        {!showProgressHorizontal && (
          <Progress
            isDisabled={isSubmitting}
            value={value}
            changePage={handleChangePage}
          ></Progress>
        )}
      </Stack>
      {showProgressHorizontal && (
        <ProgressHorizontal
          isDisabled={isSubmitting}
          value={value}
          changePage={handleChangePage}
        ></ProgressHorizontal>
      )}
    </>
  );
}
