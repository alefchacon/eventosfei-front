import { useState, useEffect, useRef, useLayoutEffect } from "react";

import { GetUsers } from "../api/UserService";

import { Box, Button, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Grow } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import DialogTypes from "../providers/DialogTypes";

import UserForm from "../forms/UserForm.jsx";
import { useDialog } from "../providers/DialogProvider.jsx";
import MultiUserForm from "../forms/MultiUserForm.jsx";

const columns = [
  {
    field: "names",
    headerName: "Nombres",
    width: 150,
    editable: true,
    Grow: 1,
  },
  {
    field: "paternalName",
    headerName: "Apellido paterno",
    width: 150,
    editable: true,
  },
  {
    field: "maternalName",
    headerName: "Apellido materno",
    width: 150,
    editable: true,
  },
  {
    field: "email",
    headerName: "Email",
    width: 150,
    editable: true,
  },
  {
    field: "job",
    headerName: "Puesto",
    width: 110,
  },
  {
    field: "rol.name",
    headerName: "Rol",
    type: "number",
    width: 110,
    valueGetter: (value, row) => `${row.rol.name}`,
  },
  {
    field: "edit",
    headerName: "Editar",
    type: "number",
    width: 110,
    renderCell: (value) => renderButton(value),
  },
];

function renderButton(props) {
  const { hasFocus, value } = props;
  const buttonElement = useRef(null);
  const rippleRef = useRef(null);
  useLayoutEffect(() => {
    if (hasFocus) {
      const input = buttonElement.current.querySelector("input");
      input?.focus();
    } else if (rippleRef.current) {
      rippleRef.current.stop({});
    }
  }, [hasFocus]);

  return (
    <strong>
      <Button
        ref={buttonElement}
        touchRippleRef={rippleRef}
        variant="contained"
        size="small"
        style={{ marginLeft: 16 }}
        tabIndex={hasFocus ? 0 : -1}
        onClick={() => console.log(value ?? "work in progress :D")}
        onKeyDown={(event) => {
          if (event.key === " ") {
            event.stopPropagation();
          }
        }}
      >
        Open
      </Button>
    </strong>
  );
}
function Table({ users }) {
  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        autoHeight
        rows={users}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 15]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}

export default function Users() {
  const [users, setUsers] = useState([]);

  const { showDialog } = useDialog();

  const matches = useMediaQuery("(min-width:768px)");

  const handleAddUser = (newUser) => {
    setUsers((oldUsers) => [...oldUsers, newUser]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseUsers = await GetUsers();
        if (responseUsers.status !== 200) {
          throw new Error("Network response was not ok");
        }
        setUsers(responseUsers.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Stack height={"100%"}>
        <Stack direction={"row"} spacing={2} padding={2}>
          <Button
            variant="contained"
            onClick={() =>
              showDialog(
                "Importar usuario",
                DialogTypes.multiUserForm,
                () => handleAddUser
              )
            }
          >
            Importar usuarios
          </Button>
          <Button
            variant="contained"
            onClick={() =>
              showDialog(
                "Registrar usuario",
                DialogTypes.userForm,
                () => handleAddUser
              )
            }
          >
            Registrar usuario
          </Button>
        </Stack>
        <div>
          {matches ? <Table users={users} /> : <div>Diseño responsivo 😎</div>}
        </div>
      </Stack>
    </>
  );
}
