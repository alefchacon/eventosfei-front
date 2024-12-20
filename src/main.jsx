import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider.jsx";
import { NoticeProvider } from "./providers/NoticeProvider.jsx";
import { DialogProvider } from "./providers/DialogProvider.jsx";
import { SnackbarProvider } from "./providers/SnackbarProvider.jsx";
import { LoadingProvider } from "./providers/LoadingProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SnackbarProvider>
        <AuthProvider>
          <LoadingProvider>
            <NoticeProvider>
              <DialogProvider>
                <main>
                  <App />
                </main>
              </DialogProvider>
            </NoticeProvider>
          </LoadingProvider>
        </AuthProvider>
      </SnackbarProvider>
    </BrowserRouter>
  </React.StrictMode>
);
