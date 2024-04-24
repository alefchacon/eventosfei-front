import { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function InputFileUpload({ onUpload }) {
  const [file, setFile] = useState(null);

  function csvToArrayOfObjects(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const csv = event.target.result;
        const lines = csv
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line);
        const headers = lines[0].split(",");

        const result = lines.slice(1).map((line) => {
          const data = line.split(",");
          const obj = headers.reduce((acc, header, index) => {
            acc[header] = data[index];
            return acc;
          }, {});
          return obj;
        });

        for (let i = 0; i < result.length; i++) {
          result[i].id = i;
        }

        resolve(result);
      };

      reader.onerror = (error) => reject(error);

      reader.readAsText(file);
    });
  }

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const users = await csvToArrayOfObjects(selectedFile);
      onUpload(users);
    } else {
      console.log("No file selected");
    }
  };

  return (
    <Button
      component="label"
      role={undefined}
      variant="outlined"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload file
      <VisuallyHiddenInput type="file" onChange={handleFileChange} />
    </Button>
  );
}
