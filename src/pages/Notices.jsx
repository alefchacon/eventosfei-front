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
      <NoticeListRedux />
    </>
  );
}
