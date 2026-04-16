import { useState } from "react";
import styles from "./Checkout.module.css";
import { crearPedido } from "../services/pedidos";

export default function Checkout({ cart, onClose }) {
  const [paso, setPaso] = useState(1);
  const [tipoPago, setTipoPago] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [idPedido, setIdPedido] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [totalFinal, setTotalFinal] = useState(0);
  const [loading, setLoading] = useState(false);

  const TRM = 4200;
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalConDescuento = Math.round(subtotal * 0.9);
  const total = tipoPago === "descuento" ? totalConDescuento : subtotal;

  const handlePago = (tipo) => {
    setTipoPago(tipo);
    setPaso(3);
  };

  const handleConfirmar = async () => {
    if (!nombre || !apellidos || !whatsapp || !correo || !direccion || !ciudad) {
      alert("Completa todos los datos de envío");
      return;
    }

    setLoading(true);
    try {
      const pedido = {
        nombre,
        apellidos,
        whatsapp,
        correo,
        direccion,
        ciudad,
        productos: cart,
        subtotal,
        total,
        tipoPago,
      };

      const id = await crearPedido(pedido);
      setIdPedido(id);
      setTotalFinal(total);

      if (tipoPago === "online" || tipoPago === "descuento") {
        const boldUrl = "https://checkout.bold.co/payment/LNK_C4QRVVIMZB";
        const ventana = window.open(boldUrl, "_blank");
        if (!ventana) window.location.href = boldUrl;
      }

      setConfirmed(true);
    } catch (error) {
      console.error(error);
      alert("Error al guardar pedido");
    } finally {
      setLoading(false);
    }
  };

  const copiarId = () => {
    navigator.clipboard.writeText(idPedido);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // ── Confirmación ──────────────────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className={styles.checkout}>
        <div className={styles.confirmacion}>
          <div className={styles.confirmIcon}>✦</div>
          <h2>¡Gracias, {nombre}!</h2>
          <p>Tu pedido fue registrado correctamente.</p>
          {(tipoPago === "online" || tipoPago === "descuento") && (
            <p>Tu total a pagar en Bold es <strong>${totalFinal.toLocaleString("es-CO")} COP</strong>.</p>
          )}
          {tipoPago === "contraentrega" && (
            <p>Pagarás <strong>${totalFinal.toLocaleString("es-CO")} COP</strong> al recibir tu pedido.</p>
          )}
          <p>Te enviaremos la confirmación a <strong>{correo}</strong>.</p>
          <div className={styles.idBox}>
            <p className={styles.idLabel}>Tu código de seguimiento</p>
            <div className={styles.idRow}>
              <code className={styles.idCode}>{idPedido}</code>
              <button className={styles.copiarBtn} onClick={copiarId}>
                {copiado ? "¡Copiado!" : "Copiar"}
              </button>
            </div>
            <p className={styles.idHint}>Guarda este código para rastrear tu pedido.</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Paso 1: Carrito ───────────────────────────────────────────────────────
  if (paso === 1) {
    return (
      <div className={styles.checkout}>
        <div className={styles.checkoutHeader}>
          <button className={styles.cerrarBtn} onClick={onClose}>✕</button>
          <span className={styles.paso}>✦ TU CARRITO</span>
          <div className={styles.pasosDots}>
            <span className={styles.dotActivo} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        </div>

        <div className={styles.cartItems}>
          {cart.map((item, i) => (
            <div key={i} className={styles.cartItem}>
              {item.imagen && <img src={item.imagen} alt={item.name} className={styles.cartItemImg} />}
              <div className={styles.cartItemInfo}>
                <p className={styles.cartItemName}>{item.name}</p>
                <p className={styles.cartItemPrice}>${(item.price * item.qty).toLocaleString("es-CO")} COP</p>
                <p className={styles.cartItemUSD}>~${((item.price * item.qty) / TRM).toFixed(2)} USD</p>
              </div>
              <div className={styles.cartItemQty}>
                <span>×{item.qty}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.subtotalRow}>
          <span>SUBTOTAL</span>
          <div>
            <p className={styles.subtotalAmt}>${subtotal.toLocaleString("es-CO")} COP</p>
            <p className={styles.subtotalUSD}>~${(subtotal / TRM).toFixed(2)} USD</p>
          </div>
        </div>

        <button className={styles.btnContinuar} onClick={() => setPaso(2)}>
          CONTINUAR →
        </button>
        <p className={styles.envioHint}>Envíos a toda Colombia · Edición Limitada</p>
      </div>
    );
  }

  // ── Paso 2: Método de pago ────────────────────────────────────────────────
  if (paso === 2) {
    return (
      <div className={styles.checkout}>
        <div className={styles.checkoutHeader}>
          <button className={styles.backBtn} onClick={() => setPaso(1)}>←</button>
          <span className={styles.paso}>✦ MÉTODO DE PAGO</span>
          <div className={styles.pasosDots}>
            <span className={styles.dot} />
            <span className={styles.dotActivo} />
            <span className={styles.dot} />
          </div>
          <button className={styles.cerrarBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.totalResumen}>
          <span>TOTAL</span>
          <div>
            <p className={styles.subtotalAmt}>${subtotal.toLocaleString("es-CO")} COP</p>
            <p className={styles.subtotalUSD}>~${(subtotal / TRM).toFixed(2)} USD</p>
          </div>
        </div>

        <p className={styles.elegirPago}>Elige cómo quieres pagar:</p>

        <button className={styles.btnContraentrega} onClick={() => handlePago("contraentrega")}>
          PAGA AL RECIBIR — ${subtotal.toLocaleString("es-CO")} COP
          <span>~${(subtotal / TRM).toFixed(2)} USD</span>
        </button>

        <button className={styles.btnOnline} onClick={() => handlePago("online")}>
          PAGAR EN LÍNEA — ${subtotal.toLocaleString("es-CO")} COP
          <span>~${(subtotal / TRM).toFixed(2)} USD</span>
        </button>

        <button className={styles.btnDescuento} onClick={() => handlePago("descuento")}>
          10% OFF HOY — ${totalConDescuento.toLocaleString("es-CO")} COP
          <span>~${(totalConDescuento / TRM).toFixed(2)} USD</span>
        </button>

        <p className={styles.envioHint}>Envíos a toda Colombia · Edición Limitada</p>
      </div>
    );
  }

  // ── Paso 3: Datos de envío ────────────────────────────────────────────────
  if (paso === 3) {
    return (
      <div className={styles.checkout}>
        <div className={styles.checkoutHeader}>
          <button className={styles.backBtn} onClick={() => setPaso(2)}>←</button>
          <span className={styles.paso}>✦ DATOS DE ENVÍO</span>
          <div className={styles.pasosDots}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dotActivo} />
          </div>
          <button className={styles.cerrarBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.tipoPagoTag}>
          {tipoPago === "contraentrega" && "🤝 Paga al recibir"}
          {tipoPago === "online" && "💜 Pago en línea"}
          {tipoPago === "descuento" && "🏷 10% OFF — Pago en línea"}
          {" "}— ${total.toLocaleString("es-CO")} COP · ~${(total / TRM).toFixed(2)} USD
        </div>

        <p className={styles.sectionTitle}>DATOS DE ENVÍO</p>

        <input className={styles.input} placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
        <input className={styles.input} placeholder="Apellidos" value={apellidos} onChange={e => setApellidos(e.target.value)} />
        <input className={styles.input} placeholder="WhatsApp" type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
        <input className={styles.input} placeholder="Correo electrónico" type="email" value={correo} onChange={e => setCorreo(e.target.value)} />
        <input className={styles.input} placeholder="Dirección" value={direccion} onChange={e => setDireccion(e.target.value)} />
        <input className={styles.input} placeholder="Ciudad" value={ciudad} onChange={e => setCiudad(e.target.value)} />

        <button className={styles.btnConfirmar} onClick={handleConfirmar} disabled={loading}>
          {loading ? "PROCESANDO..." : "CONFIRMAR PEDIDO"}
        </button>

        <p className={styles.envioHint}>Envíos a toda Colombia · Edición Limitada</p>
      </div>
    );
  }
}