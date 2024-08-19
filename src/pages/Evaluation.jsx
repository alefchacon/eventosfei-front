import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import UploadArea from "../components/UploadArea.jsx";
import Rating from "@mui/material/Rating";
import Progress from "../components/Progress.jsx";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useFormik } from "formik";
import { evaluationSchema } from "../validation/modelSchemas/evaluationSchema.js";
import { useSnackbar } from "../providers/SnackbarProvider.jsx";

import DotMobileStepper from "../components/MobileStepper.jsx";

import AddEvaluation from "../api/EvaluationService.js";

import LoadingButton from "../components/LoadingButton.jsx";

import { showIfBig, showIfSmall } from "../validation/enums/breakpoints.js";

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
      <Box sx={{ paddingBottom: 7 }}>
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
  };

  const handleRatingAttentionChange = (event, newRatingAttention) => {
    if (newRatingAttention !== null) {
      setFieldValue("ratingAttention", newRatingAttention);
    }
  };
  const handleRatingComputerCenterChange = (event, newRatingAttention) => {
    if (newRatingAttention !== null) {
      setFieldValue("ratingComputerCenter", newRatingAttention);
    }
  };
  const handleRatingResourcesChange = (event, newRatingAttention) => {
    if (newRatingAttention !== null) {
      setFieldValue("ratingResources", newRatingAttention);
    }
  };
  const handleRatingSpaceChange = (event, newRatingAttention) => {
    if (newRatingAttention !== null) {
      setFieldValue("ratingSpace", newRatingAttention);
    }
  };

  const submitEvaluation = async (values, actions) => {
    values.idEvento = FEIEvent.id;
    const response = await AddEvaluation(values, evidences);

    FEIEvent.evaluation = values;
    FEIEvent.hasEvaluation = true;
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
    validateOnChange: false,
    validationSchema: evaluationSchema,
  });

  return (
    <>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Stack direction={{ md: "row", xs: "column" }} className="fuck">
          <Box
            noValidate
            autoComplete="off"
            width={"100%"}
            padding={0}
            margin={0}
          >
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
                      calificación anterior *:
                    </Typography>
                    <TextField
                      id="ratingAttentionReason"
                      name="ratingAttentionReason"
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
                      inputProps={{ maxLength: 1000 }}
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
                      disabled={isSubmitting}
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
                      inputProps={{ maxLength: 1000 }}
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
                      disabled={isSubmitting}
                      multiline
                      maxRows={3}
                      value={values.problemsSpace}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        Boolean(errors.problemsSpace) && touched.problemsSpace
                      }
                      helperText={touched.problemsSpace && errors.problemsSpace}
                      inputProps={{ maxLength: 1000 }}
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
                    calificación anterior *
                  </Typography>
                  <TextField
                    name="ratingComputerCenterReason"
                    disabled={isSubmitting}
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
                    inputProps={{ maxLength: 1000 }}
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
                    calificación anterior *
                  </Typography>
                  <TextField
                    id="ratingResourcesReason"
                    name="ratingResourcesReason"
                    disabled={isSubmitting}
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
                    inputProps={{ maxLength: 1000 }}
                  ></TextField>
                </Stack>

                <Stack spacing={2}>
                  <Typography variant="p">
                    ¿Hubo algún aspecto en el que el apoyo técnico pudiera haber
                    mejorado? (Describa brevemente):{" "}
                  </Typography>
                  <TextField
                    id="improvementsResources"
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
                    inputProps={{ maxLength: 1000 }}
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
                    multiline
                    maxRows={3}
                    value={values.additional}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(errors.additional) && touched.additional}
                    helperText={touched.additional && errors.additional}
                    inputProps={{ maxLength: 1000 }}
                  ></TextField>
                </Stack>
              </div>
            </CustomTabPanel>
            <Stack
              direction={"row"}
              padding={3}
              display={showIfBig}
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
          <DotMobileStepper
            steps={5}
            onChange={handleChangePage}
            isSubmitting={isSubmitting}
          />
        )}
      </form>
    </>
  );
}
