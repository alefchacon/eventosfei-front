import { useState } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { client } from "../api/Client";
import { urlEvidences } from "../api/urls";

import { useFormik } from "formik";

export default function TestForm() {
  const [files, setFiles] = useState([]);

  const submit = async () => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(`archivos[${i}]`, files[i]);
    }
    formData.append("idEvaluacion", 1);

    /*

    /*
    THIS WORKS !!!!!!
    const response = await fetch("http://localhost:8000/api/evidencias", {
      method: "POST",
      body: formData,
    });
    */

    const response = await client.post(urlEvidences, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  return (
    <>
      <form
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <Stack>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
          <Button type="submit">SUBMIT</Button>
        </Stack>
      </form>
    </>
  );
}
