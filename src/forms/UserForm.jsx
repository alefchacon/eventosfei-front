import { useState, useEffect } from "react";
import { useFormik } from "formik";

import { TextField, Stack, DialogActions, Button } from "@mui/material";

import { userSchema } from "../validation/modelSchemas/userSchema";
import { GetRoles } from "../api/RolesService.js";
import { StoreUser, UpdateUser } from "../api/UserService.js";

import LoadingButton from "../components/LoadingButton";
import BasicSelect from "../components/Select";
import { Margin, Padding } from "@mui/icons-material";
import { useSnackbar } from "../providers/SnackbarProvider.jsx";

export default function UserForm({ onCancel, onSubmit, user }) {
  const [roles, setRoles] = useState([]);
  const [isEdit, setIsEdit] = useState(user !== undefined);

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      const responseRoles = await GetRoles();
      console.log(responseRoles);
      setRoles(responseRoles.data);
    };
    fetchData();
  }, []);

  const submitUser = async (values, actions) => {
    let response = null;
    try {
      if (isEdit) {
        values.id = user.id;
        response = await UpdateUser(values);
        showSnackbar(response.data.message);
        let updatedUser = response.data.data;
        onSubmit(updatedUser);
      } else {
        response = await StoreUser(values);
        actions.resetForm();
        let addedUser = response.data.data;
        onSubmit(addedUser);
        showSnackbar(response.data.message);
      }
    } catch (error) {
      showSnackbar(error.response.data.message);
    }
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues: {
      names: user ? user.names : "",
      paternalName: user ? user.paternalName : "",
      maternalName: user ? user.maternalName : "",
      email: user ? user.email : "",
      job: user ? user.job : "",
      idRol: user ? user.rol.id : "",
    },
    validationSchema: userSchema,
    onSubmit: submitUser,
  });

  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      <Stack flexDirection={{ md: "column", xs: "column-reverse" }}>
        <Stack spacing={1}>
          <BasicSelect
            name="idRol"
            id="idRol"
            label="Rol"
            items={roles}
            value={values.idRol}
            disabled={isSubmitting}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.idRol}
            errors={errors.idRol}
          ></BasicSelect>

          <TextField
            fullWidth
            name="names"
            id="names"
            label="Nombre(s)"
            placeholder="Pablo"
            disabled={isSubmitting}
            value={values.names}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(errors.names) && touched.names}
            helperText={
              touched.names && Boolean(errors.names) ? errors.names : " "
            }
          ></TextField>
          <TextField
            fullWidth
            name="paternalName"
            id="paternalName"
            label="Apellido paterno"
            placeholder="Juárez"
            disabled={isSubmitting}
            value={values.paternalName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(errors.paternalName) && touched.paternalName}
            helperText={
              touched.paternalName && Boolean(errors.paternalName)
                ? errors.paternalName
                : " "
            }
          ></TextField>
          <TextField
            fullWidth
            name="maternalName"
            id="maternalName"
            label="Apellido materno"
            placeholder="Suárez"
            disabled={isSubmitting}
            value={values.maternalName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(errors.maternalName) && touched.maternalName}
            helperText={
              touched.maternalName && Boolean(errors.maternalName)
                ? errors.maternalName
                : " "
            }
          ></TextField>
          <TextField
            fullWidth
            name="job"
            id="job"
            label="Puesto"
            placeholder="Jefe de Carrera"
            disabled={isSubmitting}
            value={values.job}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(errors.job) && touched.job}
            helperText={touched.job && Boolean(errors.job) ? errors.job : " "}
          ></TextField>
          <TextField
            fullWidth
            name="email"
            id="email"
            label="E-mail"
            placeholder="pajuarez@uv.mx"
            disabled={isSubmitting}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(errors.email) && touched.email}
            helperText={
              touched.email && Boolean(errors.email) ? errors.email : " "
            }
          ></TextField>
        </Stack>
        <Stack
          direction={"row"}
          spacing={3}
          justifyContent={"end"}
          padding={"20px 0px"}
        >
          <Button autoFocus onClick={onCancel}>
            Cerrar
          </Button>
          <LoadingButton
            label="Guardar"
            isLoading={isSubmitting}
          ></LoadingButton>
        </Stack>
      </Stack>
    </form>
  );
}
