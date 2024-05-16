import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function CustomToggleButton({ options, onChange, value }) {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setSelectedValue(newAlignment);

      onChange(newAlignment);
    }
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={selectedValue}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
      sx={{
        display: "flex",
      }}
    >
      {options.map((option) => (
        <ToggleButton key={option.id} value={option.id} sx={{ flexGrow: 1 }}>
          {option.name}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
