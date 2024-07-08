import { useState, useEffect } from "react";
import { Typography, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";

import { useFormik } from "formik";
import moment from "moment";

import LoadingButton from "../components/LoadingButton.jsx";
import ToggleButton from "../components/ToggleButton.jsx";

import {
  UpdateReservation,
  AddReservation,
} from "../api/ReservationService.js";
import { useSnackbar } from "../providers/SnackbarProvider.jsx";
import { useNotices } from "../providers/NoticeProvider.jsx";
export default function ReservationResponse({
  onCancel,
  onSubmit,
  reservation = {
    space: {
      name: "space name",
      start: moment().format("dddd, MMMM Do YYYY"),
    },
  },
}) {
  const { showSnackbar } = useSnackbar();
  const { noticeAmount, decreaseNotices } = useNotices();

  const handleStatusIdChange = (newStatusId) => {
    if (newStatusId !== null) {
      setFieldValue("statusId", newStatusId);
    }
    console.log(newStatusId);
  };

  const submitResponse = async (values, actions) => {
    try {
      const request = {
        id: reservation.id,
        response: values.response,
        idEstado: values.statusId,
      };

      const response = await UpdateReservation(request);
      showSnackbar(response.data.message);
      await decreaseNotices(1);
    } catch (error) {
      showSnackbar(error.message);
    }
  };

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    setFieldValue,
  } = useFormik({
    initialValues: {
      statusId: 4,
      response: "",
    },
    onSubmit: submitResponse,
  });

  const reservationStatus = [
    { id: 2, name: "Aceptar" },
    { id: 4, name: "Rechazar" },
  ];

  return (
    <>
      {reservation !== null && (
        <>
          <Typography variant="h6">{reservation.space.name}</Typography>
          <Typography variant="h7">
            {moment(reservation.start).format("dddd, MMMM Do YYYY")}
          </Typography>
          <Typography gutterBottom>{`${moment(reservation.start).format(
            "HH:mm"
          )} - ${moment(reservation.end).format("HH:mm")}`}</Typography>
          <Typography variant="body1">{`${reservation.user.names} ${reservation.user.paternalName} ${reservation.user.maternalName}`}</Typography>
          <Typography variant="body2">{reservation.user.job}</Typography>
          <Typography variant="body2">{reservation.user.email}</Typography>
        </>
      )}

      <form autoComplete="off" onSubmit={handleSubmit}>
        <Stack direction={"column"} spacing={2} paddingTop={2}>
          <Divider></Divider>
          <div>
            <ToggleButton
              options={reservationStatus}
              value={values.statusId}
              onChange={handleStatusIdChange}
            ></ToggleButton>

            <TextField
              id="response"
              name="response"
              label="Respuesta"
              variant="filled"
              about="asdf"
              fullWidth
              multiline
              rows={5}
              disabled={isSubmitting}
              value={values.response}
              onChange={handleChange}
              onBlur={handleBlur}
            ></TextField>
          </div>
        </Stack>

        <Stack
          direction={"row"}
          spacing={3}
          justifyContent={"end"}
          paddingTop={5}
        >
          <Button autoFocus onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <LoadingButton
            label="Responder"
            isLoading={isSubmitting}
          ></LoadingButton>
        </Stack>
      </form>
    </>
  );
}
