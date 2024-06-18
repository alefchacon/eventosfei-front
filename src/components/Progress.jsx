import { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/*
const marks = [
  {
    value: 4,
  },
  {
    value: 3,
  },
  {
    value: 2,
  },
  {
    value: 1,
  },
  {
    value: 0,
  },
];
*/

export default function Progress({
  stepAmount = 7,
  value,
  isDisabled,
  changePage,
}) {
  const handleChange = (event, newValue) => {
    changePage(newValue); // Call the parent's callback function with the new value
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
    <div className="progress-vertical">
      <Box
        sx={{
          height: "70vh",
          padding: 5,
          paddingTop: 10,
          bgcolor: "white",
          flexDirection: "column",
          justifyContent: "center",
          justifyItems: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Slider
          onChangeCommitted={handleChange}
          track="inverted"
          orientation="vertical"
          aria-label="Custom marks"
          defaultValue={0}
          value={value}
          min={0}
          step={1}
          max={5}
          valueLabelDisplay="off"
          disabled={isDisabled}
          marks={steps}
          sx={{
            // Increase the size of the marks
            "& .MuiSlider-mark": {
              width: "5vh",
              height: "5vh",
              borderRadius: "50%",
              backgroundColor: "#a7caed",
              "&.MuiSlider-markActive": {
                opacity: 1,
                backgroundColor: "primary.main", // Custom color for the active mark
              },
            },

            // Custom styling for the thumb to ensure it doesn't get overshadowed
            "& .MuiSlider-thumb": {
              width: "6vh",
              height: "6vh",
              marginBottom: "2vh",
            },
            // Make sure the rail doesn't overshadow the marks
            "& .MuiSlider-rail": {
              width: "5px",
            },
          }}
        />
      </Box>
    </div>
  );
}
