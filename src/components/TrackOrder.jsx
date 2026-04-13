import { useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import styles from "./TrackOrder.module.css";

// ✅ Por esto
const PASOS = [
  { key: "en_proceso",  label: "Pedido recibido", icon: "📜" },
  { key: "enviado",     label: "Enviado",         icon: "🏺" },
  { key: "en_camino",   label: "En camino",       icon: "⚡" },
  { key: "entregado",   label: "Entregado",       icon: "✦" },
];
const ORDEN_ESTADO = ["en_proceso", "enviado", "en_camino", "entregado"];

export default function TrackOrder({ onClose }) {
  const [idInput, setIdInput] = useState("");
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

 // ✅ Pon esto
const buscarPedido = () => {
  const id = idInput.trim();
  if (!id) return;

  setLoading(true);
  setError("");
  setPedido(null);

  const ref = doc(db, "pedidos", id);
  const unsub = onSnapshot(ref, (snap) => {
    setLoading(false);
    if (!snap.exists()) {
      setError("No encontramos un pedido con ese ID. Verifica el código que te enviamos.");
    } else {
      setPedido({ id: snap.id, ...snap.data() });
    }
  }, () => {
    setLoading(false);
    setError("Error al consultar. Intenta de nuevo.");
  });

  return unsub;
};

  const pasoActual = pedido ? ORDEN_ESTADO.indexOf(pedido.estado) : -1;

  const formatFecha = (fecha) => {
    if (!fecha) return "";
    const d = fecha.toDate ? fecha.toDate() : new Date(fecha);
    return d.toLocaleDateString("es-CO", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.cerrar} onClick={onClose}>✕</button>

        <h2 className={styles.titulo}>Seguimiento de Pedido</h2>
        <p className={styles.subtitulo}>Ingresa el código de tu pedido para ver su estado</p>

        <div className={styles.buscador}>
          <input
            className={styles.input}
            placeholder="Ej: abc123xyz..."
            value={idInput}
            onChange={(e) => setIdInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscarPedido()}
          />
          <button
            className={styles.btnBuscar}
            onClick={buscarPedido}
            disabled={loading}
          >
            {loading ? "Buscando..." : "Consultar"}
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {pedido && (
          <div className={styles.resultado}>
            <div className={styles.infoCliente}>
              <p><span>Cliente:</span> {pedido.nombre}</p>
              <p><span>Fecha:</span> {formatFecha(pedido.fecha)}</p>
              <p><span>Total:</span> ${pedido.total?.toLocaleString("es-CO")}</p>
            </div>

            {/* Línea de progreso */}
            <div className={styles.timeline}>
              {PASOS.map((paso, i) => {
                const completado = i <= pasoActual;
                const activo = i === pasoActual;
                return (
                  <div key={paso.key} className={styles.paso}>
                    <div className={`${styles.circulo} ${completado ? styles.completado : ""} ${activo ? styles.activo : ""}`}>
                      {paso.icon}
                    </div>
                    <div className={styles.pasoLabel}>{paso.label}</div>
                    {i < PASOS.length - 1 && (
                      <div className={`${styles.linea} ${i < pasoActual ? styles.lineaCompletada : ""}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Productos */}
            {pedido.productos && pedido.productos.length > 0 && (
              <div className={styles.productos}>
                <h4>Productos</h4>
                <ul>
                  {pedido.productos.map((p, i) => (
                    <li key={i}>{p.name} × {p.qty} — ${(p.price * p.qty).toLocaleString("es-CO")}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className={styles.estadoTexto}>
              Estado actual: <strong>{pedido.estado?.toUpperCase()}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
