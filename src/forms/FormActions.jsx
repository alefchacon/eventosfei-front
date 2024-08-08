import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Stack } from "@mui/material";
import LoadingButton from "../components/LoadingButton";

import useWindowSize from "../hooks/useWindowSize";

export default function FormActions({
  showPrimary = true,
  showSecondary = true,
  primaryLabel = "Enviar",
  secondaryLabel = "Cancelar",
  onPrimaryClick,
  onClose = null,
  responsive = true,
  isForm = true,
  onSubmit,
}) {
  const [dismissed, setDismissed] = useState(false);
  const theme = useTheme();
  const fullScreen = responsive
    ? useMediaQuery(theme.breakpoints.down("sm"))
    : false;

  const isFullscreenForm = () => fullScreen && isForm;

  const getXSFlexDirection = () => {
    if (isForm) {
      return "row";
    }
    return "column-reverse";
  };

  return (
    <DialogActions
      sx={{
        display: "flex",
        flexDirection: {
          md: "row",
          xs: getXSFlexDirection(),
        },
        justifyContent: isFullscreenForm() ? "space-between" : "end",
        gap: 2,
      }}
    >
      {onClose ? (
        <Button onClick={onClose}>{secondaryLabel}</Button>
      ) : (
        <div></div>
      )}

      {showPrimary && (
        <LoadingButton
          variant="contained"
          onClick={onPrimaryClick}
          label={primaryLabel}
          isLoading={onSubmit}
        >
          {primaryLabel}
        </LoadingButton>
      )}
    </DialogActions>
  );
}
