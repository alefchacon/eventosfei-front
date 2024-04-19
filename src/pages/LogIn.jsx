import { useState } from "react";
import {
  Stack,
  TextField,
  Button,
  Typography,
  InputAdornment,
  InputLabel,
  IconButton,
  FormHelperText,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FilledInput from "@mui/material/FilledInput";

import HelpIcon from "@mui/icons-material/Help";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useFormik } from "formik";

import { userSchema } from "../validation/modelSchemas/userSchema";

import { LogIn } from "../api/UserService";

export default function LogInPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = async (values, actions) => {
    await LogIn(values);
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
      email: "",
      password: "",
    },
    validationSchema: userSchema,
    onSubmit,
  });

  return (
    <>
      <Stack
        spacing={5}
        height={"100%"}
        padding={"20vw"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Typography variant="h4">Iniciar Sesión</Typography>

        <form autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            id="email"
            name="email"
            fullWidth
            label="Usuario"
            variant="filled"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
            disabled={isSubmitting}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            //onClick={resetLoginError}
            error={Boolean(errors.email) && touched.email}
            helperText={
              touched.email && (Boolean(errors.email) ? errors.email : " ")
            }
          ></TextField>
          <FormControl variant="filled" fullWidth>
            <InputLabel htmlFor="filled-adornment-password">
              Password
            </InputLabel>
            <FilledInput
              fullWidth
              id="password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              disabled={isSubmitting}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              //onClick={resetLoginError}
              error={Boolean(errors.password) && touched.password}
            />
            <FormHelperText id="password-helper-text" error>
              {touched.password &&
                (Boolean(errors.password) ? errors.password : " ")}
            </FormHelperText>
          </FormControl>
          <Stack spacing={2}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              endIcon={<LoginIcon></LoginIcon>}
            >
              Iniciar Sesión
            </Button>
            <Button fullWidth variant="text">
              ¿Problemas para ingresar?
            </Button>
            <Button fullWidth variant="text">
              Solicitar acceso
            </Button>
          </Stack>
        </form>
      </Stack>
    </>
  );
}
