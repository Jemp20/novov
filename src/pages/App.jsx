import { Routes, Route } from "react-router-dom";
import AppStore from "../AppStore.jsx";
import AppAdmin from "./AppAdmin.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AppAdmin />} />
      <Route path="/" element={<AppStore />} />
    </Routes>
  );
}