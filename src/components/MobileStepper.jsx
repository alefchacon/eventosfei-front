import * as React from "react";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LoadingButton from "./LoadingButton";

export default function DotMobileStepper({
  steps = 3,
  submitButtonLabel = "Enviar",
  isSubmitting = false,
  onChange,
}) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    console.log(activeStep + 1);
    onChange(steps - 1 - (activeStep + 1));
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    console.log(activeStep - 1);
    onChange(steps - 1 - (activeStep - 1));
    //onChange(setps);
  };

  return (
    <MobileStepper
      variant="dots"
      steps={steps}
      position="bottom"
      activeStep={activeStep}
      sx={{ flexGrow: 1 }}
      nextButton={
        activeStep === steps - 1 ? (
          <LoadingButton label="Enviar" isLoading={isSubmitting} />
        ) : (
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === steps - 1}
          >
            Siguiente
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        )
      }
      backButton={
        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
          Regresar
        </Button>
      }
    />
  );
}
