import { useState, useEffect, useRef, useLayoutEffect } from "react";

import { GetUsers } from "../api/UserService";

import { Box, Button, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Grow } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Grid from "@mui/material/Grid";

import DialogTypes from "../providers/DialogTypes";

import UserForm from "../forms/UserForm.jsx";
import { useDialog } from "../providers/DialogProvider.jsx";
import MultiUserForm from "../forms/MultiUserForm.jsx";
import CardUser from "../components/CardUser.jsx";
import UserList from "../components/UserList.jsx";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const { showDialog } = useDialog();

  const matches = useMediaQuery("(min-width:768px)");

  const handleStoreUser = (newUser) => {
    setUsers((oldUsers) => [...oldUsers, newUser]);
  };

  const handleUpdateUser = (updatedUser) => {
    console.log(updatedUser);
    console.log(users);

    const newUsers = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsers(newUsers);
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
        <Stack
          direction={"row"}
          spacing={2}
          padding={2}
          display={"flex"}
          justifyContent={"end"}
        >
          <Button
            variant="contained"
            onClick={() =>
              showDialog(
                "Importar usuario",
                DialogTypes.multiUserForm,
                () => handleStoreUser
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
                () => handleStoreUser
              )
            }
          >
            Registrar usuario
          </Button>
        </Stack>

        <>
          {loading && (
            <Container
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                top: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress></CircularProgress>
            </Container>
          )}
          <Grid container spacing={2} padding={{ md: 2 }}>
            {users.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <CardUser
                  user={item}
                  onUpdate={handleUpdateUser}
                  key={item.id}
                ></CardUser>
              </Grid>
            ))}
          </Grid>
        </>
      </Stack>
    </>
  );
}
