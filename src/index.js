import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Amplify } from "aws-amplify";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

Amplify.configure({
  Auth: {
    region: "us-east-1",
    userPoolId: "us-east-1_FMToSIaBs",
    userPoolWebClientId: "3lun12tjl375jodv2j6o9mmfkm",
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
