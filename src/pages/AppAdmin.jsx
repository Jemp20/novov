import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import LoginAdmin from "./LoginAdmin";
import Admin from "./Admin";

export default function AppAdmin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return <h1 style={{ textAlign: "center" }}>Cargando...</h1>;
  }

  if (!user) {
    return <LoginAdmin />;
  }


  return <Admin />;
}