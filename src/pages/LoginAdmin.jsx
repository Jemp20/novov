import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import styles from "./LoginAdmin.module.css";

export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // ✅ Firebase se encarga del resto
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        setError("Correo o contraseña incorrectos");
      } else if (err.code === "auth/user-not-found") {
        setError("Usuario no existe");
      } else {
        setError("Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.brand}>NOVO·V</h1>
        <h2 className={styles.title}>Panel de Administración</h2>
        <p className={styles.subtitle}>— AΔM —</p>

        <label className={styles.label}>Correo Electrónico</label>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />

        <label className={styles.label}>Contraseña</label>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Cargando..." : "INGRESAR AL PANEL →"}
        </button>

        <p className={styles.restricted}>
          Acceso restringido - Solo administradores
        </p>
      </form>
    </div>
  );
}
