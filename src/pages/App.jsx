import { Routes, Route } from "react-router-dom";
import AppStore from "../AppStore.jsx";
import AppAdmin from "./AppAdmin.jsx";
import NovovChatbot from "../components/NovovChatbot";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/admin" element={<AppAdmin />} />
        <Route path="/" element={<AppStore />} />
      </Routes>

      <Routes>
        <Route path="/" element={<NovovChatbot />} />
      </Routes>
    </>
  );
}