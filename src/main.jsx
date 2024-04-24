import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { DialogProvider } from "./providers/DialogProvider.jsx";
import { SnackbarProvider } from "./providers/SnackbarProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SnackbarProvider>
      <DialogProvider>
        <main>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          ,
        </main>
      </DialogProvider>
    </SnackbarProvider>
  </React.StrictMode>
);
