import React from "react";
import ReactDOM from "react-dom";

import "./assets/styles.css";

import App from "./components/app";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("app")
);

// TODO: pass data around using function arguments
// TODO: clean up symbol imports, remove symbols we aren't using anymore
