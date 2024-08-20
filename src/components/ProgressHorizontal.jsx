import { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Rotate90DegreesCcw,
  Rotate90DegreesCcwOutlined,
  Rotate90DegreesCw,
} from "@mui/icons-material";

/*
const marks = [
  {
    value: 0,
  },
  {
    value: 1,
  },
  {
    value: 2,
  },
  {
    value: 3,
  },
  {
    value: 4,
  },
];*/

export default function Progress({
  stepAmount = 5,
  isDisabled,
  value,
  changePage,
}) {
  const handleChange = (event, newValue) => {
    changePage(4 - newValue);
  };

  const [steps, setSteps] = useState([]);
  useEffect(() => {
    let marks = [];
    for (let i = 0; i < stepAmount; i++) {
      marks.push({
        value: i,
      });
    }
    setSteps(marks);
  }, []);

  return (
    <div className="progress-horizontal">
      <Box
        display={"flex"}
        justifyContent={"center"}
        justifyItems={"center"}
        alignContent={"center"}
        alignItems={"center"}
        bgcolor={"white"}
        margin={1.5}
        padding={0}
        paddingBottom={0}
      >
        <Slider
          onChangeCommitted={handleChange}
          className="slider-horizontal"
          aria-label="Custom marks"
          track="inverted"
          disabled={isDisabled}
          defaultValue={0}
          value={value}
          min={0}
          step={1}
          max={stepAmount}
          valueLabelDisplay="off"
          marks={steps}
          sx={{
            width: "80%",
            // Increase the size of the marks
            "& .MuiSlider-mark": {
              width: "3vh",
              height: "3vh",

              borderRadius: "50%",
              backgroundColor: "#a7caed",
              "&.MuiSlider-markActive": {
                opacity: 1,
                backgroundColor: "primary.main", // Custom color for the active mark
              },
            },
            // Adjust the mark label position if necessary
            "& .MuiSlider-markLabel": {
              color: "primary.main", // Custom color for the label
            },
            // Custom styling for the thumb to ensure it doesn't get overshadowed
            "& .MuiSlider-thumb": {
              width: "4vh",
              height: "4vh",
              marginLeft: "10px",
            },
            // Make sure the rail doesn't overshadow the marks
          }}
        />
      </Box>
    </div>
  );
}
