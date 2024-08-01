import { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

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
          paddingTop: 5,
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
          max={stepAmount}
          valueLabelDisplay="off"
          disabled={isDisabled}
          marks={steps}
          sx={{
            "& .MuiSlider-mark": {
              width: "2em",
              height: "2em",
              borderRadius: "50%",
              backgroundColor: "#a7caed",
              "&.MuiSlider-markActive": {
                opacity: 1,
                backgroundColor: "primary.main",
              },
            },

            "& .MuiSlider-thumb": {
              width: "3em",
              height: "3em",
              marginBottom: "1em",
            },
            "& .MuiSlider-rail": {
              width: "5px",
            },
          }}
        />
      </Box>
    </div>
  );
}
