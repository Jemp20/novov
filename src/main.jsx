import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./pages/App.jsx";
import "./index.css";
import NovovChatbot from './components/NovovChatbot'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <NovovChatbot />
    </BrowserRouter>
  </React.StrictMode>
  
);