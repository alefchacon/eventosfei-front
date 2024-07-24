import { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { Opacity } from "@mui/icons-material";
import { Stack } from "@mui/material";
import ListItem from "@mui/material/ListItem";

function createData(question, answer) {
  return { question, answer };
}

const StyledRating = styled(Rating)({
  "&&& .MuiRating-iconFilled": {
    color: "blue",
    opacity: 1,
  },
  "&&& .Mui-disabled": {
    opacity: 1.0,
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});

const rows = [
  createData(
    <Typography fontSize={{ xs: "small", md: "medium" }}>
      ¿Cómo calificaría la atención recibida por parte de la Coordinación de
      Eventos Académicos?
    </Typography>,
    <StyledRating disabled value={5}></StyledRating>
  ),
  createData("Ice cream sandwich", 237),
  createData("Eclair", 262),
  createData("Cupcake", 305),
  createData("Gingerbread", 356),
];

export default function BasicTable({ evaluation }) {
  function wrapCell(content) {
    if (isNumeric(content)) {
      return <Rating value={content}></Rating>;
    }

    return (
      <Typography fontSize={{ xs: "small", md: "medium" }}>
        {content}
      </Typography>
    );
  }

  function isNumeric(value) {
    return /^-?\d+$/.test(value);
  }

  function Question({ question, answer }) {
    return (
      <ListItem
        divider
        sx={{
          display: "flex",
          flexDirection: "column",

          alignItems: "start",
        }}
      >
        {wrapCell(question)}
        {wrapCell(answer)}
      </ListItem>
    );
  }

  return (
    <Stack gap={2}>
      {Object.entries(evaluation).map(([key, value]) => (
        <Question question={key} answer={value}></Question>
      ))}
    </Stack>
  );
}
