import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { MenuItem, Select } from "@mui/material";

import {
  alphanumericRegex,
  emailRegex,
  idRolRegex,
} from "../validation/regexes";

const validateName = (params) => {
  const hasError = !alphanumericRegex.test(
    params.props.value?.toString() || ""
  );
  return { ...params.props, error: hasError };
};
const validateEmail = (params) => {
  const hasError = !emailRegex.test(params.props.value?.toString() || "");
  return { ...params.props, error: hasError };
};
const validateRol = (params) => {
  const hasError = !emailRegex.test(params.props.value?.toString() || "");
  return { ...params.props, error: hasError };
};

const columns = [
  {
    field: "names",
    headerName: "Nombre(s)",
    width: 150,
    editable: true,
    postProcessEditCellProps: validateName,
  },
  {
    field: "paternalName",
    headerName: "Apellido paterno",
    width: 150,
    editable: true,
    postProcessEditCellProps: validateName,
  },
  {
    field: "maternalName",
    headerName: "Apellido materno",
    width: 150,
    editable: true,
    postProcessEditCellProps: validateName,
  },
  {
    field: "email",
    headerName: "Email",
    width: 150,
    editable: true,
    postProcessEditCellProps: validateEmail,
  },
  {
    field: "rol",
    headerName: "Rol",
    width: 130,
    renderCell: (params) => (
      <Select
        value={params.value}
        onChange={(event) => handleStatusChange(event, params)}
        size="small"
        fullWidth
      >
        <MenuItem value={1}>Organizador</MenuItem>
        <MenuItem value={2}>Técnico Académico</MenuItem>
        <MenuItem value={3}>Responsable</MenuItem>
      </Select>
    ),
    postProcessEditCellProps: validateRol,
  },
];

const handleStatusChange = (event, params) => {
  params.row.rol = event.target.value;
};

const rows = [
  {
    id: 1,
    names: "Alice",
    paternalName: "asdf",
    maternalName: "asdf",
    email: "asdf",
    rol: 1,
  },
  {
    id: 2,
    names: "Bob123",
    paternalName: "asdf",
    maternalName: "asdf",
    email: "asdf",
    rol: 2,
  },
  {
    id: 3,
    names: "Charlie",
    paternalName: "asdf",
    maternalName: "asdf",
    email: "asdf",
    rol: 0,
  },
];

function EditableDataGrid({ users }) {
  const getRowClassName = (params) => {
    const hasError =
      !alphanumericRegex.test(params.row.names) ||
      !alphanumericRegex.test(params.row.paternalName) ||
      !alphanumericRegex.test(params.row.maternalName) ||
      !emailRegex.test(params.row.email) ||
      !/^(1|2|3)$/.test(params.row.rol);
    return hasError ? "error-row" : "";
  };

  const getCellClassName = (params) => {
    let hasError = false;
    switch (params.field) {
      case "rol":
        hasError = !/^(1|2|3)$/.test(params.formattedValue);
        return hasError ? "error-cell" : "";
      case "email":
        hasError = !emailRegex.test(params.formattedValue);
        return hasError ? "error-cell" : "";
      default:
        hasError = !alphanumericRegex.test(params.formattedValue);
        return hasError ? "error-cell" : "";
    }
  };

  return (
    <div style={{ height: 300, width: "100%" }}>
      <DataGrid
        rows={users}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getCellClassName={getCellClassName}
        getRowClassName={getRowClassName}
        sx={{
          "& .error-row": {
            backgroundColor: "rgba(255, 0, 0, 0.5) !important", // Semi-transparent red
          },
          "& .error-cell": {
            backgroundColor: "rgba(255, 0, 0, 1) !important", // Semi-transparent red
          },
          "& .MuiDataGrid-row:hover": {
            border: "2px solid black",
          },

          "& .MuiDataGrid-cell:focus-within": {
            outline: "none", // Remove focus within outline
          },
        }}
      />
    </div>
  );
}

export default EditableDataGrid;
