import { useState, useEffect, useRef } from "react";
import styles from './Cart.module.css'
import { crearPedido, enviarCorreoConfirmacion } from "../services/pedidos";

// 🔑 TU CLIENT ID LIVE DE PAYPAL
const PAYPAL_CLIENT_ID = "AdblM_bVAzI3-1ZxepHVfjmNTWsPM64jArJugsYnOTtXRZqDJWssHJxmNZE8R6Ij1XIG4K4UxyQoz37f"

const TRM = 4200

// 🛵 ZONAS DE DOMICILIO — BARRANQUILLA
const ZONAS_DOMI = [
  {
    zona: "Zona 1 — $5.000",
    precio: 5000,
    barrios: [
      "El Golf","Villa Country","El Prado","Alto Prado","Altos del Prado","Ciudad Jardín",
      "Los Nogales","Nuevo Horizonte","La Campiña","Granadillo","Bellavista","Campo Alegre",
      "Villa Tarel","Parque Rosado","San Francisco","El Porvenir","Barrio Abajo","El Rosario",
      "Las Delicias","Las Mercedes","Montecristo","La Concepción","El Castillo Norte"
    ]
  },
  {
    zona: "Zona 2 — $7.000",
    precio: 7000,
    barrios: [
      "Altamira","Altos de Riomar","Altos del Limón","Altos del Parque","Andalucía",
      "Buenavista","El Limoncito","El Poblado","La Castellana","La Floresta","Las Flores",
      "San Marino","San Salvador","San Vicente","Santa Mónica","Villa Campestre",
      "Villa Carolina","Villa del Este","Villa Santos","Villas del Puerto",
      "Paseo de la Castellana","Palmas del Río"
    ]
  },
  {
    zona: "Zona 3 — $9.000",
    precio: 9000,
    barrios: [
      "Buenos Aires","Ciudadela 20 de Julio","El Santuario","La Sierrita","La Victoria",
      "Las Américas","Las Cayenas","Las Gardenias","Las Granjas","Los Continentes",
      "Los Girasoles","Santa María","Santo Domingo de Guzmán","Villa San Carlos",
      "Carrizal","Cevillar","7 de Abril","20 de Julio","La Alboraya"
    ]
  },
  {
    zona: "Zona 4 — $12.000",
    precio: 12000,
    barrios: [
      "Buena Esperanza","California","Caribe Verde","Carlos Meisel","Chiquinquirá",
      "Ciudad Modesto","Colina Campestre","Cordialidad","Cuchilla de Villate","El Edén 2000",
      "El Romance","El Silencio","Evaristo Sourdis","La Esmeralda","La Florida",
      "La Libertad","La Pradera","Las Colinas","Las Estrellas","Las Malvinas",
      "Las Terrazas","Loma Fresca","Los Olivos I","Los Olivos II","Los Rosales",
      "Me Quejo","Nueva Granada","Olaya Herrera"
    ]
  },
  {
    zona: "Zona 5 — $15.000",
    precio: 15000,
    barrios: [
      "Atlántico","Bella Arena","El Campito","El Milagro","José Antonio Galán",
      "La Chinita","La Magdalena","Las Nieves","Las Palmas","Las Palmeras",
      "Los Laureles","Los Trupillos","Primero de Mayo","San Nicolás","Santa Elena",
      "Simón Bolívar","Universal I","Universal II","Villa Blanca","Villa del Carmen",
      "Alfonso López","Kennedy","Montes","Siape","Pumarejo","Rebolo"
    ]
  },
  {
    zona: "Zona 6 — $18.000 (Soledad / Puerto Colombia)",
    precio: 18000,
    barrios: [
      "Soledad","Barrio Caracolí","Ciudad Caribe","Ciudadela Metropolitana",
      "Puerto Colombia","Villa Campestre Norte","Juan Mina","La Playa","Malambo"
    ]
  },
]

function fmt(n)    { return '$' + Number(n).toLocaleString('es-CO') + ' COP' }
function fmtUSD(n) { return '~$' + (Number(n) / TRM).toFixed(2) + ' USD' }

