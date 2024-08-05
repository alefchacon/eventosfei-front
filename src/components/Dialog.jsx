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
  title = "Título",
  showPrimary = true,
  showSecondary = true,
  primaryLabel = "Enviar",
  secondaryLabel = "Cancelar",
  onPrimaryClick,
  onClose,
  responsive = false,
  open = false,
  oneTimeOnly = false,
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

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open && !dismissed}
        aria-labelledby="responsive-dialog-title"
        fullWidth
      >
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>

        <Stack>
          {children}
          <DialogActions
            sx={{
              display: "flex",
              flexDirection: {
                md: "row",
                xs: "column-reverse",
              },
              gap: 2,
            }}
          >
            {showSecondary && (
              <Button autoFocus onClick={handleClose}>
                {secondaryLabel}
              </Button>
            )}
            {showPrimary && (
              <Button variant="contained" onClick={onPrimaryClick} autoFocus>
                {primaryLabel}
              </Button>
            )}
          </DialogActions>
        </Stack>
      </Dialog>
    </>
  );
}
