import { Button, CircularProgress, LinearProgress } from "@mui/material";

import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";

export default function LoadingButton({
  label = "button",
  isLoading = false,
  isReady = true,
  endIcon = <AddIcon></AddIcon>,
  onClick = () => console.log("Lisan Al Gaib!!!"),
}) {
  return (
    <>
      <Button
        onClick={onClick}
        variant="contained"
        type="submit"
        disableElevation
        disabled={isLoading || !isReady}
        endIcon={
          isLoading ? (
            <CircularProgress color="primary" size="1rem"></CircularProgress>
          ) : (
            endIcon
          )
        }
      >
        <LinearProgress></LinearProgress>
        {label}
      </Button>
    </>
  );
}
