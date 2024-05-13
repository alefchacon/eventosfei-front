import {
  Fragment,
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

import { Box, Dialog, DialogTitle, DialogContent } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import UserForm from "../forms/UserForm";
import MultiUserForm from "../forms/MultiUserForm";
import ReservationForm from "../forms/ReservationForm";
import ReservationResponseForm from "../forms/ReservationResponseForm";

import DialogTypes from "./DialogTypes";

const DialogContext = createContext(null);

export function useDialog() {
  return useContext(DialogContext);
}

export function DialogProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(null);
  const [value, setValue] = useState("Dione");
  const [onSubmit, setOnSubmit] = useState(null);
  const [type, setType] = useState("");

  const DialogTypeForms = {};

  const showDialog = (title, type, handleSubmit, content) => {
    console.log(type);
    setTitle(title);
    setType(type);
    setOnSubmit(handleSubmit);
    setOpen(true);
    setContent(content);
  };

  const handleSubmit = (value) => {
    onSubmit(value);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setTitle("");
    setContent(null);
    setOpen(false);
  };

  return (
    <DialogContext.Provider value={{ showDialog }}>
      {children}
      <Box
        sx={{
          padding: 0,
          width: "100%",
          maxWidth: 460,
          bgcolor: "background.paper",
        }}
      >
        <Dialog
          sx={{
            "& .MuiDialog-paper": {
              padding: 0,
              width: "100%",
              maxHeight: "100%",
            },
          }}
          maxWidth="xs"
          open={open}
          PaperProps={{
            style: {
              padding: 0,
              margin: 0,
              width: type.width,
              minWidth: type.minWidth,
              maxWidth: type.maxWidth,
            },
          }}
        >
          <DialogTitle>{title}</DialogTitle>
          <DialogContent dividers>
            {type === DialogTypes.userForm && (
              <UserForm
                onCancel={handleClose}
                onSubmit={handleSubmit}
              ></UserForm>
            )}
            {type === DialogTypes.multiUserForm && (
              <MultiUserForm
                onCancel={handleClose}
                onSubmit={handleSubmit}
              ></MultiUserForm>
            )}
            {type === DialogTypes.reservationForm && (
              <ReservationForm
                onCancel={handleClose}
                onSubmit={handleSubmit}
              ></ReservationForm>
            )}
            {type === DialogTypes.reservationResponse && (
              <ReservationResponseForm
                onCancel={handleClose}
                onSubmit={handleSubmit}
              ></ReservationResponseForm>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </DialogContext.Provider>
  );
}
