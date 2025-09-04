import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SidebarProvider } from "./context/SidebarContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SidebarProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </SidebarProvider>
);