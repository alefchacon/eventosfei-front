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

import useWindowSize from "../hooks/useWindowSize";

export default function ResponsiveDialog({
  children,
  title = "",
  showPrimary = true,
  showSecondary = true,
  primaryLabel = "Enviar",
  secondaryLabel = "Cancelar",
  onPrimaryClick,
  onClose,
  responsive = false,
  open = false,
  oneTimeOnly = false,
  isForm = false,
}) {
  const [dismissed, setDismissed] = useState(false);
  const theme = useTheme();
  const fullScreen = responsive
    ? useMediaQuery(theme.breakpoints.down("sm"))
    : false;

  const handleClose = () => {
    onClose();
    if (oneTimeOnly) {
      setDismissed(true);
    }
  };

  const getXSFlexDirection = () => {
    if (isForm) {
      return "row";
    }
    return "column-reverse";
  };

  const isFullscreenForm = () => fullScreen && isForm;

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open && !dismissed}
        aria-labelledby="responsive-dialog-title"
        fullWidth
      >
        {title && (
          <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        )}

        <Stack
          direction={isFullscreenForm() ? "column-reverse" : "column"}
          padding={3}
        >
          {children}
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
            {showSecondary && (
              <Button size="small" onClick={handleClose}>
                {secondaryLabel}
              </Button>
            )}
            {showPrimary && (
              <Button size="small" variant="contained" onClick={onPrimaryClick}>
                {primaryLabel}
              </Button>
            )}
          </DialogActions>
        </Stack>
      </Dialog>
    </>
  );
}
