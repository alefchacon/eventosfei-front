import { useState } from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import Tabs from "../components/Tabs";
import NoticeList from "./NoticeList";
import ReservationList from "./ReservationListRedux";
import NoticeListRedux from "./NoticeListRedux";

export default function Notices({}) {
  return (
    <>
      <Tabs>
        <div label={"Notificaciones"}>
          <NoticeListRedux />
        </div>
        <div label={"Evaluaciones"}></div>
        <div label={"Reservaciones"}>
          <NoticeListRedux />
        </div>
        <div label={"Reservaciones (usuario)"}>
          <NoticeListRedux showButtons={false} showFilters={false} />
        </div>
      </Tabs>
    </>
  );
}
