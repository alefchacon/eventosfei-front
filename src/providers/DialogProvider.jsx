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

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

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

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

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
          fullScreen={fullScreen}
          open={open}
          PaperProps={{
            style: {
              padding: 0,
              margin: 0,
            },
          }}
        >
          <DialogContent dividers sx={{ padding: 2 }}>
            {type === DialogTypes.userForm && (
              <UserForm
                onCancel={handleClose}
                onSubmit={handleSubmit}
                user={content}
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
                reservation={content}
              ></ReservationResponseForm>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </DialogContext.Provider>
  );
}
