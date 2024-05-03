import { useState, useEffect } from "react";
import { useFormik } from "formik";

import { TextField, Stack, DialogActions, Button } from "@mui/material";

import { userSchema } from "../validation/modelSchemas/userSchema";
import { GetRoles } from "../api/RolesService.js";
import { StoreUser } from "../api/UserService.js";

import LoadingButton from "../components/LoadingButton";
import BasicSelect from "../components/Select";
import { Margin, Padding } from "@mui/icons-material";

export default function UserForm({ onCancel, onSubmit }) {
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseRoles = await GetRoles();
        if (responseRoles.status !== 200) {
          throw new Error("Network response was not ok");
        }
        setRoles(responseRoles.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const submitUser = async (values, actions) => {
    try {
      const response = await StoreUser(values);
      let addedUser = response.data.data;

      onSubmit(addedUser);
      actions.resetForm();
    } catch (error) {
      console.log(error);
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
      names: "",
      paternalName: "",
      maternalName: "",
      email: "",
      job: "",
      idRol: "",
    },
    validationSchema: userSchema,
    onSubmit: submitUser,
  });

  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
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
          variant="filled"
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
          variant="filled"
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
          variant="filled"
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
          variant="filled"
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
          variant="filled"
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
        paddingTop={5}
      >
        <Button autoFocus onClick={onCancel}>
          Cerrar
        </Button>
        <LoadingButton label="Guardar" isLoading={isSubmitting}></LoadingButton>
      </Stack>
    </form>
  );
}
