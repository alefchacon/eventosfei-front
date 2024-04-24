import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import RadioGroup from "../components/RadioGroup.jsx";
import UploadArea from "../components/UploadArea.jsx";
import Rating from "@mui/material/Rating";
import Progress from "../components/Progress.jsx";
import ProgressHorizontal from "../components/ProgressHorizontal.jsx";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CreateEvaluation from "../api/EvaluationService.js";
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
      <Box sx={{ p: 3 }}>
        <div>{children}</div>
      </Box>
    </div>
  );
}

export default function Form({ idEvento }) {
  const [value, setValue] = useState(4);
  const [evidences, setEvidences] = useState([]);

  const questionSpacing = 1;
  const formSpacing = 6;
  const typographyVariant = "subtitle1";

  const [showProgressHorizontal, setShowProgressHorizontal] = useState(false);

  useEffect(() => {
    const updateOrientation = () => {
      setShowProgressHorizontal(window.innerWidth < 900);
    };

    window.addEventListener("resize", updateOrientation);

    updateOrientation();

    return () => window.removeEventListener("resize", updateOrientation);
  }, []);

  const handleChangePage = (pageIndex) => {
    if (pageIndex > -1 && pageIndex < 5) {
      setValue(pageIndex);
    }
    console.log(values);
  };

  const handleRatingAttentionChange = (event, newRatingAttention) => {
    console.log(newRatingAttention);
    if (newRatingAttention !== null) {
      setFieldValue("ratingAttention", newRatingAttention);
    }
  };
  const handleRatingCommunicationChange = (event, newRatingAttention) => {
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

  const communicationOptions = [
    { id: 1, name: "No" },
    { id: 2, name: "En parte" },
    { id: 3, name: "Si" },
  ];

  const evaluate = async (values, actions) => {
    try {
      values.idEvento = idEvento;
      CreateEvaluation(values, evidences);
    } catch (error) {
      console.log(error);
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
      ratingAttentionReason: "ratingAttentionReason",
      ratingCommunication: 2,
      improvementsSupport: "improvementsSupport",
      ratingSpace: 3,
      problemsSpace: "problemsSpace",
      ratingComputerCenter: 4,
      ratingComputerCenterReason: "ratingComputerCenterReason",
      ratingResources: 5,
      ratingResourcesReason: "ratingResourcesReason",
      problemsResources: "problemsResources",
      improvementsResources: "improvementsResources",
      additional: "additional",
    },
    validationSchema: evaluationSchema,
    onSubmit: evaluate,
  });

  return (
    <>
      <Stack direction={{ md: "row", xs: "column" }}>
        <Box noValidate autoComplete="off" className="form-box" width={"100%"}>
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
                      ¿La comunicación fue clara y oportuna?
                    </Typography>
                    <CustomToggleButton
                      value={values.ratingCommunication}
                      options={communicationOptions}
                      onChange={handleRatingCommunicationChange}
                    ></CustomToggleButton>
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
                <LoadingButton
                  label="Evaluar evento"
                  isLoading={isSubmitting}
                ></LoadingButton>
              )}
            </Stack>
          </form>
        </Box>

        {!showProgressHorizontal && (
          <Progress value={value} changePage={handleChangePage}></Progress>
        )}
      </Stack>
      {showProgressHorizontal && (
        <ProgressHorizontal
          value={value}
          changePage={handleChangePage}
        ></ProgressHorizontal>
      )}
    </>
  );
}