// Carga el SDK de PayPal dinámicamente (solo una vez)
function usePaypalSDK(clientId) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (window.paypal) { setReady(true); return }
    const existing = document.querySelector('script[data-paypal-sdk]')
    if (existing) {
      existing.addEventListener('load', () => setReady(true))
      return
    }
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture&locale=es_CO`
    script.async = true
    script.setAttribute('data-paypal-sdk', 'true')
    script.onload  = () => setReady(true)
    script.onerror = () => console.error('Error cargando PayPal SDK')
    document.body.appendChild(script)
  }, [clientId])
  return ready
}

// Componente botones PayPal oficiales
function PayPalButtons({ amountCOP, onSuccess, onError }) {
  const containerRef = useRef(null)
  const rendered     = useRef(false)
  const amountUSD    = (amountCOP / TRM).toFixed(2)

  useEffect(() => {
    if (!window.paypal || !containerRef.current || rendered.current) return
    rendered.current = true
    window.paypal.Buttons({
      style: {
        layout : 'vertical',
        color  : 'blue',
        shape  : 'rect',
        label  : 'pay',
        height : 45,
      },
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: amountUSD,
              breakdown: {
                item_total: { currency_code: 'USD', value: amountUSD }
              }
            },
            description: 'NOVO.V — Gorras Edición Limitada'
          }]
        })
      },
      onApprove: async (data, actions) => {
        const details = await actions.order.capture()
        onSuccess(details)
      },
      onError: (err) => {
        console.error('PayPal error:', err)
        onError(err)
      },
      onCancel: () => {
        onError(new Error('Pago cancelado por el usuario'))
      }
    }).render(containerRef.current)
  }, [amountUSD])

  return <div ref={containerRef} style={{ marginTop: '1rem', minHeight: '55px' }} />
}

export default function Cart({ cart, isOpen, onClose, onAdd, onRemove, onDelete }) {
  const total       = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const paypalReady = usePaypalSDK(PAYPAL_CLIENT_ID)

  const [paso, setPaso]               = useState(1)
  const [formData, setFormData]       = useState({
    nombre: "", apellidos: "", whatsapp: "",
    correo: "", direccion: "", ciudad: ""
  })
  const [zonaSel, setZonaSel]         = useState(null)
  const [barrioSel, setBarrioSel]     = useState("")
  const [error, setError]             = useState("")
  const [success, setSuccess]         = useState(false)
  const [idPedido, setIdPedido]       = useState("")
  const [tipoPagoSel, setTipoPagoSel] = useState("")
  const [mostrarSubPago, setMostrarSubPago] = useState(false)
  const [paypalFase, setPaypalFase]   = useState('form')
  const [paypalDetails, setPaypalDetails] = useState(null)

  const esBarranquilla = formData.ciudad.toLowerCase().includes("barranquilla") ||
                         formData.ciudad.toLowerCase().includes("bquilla")

  const costoEnvio  = esBarranquilla ? (zonaSel ? zonaSel.precio : 0) : 0
  const descuento   = (tipoPagoSel === "descuento_bold" || tipoPagoSel === "descuento_paypal")
    ? Math.round(total * 0.8) : total
  const totalFinal  = descuento + costoEnvio

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
    if (e.target.name === "ciudad") { setZonaSel(null); setBarrioSel("") }
  }

  const irAPaso2 = () => { setPaso(2); setMostrarSubPago(false); setPaypalFase('form') }
  const irAPaso3 = (tipo) => { setTipoPagoSel(tipo); setPaso(3); setMostrarSubPago(false); setPaypalFase('form') }
  const volver = () => {
    if (paypalFase === 'paypal_buttons') { setPaypalFase('form') }
    else if (mostrarSubPago) { setMostrarSubPago(false) }
    else { setPaso(p => p - 1) }
    setError("")
  }

  const esPaypal = (t) => t === "paypal" || t === "descuento_paypal"
  const esBold   = (t) => t === "bold"   || t === "descuento_bold"

  const validarForm = () => {
    if (!formData.nombre || !formData.apellidos || !formData.whatsapp || !formData.direccion || !formData.ciudad) {
      setError("⚠️ Completa todos los datos antes de continuar"); return false
    }
    if (esBarranquilla && !zonaSel) {
      setError("⚠️ Selecciona tu zona de domicilio en Barranquilla"); return false
    }
    setError(""); return true
  }

  const handlePayNormal = async () => {
    if (!validarForm()) return
    try {
      const pedidoData = {
        ...formData,
        barrio: barrioSel,
        zonaDomi: zonaSel ? zonaSel.zona : "",
        costoDomi: costoEnvio,
        tipoPago: tipoPagoSel,
        total: Number(totalFinal || 0),
        productos: cart.map(p => ({ id: p.id, name: p.name, price: Number(p.price || 0), qty: Number(p.qty || 1) }))
      }
      const id = await crearPedido(pedidoData)
      setIdPedido(id)
      setSuccess(true)

      if (tipoPagoSel === "contraentrega" || esBold(tipoPagoSel)) {
        await enviarCorreoConfirmacion(pedidoData, id)
      }

      if (esBold(tipoPagoSel)) {
        setTimeout(() => {
          const url = "https://checkout.bold.co/payment/LNK_C4QRVVIMZB"
          const v = window.open(url, "_blank")
          if (!v) window.location.href = url
        }, 1500)
      }
    } catch (err) { console.error(err); setError("❌ Error al procesar el pedido. Intenta de nuevo.") }
  }

  const handleIrAPaypal = () => {
    if (!validarForm()) return
    if (!paypalReady) { setError("⚠️ PayPal aún está cargando, espera un momento"); return }
    setPaypalFase('paypal_buttons')
  }

  const handlePaypalSuccess = async (details) => {
    setPaypalDetails(details)
    try {
      const pedidoData = {
        ...formData,
        barrio: barrioSel,
        zonaDomi: zonaSel ? zonaSel.zona : "",
        costoDomi: costoEnvio,
        tipoPago: tipoPagoSel,
        total: Number(totalFinal || 0),
        paypalOrderId: details.id,
        paypalPayer: details.payer?.email_address || '',
        productos: cart.map(p => ({ id: p.id, name: p.name, price: Number(p.price || 0), qty: Number(p.qty || 1) }))
      }
      const id = await crearPedido(pedidoData)
      await enviarCorreoConfirmacion(pedidoData, id)
      setIdPedido(id); setSuccess(true)
    } catch (err) { console.error(err); setError("❌ Pago recibido pero error al guardar. Contacta por WhatsApp.") }
  }

  const handlePaypalError = (err) => {
    setError("❌ " + (err?.message || "Error en PayPal. Intenta de nuevo.")); setPaypalFase('form')
  }

  const titulos     = { 1: "Tu Carrito", 2: "Método de pago", 3: "Datos de envío" }
  const headerTitle = paypalFase === 'paypal_buttons' ? "Pago con PayPal"
    : mostrarSubPago ? "Elige cómo pagar" : titulos[paso]
  const showBack    = (paso > 1 || mostrarSubPago || paypalFase === 'paypal_buttons') && !success

  const paypalBtnStyle = { opacity: 1, cursor: 'pointer' }

  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={onClose} />
      <aside className={`${styles.panel} ${isOpen ? styles.open : ''}`} aria-label="Carrito de compras">
        <div className={styles.panelMeander} aria-hidden="true" />

        {/* Header */}
        <div className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {showBack && (
              <button onClick={volver} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '1.1rem', padding: '0 4px', lineHeight: 1 }}>←</button>
            )}
            <span className={styles.titleGlyph}>✦</span>
            <span className={styles.title}>{headerTitle}</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar carrito">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Indicador de pasos */}
        {!success && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '8px 0 4px' }}>
            {[1,2,3].map(n => (
              <div key={n} style={{ width: paso >= n ? '24px' : '8px', height: '4px', borderRadius: '2px', background: paso >= n ? 'var(--gold)' : 'rgba(201,169,110,0.2)', transition: 'all 0.3s ease' }} />
            ))}
          </div>
        )}

        {/* ── PASO 1: Productos ── */}
        {paso === 1 && (
          <>
            <div className={styles.items}>
              {cart.length === 0 ? (
                <div className={styles.empty}>
                  <p>Tu carrito está vacío</p>
                  <span>Agrega gorras para continuar</span>
                </div>
              ) : (
                cart.map((item, i) => (
                  <div key={i} className={styles.item}>
                    <div className={styles.itemImg}><img src={item.img} alt={item.name} className={styles.itemPhoto} /></div>
                    <div className={styles.itemInfo}>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemPrice}>{fmt(item.price)}</p>
                      <p className={styles.itemPriceUSD}>{fmtUSD(item.price)}</p>
                      <div className={styles.qtyRow}>
                        <button className={styles.qtyBtn} onClick={() => onRemove(i)}>−</button>
                        <span className={styles.qty}>{item.qty}</span>
                        <button className={styles.qtyBtn} onClick={() => onAdd(i)}>+</button>
                      </div>
                    </div>
                    <button className={styles.deleteBtn} onClick={() => onDelete(i)} aria-label="Eliminar">×</button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.subtotal}>
                  <span>Subtotal</span>
                  <div style={{ textAlign: 'right' }}>
                    <span className={styles.subtotalAmt}>{fmt(total)}</span>
                    <p className={styles.subtotalUSD}>{fmtUSD(total)}</p>
                  </div>
                </div>
                <button onClick={irAPaso2} style={{ width: '100%', background: 'var(--gold)', color: 'var(--obsidian)', border: 'none', padding: '0.9rem', fontFamily: 'var(--font-heading)', fontSize: '0.85rem', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: '1px' }}>
                  Continuar →
                </button>
                <p className={styles.footerNote}>Envíos a toda Colombia · Edición Limitada</p>
              </div>
            )}
          </>
        )}

        {/* ── PASO 2: Método de pago ── */}
        {paso === 2 && !mostrarSubPago && (
          <div className={styles.footer} style={{ overflowY: 'auto', flex: 1 }}>
            <div className={styles.subtotal}>
              <span>Total</span>
              <div style={{ textAlign: 'right' }}>
                <span className={styles.subtotalAmt}>{fmt(total)}</span>
                <p className={styles.subtotalUSD}>{fmtUSD(total)}</p>
              </div>
            </div>
            <p style={{ color: 'var(--gold-light)', opacity: 0.55, fontSize: '0.8rem', fontFamily: 'var(--font-body)', marginBottom: '1rem' }}>
              Elige cómo quieres pagar:
            </p>
            <div className={styles.payOptions}>
              <button className={styles.payBtnGreen} onClick={() => irAPaso3("contraentrega")}>
                Paga al recibir – {fmt(total)}<br/><span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{fmtUSD(total)}</span>
              </button>
              <button className={styles.payBtnBold} onClick={() => irAPaso3("bold")}>
                Pagar con Bold – {fmt(total)}<br/><span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{fmtUSD(total)}</span>
              </button>
              <button className={styles.payBtnPaypal} style={paypalBtnStyle} onClick={() => irAPaso3("paypal")}>
                💙 Pagar con PayPal – {fmt(total)}<br/>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                  {paypalReady ? fmtUSD(total) : '⏳ cargando SDK…'}
                </span>
              </button>
              <button className={styles.payBtnYellow} onClick={() => setMostrarSubPago(true)}>
                20% OFF hoy – {fmt(Math.round(total * 0.8))}<br/>
                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{fmtUSD(Math.round(total * 0.8))}</span>
              </button>
            </div>
            <p className={styles.footerNote}>Envíos a toda Colombia · Edición Limitada</p>
          </div>
        )}

        {/* ── SUB-SELECTOR: 20% OFF → Bold o PayPal ── */}
        {paso === 2 && mostrarSubPago && (
          <div className={styles.footer} style={{ overflowY: 'auto', flex: 1 }}>
            <div className={styles.subtotal}>
              <span>20% OFF</span>
              <div style={{ textAlign: 'right' }}>
                <span className={styles.subtotalAmt}>{fmt(Math.round(total * 0.8))}</span>
                <p className={styles.subtotalUSD}>{fmtUSD(Math.round(total * 0.8))}</p>
              </div>
            </div>
            <p style={{ color: 'var(--gold-light)', opacity: 0.55, fontSize: '0.8rem', fontFamily: 'var(--font-body)', marginBottom: '1rem' }}>
              ¿Cómo quieres pagar con el 20% de descuento?
            </p>
            <div className={styles.payOptions}>
              <button className={styles.payBtnBold} onClick={() => irAPaso3("descuento_bold")}>
                💜 Bold – {fmt(Math.round(total * 0.8))}<br/>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{fmtUSD(Math.round(total * 0.8))}</span>
              </button>
              <button className={styles.payBtnPaypal} style={paypalBtnStyle} onClick={() => irAPaso3("descuento_paypal")}>
                💙 PayPal – {fmt(Math.round(total * 0.8))}<br/>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                  {paypalReady ? fmtUSD(Math.round(total * 0.8)) : '⏳ cargando SDK…'}
                </span>
              </button>
            </div>
            <p className={styles.footerNote}>Envíos a toda Colombia · Edición Limitada</p>
          </div>
        )}

        {/* ── PASO 3: Datos + pago ── */}
        {paso === 3 && (
          <div className={styles.footer} style={{ overflowY: 'auto', flex: 1 }}>

            {/* ✅ Éxito */}
            {success && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ fontSize: '2rem', color: 'var(--gold)', marginBottom: '1rem' }}>✦</div>
                <p style={{ color: 'var(--gold)', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  {esPaypal(tipoPagoSel) ? '¡Pago recibido!' : '¡Pedido registrado!'}
                </p>
                {esPaypal(tipoPagoSel) && paypalDetails && (
                  <p style={{ color: 'var(--gold-light)', opacity: 0.6, fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                    ID PayPal: <code>{paypalDetails.id}</code>
                  </p>
                )}
                <p style={{ color: 'var(--gold-light)', opacity: 0.7, fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                  Guarda tu código de seguimiento
                </p>
                <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--gold-deep)', borderRadius: '2px', padding: '1rem', marginBottom: '0.8rem' }}>
                  <p style={{ color: 'var(--gold)', fontSize: '0.72rem', letterSpacing: '0.12em', marginBottom: '0.6rem', fontFamily: 'var(--font-heading)' }}>CÓDIGO DE SEGUIMIENTO</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <code style={{ color: 'var(--gold-light)', fontSize: '0.78rem', wordBreak: 'break-all' }}>{idPedido}</code>
                    <button onClick={() => navigator.clipboard.writeText(idPedido)}
                      style={{ background: 'none', border: '1px solid var(--gold-deep)', color: 'var(--gold)', padding: '3px 8px', cursor: 'pointer', fontSize: '0.75rem', borderRadius: '1px', whiteSpace: 'nowrap' }}>
                      Copiar
                    </button>
                  </div>
                </div>
                <p style={{ color: 'var(--gold-light)', opacity: 0.4, fontSize: '0.75rem', fontStyle: 'italic' }}>
                  Úsalo en "Rastrear" para ver el estado de tu envío
                </p>
              </div>
            )}

            {/* 📋 Formulario datos de envío */}
            {!success && paypalFase !== 'paypal_buttons' && (
              <>
                {/* Resumen de pago */}
                <div style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.15)', borderRadius: '2px', padding: '0.6rem 1rem', marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--gold-light)', opacity: 0.85 }}>
                  {tipoPagoSel === "contraentrega"    && `💚 Pago al recibir — ${fmt(total)}`}
                  {tipoPagoSel === "bold"             && `💜 Bold — ${fmt(total)}`}
                  {tipoPagoSel === "paypal"           && `💙 PayPal — ${fmt(total)}`}
                  {tipoPagoSel === "descuento_bold"   && `💛 20% OFF · Bold — ${fmt(Math.round(total * 0.8))}`}
                  {tipoPagoSel === "descuento_paypal" && `💛 20% OFF · PayPal — ${fmt(Math.round(total * 0.8))}`}
                  {costoEnvio > 0 && (
                    <span style={{ display: 'block', marginTop: '4px', fontSize: '0.78rem', opacity: 0.7 }}>
                      🛵 Domicilio: +{fmt(costoEnvio)}
                    </span>
                  )}
                  {costoEnvio > 0 && (
                    <span style={{ display: 'block', fontSize: '0.82rem', color: 'var(--gold)', fontWeight: 'bold', marginTop: '2px' }}>
                      Total con domi: {fmt(totalFinal)}
                    </span>
                  )}
                </div>

                <p style={{ color: 'var(--gold)', fontFamily: 'var(--font-heading)', fontSize: '0.72rem', letterSpacing: '0.1em', marginBottom: '0.8rem', opacity: 0.8 }}>DATOS DE ENVÍO</p>

                <div className={styles.formScroll}>
                  <input name="nombre"    placeholder="Nombre"             onChange={handleChange} className={styles.input} />
                  <input name="apellidos" placeholder="Apellidos"          onChange={handleChange} className={styles.input} />
                  <input name="whatsapp"  placeholder="WhatsApp"           onChange={handleChange} className={styles.input} />
                  <input name="correo"    placeholder="Correo electrónico" onChange={handleChange} className={styles.input} />
                  <input name="ciudad"    placeholder="Ciudad"             onChange={handleChange} className={styles.input} />
                  <input name="direccion" placeholder="Dirección"          onChange={handleChange} className={styles.input} />

                  {/* 🛵 ZONA DE DOMI — solo aparece si escribe Barranquilla */}
                  {esBarranquilla && (
                    <div style={{ marginTop: '0.6rem' }}>
                      <p style={{ color: 'var(--gold)', fontSize: '0.72rem', letterSpacing: '0.1em', marginBottom: '0.5rem', opacity: 0.8 }}>
                        🛵 ZONA DE DOMICILIO
                      </p>
                      <select
                        className={styles.input}
                        value={zonaSel ? zonaSel.zona : ""}
                        onChange={(e) => {
                          const found = ZONAS_DOMI.find(z => z.zona === e.target.value)
                          setZonaSel(found || null)
                          setBarrioSel("")
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <option value="">Selecciona tu zona...</option>
                        {ZONAS_DOMI.map(z => (
                          <option key={z.zona} value={z.zona}>{z.zona}</option>
                        ))}
                      </select>

                      {zonaSel && (
                        <select
                          className={styles.input}
                          value={barrioSel}
                          onChange={(e) => setBarrioSel(e.target.value)}
                          style={{ cursor: 'pointer', marginTop: '0.4rem' }}
                        >
                          <option value="">Selecciona tu barrio...</option>
                          {zonaSel.barrios.map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      )}

                      {zonaSel && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--gold)', opacity: 0.7, marginTop: '0.4rem', textAlign: 'right' }}>
                          🛵 Domicilio: <strong>{fmt(zonaSel.precio)}</strong>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {error && <p className={styles.msgError}>{error}</p>}

                {esPaypal(tipoPagoSel) ? (
                  <button onClick={handleIrAPaypal}
                    style={{ width: '100%', background: '#003087', color: '#fff', border: '2px solid #009cde', padding: '0.9rem', fontFamily: 'var(--font-heading)', fontSize: '0.85rem', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: '8px', marginTop: '1rem' }}>
                    💙 Continuar con PayPal →
                  </button>
                ) : (
                  <button onClick={handlePayNormal}
                    style={{ width: '100%', background: 'var(--gold)', color: 'var(--obsidian)', border: 'none', padding: '0.9rem', fontFamily: 'var(--font-heading)', fontSize: '0.85rem', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: '1px', marginTop: '1rem' }}>
                    Confirmar pedido — {fmt(totalFinal)}
                  </button>
                )}
                <p className={styles.footerNote}>Envíos a toda Colombia · Edición Limitada</p>
              </>
            )}

            {/* 💙 Botones PayPal SDK oficiales */}
            {!success && paypalFase === 'paypal_buttons' && (
              <>
                <div style={{ background: 'rgba(0,48,135,0.15)', border: '1px solid #009cde', borderRadius: '6px', padding: '0.8rem 1rem', marginBottom: '0.5rem', fontSize: '0.82rem', color: '#7ecff5', textAlign: 'center' }}>
                  💙 Pagando {fmt(totalFinal)} · {fmtUSD(totalFinal)}<br/>
                  <span style={{ fontSize: '0.72rem', opacity: 0.7 }}>Completa el pago usando el botón de abajo</span>
                </div>
                {error && <p className={styles.msgError}>{error}</p>}
                <PayPalButtons
                  amountCOP={totalFinal}
                  onSuccess={handlePaypalSuccess}
                  onError={handlePaypalError}
                />
                <p className={styles.footerNote} style={{ marginTop: '1rem' }}>Pago 100% seguro · PayPal cifra tus datos</p>
              </>
            )}

          </div>
        )}

      </aside>
    </>
  )
}
