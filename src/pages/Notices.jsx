import { useState } from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import Tabs from "../components/Tabs";
import NoticeList from "./NoticeList";

export default function Notices({}) {
  return (
    <>
      <Tabs>
        <div label={"Notificaciones"}>
          <NoticeList idUsuario={0} />
        </div>
        <div label={"Evaluaciones"}>Evaluaciones</div>
        <div label={"Reservaciones"}>Reservaciones</div>
      </Tabs>
    </>
  );
}
