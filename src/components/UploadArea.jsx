import { useState } from "react";
import {
  CardActionArea,
  Typography,
  Button,
  Chip,
  Stack,
  styled,
} from "@mui/material";

import UploadIcon from "@mui/icons-material/Upload";
import { ValidationError } from "yup";
import { useSnackbar } from "../providers/SnackbarProvider.jsx";

function File({ file }) {
  return <Button>{file.name}</Button>;
}

export default function UploadArea({ files, setFiles }) {
  const { showSnackbar } = useSnackbar();

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  function validateNewFilename(newFile) {
    if (files.some((file) => file.name === newFile.name)) {
      throw new ValidationError(
        "No puede subir múltiples archivos con el mismo nombre."
      );
    }
  }

  const parseDroppedFile = async (items) => {
    let files = [];

    [...items].forEach((item, i) => {
      if (item.kind === "file") {
        const file = item.getAsFile();
        validateNewFilename(file);
        files.push(file);
      }
    });
    return files;
  };
  const parsePickedFile = async (items) => {
    let files = [];

    [...items].forEach((item, i) => {
      files.push(item);
    });
    return files;
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    let items = [];
    items = event.dataTransfer.items;

    try {
      const parsedFiles = await parseDroppedFile(items);
      setFiles((oldFiles) => [...oldFiles, ...parsedFiles]);
    } catch (e) {
      showSnackbar(e.message);
    }
  };

  const handlePick = async (event) => {
    event.preventDefault();
    let items = [];
    items = event.target.files;

    try {
      const parsedFiles = await parsePickedFile(items);
      console.log(parsedFiles);

      setFiles((oldFiles) => [...oldFiles, ...parsedFiles]);
    } catch (e) {
      showSnackbar(e.message);
    }
  };

  function dragOverHandler(event) {
    event.preventDefault();
    console.log("sasdf");
  }

  const handleDelete = async (fileToDelete) => {
    const fileNameToDelete = fileToDelete.name;
    const newFiles = files.filter((file) => file.name !== fileNameToDelete);
    setFiles(newFiles);
  };

  return (
    <div>
      <CardActionArea
        component="label"
        variant="contained"
        className="upload-button"
        onDrop={handleDrop}
        onDragOver={dragOverHandler}
      >
        <Stack
          className="upload-button"
          onDragLeave={() => console.log("rewq")}
        >
          <Typography
            variant="caption"
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <UploadIcon fontSize="large"></UploadIcon>
            De clic aquí para seleccionar sus archivos
          </Typography>
          <VisuallyHiddenInput type="file" multiple onChange={handlePick} />
        </Stack>
      </CardActionArea>
      {files.map((file, index) => (
        <Chip
          key={index}
          variant="filled"
          label={file.name}
          onDelete={() => handleDelete(file)}
        ></Chip>
      ))}
    </div>
  );
}
