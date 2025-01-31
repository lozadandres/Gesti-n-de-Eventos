import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Prepararemos la aplicación en React
ReactDOM.createRoot(document.getElementById("root")).render(
  // Crear una instrucción para encontrar errores mientras ejecuta
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
