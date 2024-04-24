import { useState } from "react";

import { Stack, Typography, Button } from "@mui/material";

import UserTable from "../components/UserTable";
import UploadButton from "../components/UploadButton";
import LoadingButton from "../components/LoadingButton";

export default function MultiUserForm({ onCancel, onSubmit }) {
  const [file, setFiles] = useState(null);
  const [users, setUsers] = useState([]);

  return (
    <Stack>
      <Typography variant="body1">
        Seleccione un archivo .CSV para registrar múltiples usuarios.
      </Typography>
      <UserTable users={users}></UserTable>
      <Button onClick={() => console.log(users)}>Reiniciar</Button>
      <UploadButton onUpload={setUsers}></UploadButton>
      <Stack
        direction={"row"}
        spacing={2}
        justifyContent={"end"}
        padding={2}
        paddingTop={5}
      >
        <Button autoFocus onClick={onCancel}>
          Cerrar
        </Button>
        <LoadingButton label="importar usuarios" isReady={false}>
          {" "}
        </LoadingButton>
      </Stack>
    </Stack>
  );
}
