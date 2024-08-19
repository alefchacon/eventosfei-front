import { Fragment, createContext, useContext, useState } from "react";

import { Snackbar, Button, IconButton } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

export const LoadingContext = createContext();

export const useIsLoading = () => {
  return useContext(LoadingContext);
};

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}
