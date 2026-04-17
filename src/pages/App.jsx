import { Routes, Route, useLocation } from "react-router-dom";
import AppStore from "../AppStore.jsx";
import AppAdmin from "./AppAdmin.jsx";
import NovovChatbot from "../components/NovovChatbot";

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      <Routes>
        <Route path="/admin" element={<AppAdmin />} />
        <Route path="/" element={<AppStore />} />
      </Routes>

      {!isAdmin && <NovovChatbot />}
    </>
  );
}