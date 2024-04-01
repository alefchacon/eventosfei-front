import { Button } from "@mui/material";
import { useState } from "react";

//import { uploadItem } from "../api/backendCalls";

export default function ItemUpload() {
  const [state, setState] = useState(0);

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  const handleSelectedFile = async (event) => {
    const files = Array.from(event.target.files);

    const statusStep = 100 / files.length;

    for (let i = 0; i < files.length; i++) {
      //uploadItem(files[i]);
      await sleep(100);
      setState((prevStep) => prevStep + statusStep);
    }
  };

  return (
    <form>
      <Button
        variant="contained"
        type="submit"
        size="large"
        color="secondary"
        component="label"
        fullWidth
      >
        Carica {state}
        <input type="file" onChange={handleSelectedFile} hidden multiple />
      </Button>
    </form>
  );
}