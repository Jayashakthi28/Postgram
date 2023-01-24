import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: ["Bubbler"].join(","),
  },
  palette: {
    primary: {
      main: "rgb(216 180 254)",
    },
    secondary: {
      main: "#000",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH_DOMAIN}
      clientId={import.meta.env.VITE_AUTH_CLIENT_ID}
      redirectUri={window.location.origin}
    >
      <ThemeProvider theme={theme}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ThemeProvider>
    </Auth0Provider>
  </BrowserRouter>
);
