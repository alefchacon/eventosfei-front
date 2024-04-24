import { Fragment, createContext, useContext, useState } from "react";

import { Snackbar, Button, IconButton } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

const SnackbarContext = createContext(null);

export function useSnackbar() {
  return useContext(SnackbarContext);
}

export function SnackbarProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [handleUndo, setHandleUndo] = useState(null);
  const [content, setContent] = useState(null);

  const showSnackbar = (message, buttonLabel, content = null, onUndo) => {
    setMessage(message);
    setContent(content);
    setHandleUndo(() => onUndo);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setMessage("");
    setContent(null);
    setOpen(false);
  };

  const action = (
    <Fragment>
      {content}
      <Button color="secondary" size="small" onClick={handleUndo}>
        DESHACER
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  );

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open}
        onClose={handleClose}
        autoHideDuration={6000}
        message={message}
        action={action}
      />
    </SnackbarContext.Provider>
  );
}
