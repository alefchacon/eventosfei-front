import { useState } from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import Tabs from "../components/Tabs";
import NoticeList from "./NoticeList";
import ReservationList from "./ReservationListRedux";

export default function Notices({}) {
  return (
    <>
      <Tabs>
        <div label={"Notificaciones"}>
          <NoticeList idUsuario={0} />
        </div>
        <div label={"Evaluaciones"}></div>
        <div label={"Reservaciones"}>
          <ReservationList
            idUsuario={0}
            showButtons={false}
            showFilters={false}
          />
        </div>
        <div label={"Reservaciones (usuario)"}>
          <ReservationList
            idUsuario={1}
            showButtons={false}
            showFilters={false}
          />
        </div>
      </Tabs>
    </>
  );
}
