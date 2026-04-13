import styles from "./Admin.module.css"
import catStyles from "./AdminCatalogo.module.css"
import { useEffect, useState, useMemo } from "react"
import { db, auth } from "../firebase"
import {
  collection, onSnapshot, doc, updateDoc,
  orderBy, query, addDoc, deleteDoc, serverTimestamp
} from "firebase/firestore"
import { signOut } from "firebase/auth"

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TRM = 4200
function fmt(n) {
  const v = Number(n)
  if (n === undefined || n === null || n === "") return "—"
  if (isNaN(v)) return "—"
  return "$" + v.toLocaleString("es-CO") + " COP"
}
function fmtUSD(n) {
  const v = Number(n)
  if (n === undefined || n === null || n === "") return ""
  if (isNaN(v)) return ""
  return "~$" + (v / TRM).toFixed(2) + " USD"
}

const ESTADOS = ["en_proceso", "enviado", "en_camino", "entregado"]
const ESTADO_LABEL = { en_proceso: "En proceso", enviado: "Enviado", en_camino: "En camino", entregado: "Entregado" }
const ESTADO_EMOJI = { en_proceso: "⏳", enviado: "📦", en_camino: "🚚", entregado: "✅" }
const ESTADO_COLOR = { en_proceso: "#f59e0b", enviado: "#a855f7", en_camino: "#3b82f6", entregado: "#22c55e" }

const CATEGORIAS = ["classic", "snapback", "fitted", "trucker"]

// ─── Componente principal ──────────────────────────────────────────────────────
export default function Admin() {
  const [pedidos,   setPedidos]   = useState([])
  const [filtro,    setFiltro]    = useState("todos")
  const [expandido, setExpandido] = useState(null)
  const [busqueda,  setBusqueda]  = useState("")
  const [updating,  setUpdating]  = useState(null)
  const [vista,     setVista]     = useState("pedidos")

  useEffect(() => {
    const q = query(collection(db, "pedidos"), orderBy("fecha", "desc"))
    const unsub = onSnapshot(q, snap => {
      const data = snap.docs.map(d => {
        const raw   = d.data()
        const prods = Array.isArray(raw.productos)
          ? raw.productos
          : Object.values(raw.productos || {})
        const productosNorm = prods.map(p => ({
          ...p,
          price: Number(p.price ?? p.precio ?? p.valor ?? p.costo ?? 0) || 0,
          qty:   Number(p.qty   ?? p.cantidad ?? p.quantity ?? 1)        || 1,
          name:  p.name ?? p.nombre ?? p.producto ?? "",
        }))
        return { id: d.id, ...raw, productos: productosNorm }
      })
      setPedidos(data)
    })
    return () => unsub()
  }, [])

  const handleLogout = async () => { await signOut(auth) }

  const cambiarEstado = async (id, nuevoEstado) => {
    setUpdating(id + nuevoEstado)
    try { await updateDoc(doc(db, "pedidos", id), { estado: nuevoEstado }) }
    finally { setUpdating(null) }
  }

  const filtrados = pedidos
    .filter(p => filtro === "todos" ? p.estado !== "entregado" : p.estado === filtro)
    .filter(p => {
      if (!busqueda) return true
      const q = busqueda.toLowerCase()
      return (
        (p.nombre + " " + p.apellidos).toLowerCase().includes(q) ||
        (p.ciudad || "").toLowerCase().includes(q) ||
        (p.whatsapp || "").includes(q)
      )
    })

  const totales = {
    todos:      pedidos.length,
    en_proceso: pedidos.filter(p => p.estado === "en_proceso").length,
    enviado:    pedidos.filter(p => p.estado === "enviado").length,
    en_camino:  pedidos.filter(p => p.estado === "en_camino").length,
    entregado:  pedidos.filter(p => p.estado === "entregado").length,
  }

  const ingresos = pedidos
    .filter(p => p.estado === "entregado")
    .reduce((s, p) => s + Number(p.total || 0), 0)

  const clientes = useMemo(() => {
    return Object.values(
      pedidos.reduce((acc, p) => {
        const key = p.correo || p.whatsapp || p.id
        if (!key) return acc
        if (!acc[key]) {
          acc[key] = {
            nombre: (p.nombre || "") + " " + (p.apellidos || ""),
            correo: p.correo, whatsapp: p.whatsapp,
            ciudad: p.ciudad, totalPedidos: 0, totalGastado: 0,
          }
        }
        acc[key].totalPedidos++
        if (p.estado === "entregado") acc[key].totalGastado += p.total || 0
        return acc
      }, {})
    )
  }, [pedidos])

  const clientesFiltrados = clientes.filter(c => {
    if (!busqueda) return true
    const q = busqueda.toLowerCase()
    return (
      (c.nombre || "").toLowerCase().includes(q) ||
      (c.correo || "").toLowerCase().includes(q) ||
      (c.ciudad || "").toLowerCase().includes(q) ||
      (c.whatsapp || "").includes(q)
    )
  })

  return (
    <div className={styles.page}>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.sidebarGlyph}>⊹</span>
          <span className={styles.sidebarTitle}>NOVO·V</span>
        </div>
        <div className={styles.sidebarMeander} aria-hidden="true" />

        <nav className={styles.sidebarNav}>
          <div style={{ display:"flex", gap:"6px", marginBottom:"16px", flexWrap:"wrap" }}>
            {[
              { key:"pedidos",  label:"📦 Pedidos"  },
              { key:"clientes", label:"👤 Clientes" },
              { key:"catalogo", label:"🖼 Catálogo" },
            ].map(v => (
              <button
                key={v.key}
                className={`${styles.navItem} ${vista === v.key ? styles.navActive : ""}`}
                style={{ flex:"1 1 80px", justifyContent:"center" }}
                onClick={() => { setVista(v.key); setFiltro("todos") }}
              >{v.label}</button>
            ))}
          </div>

          {vista === "pedidos" && (
            <>
              <button className={`${styles.navItem} ${filtro === "todos" ? styles.navActive : ""}`} onClick={() => setFiltro("todos")}>
                <span className={styles.navDot} style={{ background:"var(--gold)" }} />
                <span>Todos los pedidos</span>
                <span className={styles.navBadge}>{totales.todos}</span>
              </button>
              {ESTADOS.map(e => (
                <button key={e} className={`${styles.navItem} ${filtro === e ? styles.navActive : ""}`} onClick={() => setFiltro(e)}>
                  <span className={styles.navDot} data-estado={e} />
                  <span>{ESTADO_LABEL[e]}</span>
                  <span className={styles.navBadge}>{totales[e]}</span>
                </button>
              ))}
            </>
          )}

          {vista === "clientes" && (
            <div className={styles.navItem} style={{ cursor:"default", opacity:0.7 }}>
              <span className={styles.navDot} style={{ background:"var(--gold)" }} />
              <span>Clientes únicos</span>
              <span className={styles.navBadge}>{clientes.length}</span>
            </div>
          )}
        </nav>

        <div className={styles.sidebarIngresos}>
          <span className={styles.ingresosLabel}>Ingresos entregados</span>
          <span className={styles.ingresosAmt}>{fmt(ingresos)}</span>
          <span className={styles.ingresosUSD}>{fmtUSD(ingresos)}</span>
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Cerrar sesion
        </button>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <main className={styles.main}>
        <div className={styles.topbar}>
          <div>
            <h1 className={styles.topbarTitle}>
              {vista === "clientes" ? "Clientes"
               : vista === "catalogo" ? "Catálogo"
               : filtro === "todos"  ? "Todos los pedidos"
               : ESTADO_LABEL[filtro]}
            </h1>
            <p className={styles.topbarSub}>
              {vista === "clientes"
                ? `${clientesFiltrados.length} cliente${clientesFiltrados.length !== 1 ? "s" : ""}`
                : vista === "catalogo" ? "Gestiona los productos del catálogo"
                : `${filtrados.length} pedido${filtrados.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          {vista !== "catalogo" && (
            <div className={styles.searchWrap}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className={styles.searchInput}
                placeholder="Buscar cliente, ciudad..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* ── Vista Catálogo ─────────────────────────────────────────────────── */}
        {vista === "catalogo" && <CatalogoAdmin />}

        {/* ── Vista Clientes ─────────────────────────────────────────────────── */}
        {vista === "clientes" && (
          <>
            <div className={styles.statsRow}>
              <div className={styles.statBox}>
                <span className={styles.statNum}>{clientes.length}</span>
                <span className={styles.statLbl}>👤 Clientes únicos</span>
              </div>
              <div className={`${styles.statBox} ${styles.statBoxGold}`}>
                <span className={styles.statNum}>{fmt(clientes.reduce((s,c) => s+c.totalGastado,0))}</span>
                <span className={styles.statNumUSD}>{fmtUSD(clientes.reduce((s,c) => s+c.totalGastado,0))}</span>
                <span className={styles.statLbl}>💰 Total generado</span>
              </div>
            </div>
            <div className={styles.list}>
              {clientesFiltrados.length === 0 && (
                <div className={styles.empty}><span>No hay clientes registrados</span></div>
              )}
              {clientesFiltrados.map((c,i) => (
                <div key={i} className={styles.card}>
                  <div className={styles.cardHead} style={{ cursor:"default" }}>
                    <div className={styles.cardHeadLeft}>
                      <div className={styles.clienteMeta}>
                        <span className={styles.clienteNombre}>{c.nombre.trim()}</span>
                        <span className={styles.clienteUbicacion}>{c.ciudad||"—"}</span>
                      </div>
                    </div>
                    <div className={styles.cardHeadRight}>
                      <span className={styles.pedidoItems}>🛍 {c.totalPedidos} pedido{c.totalPedidos!==1?"s":""}</span>
                      <span className={styles.pedidoTotal}>{fmt(c.totalGastado)}</span>
                      <span className={styles.pedidoTotalUSD}>{fmtUSD(c.totalGastado)}</span>
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.clienteGrid}>
                      <InfoRow label="Correo"   value={c.correo||"—"} />
                      <InfoRow label="WhatsApp" value={
                        c.whatsapp
                          ? <a href={`https://wa.me/57${c.whatsapp}`} target="_blank" rel="noreferrer" className={styles.waLink}>{c.whatsapp}</a>
                          : "—"
                      } />
                      <InfoRow label="Ciudad" value={c.ciudad||"—"} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Vista Pedidos ──────────────────────────────────────────────────── */}
        {vista === "pedidos" && (
          <>
            <div className={styles.statsRow}>
              <div className={styles.statBox}><span className={styles.statNum}>{totales.en_proceso}</span><span className={styles.statLbl}>⏳ En proceso</span></div>
              <div className={styles.statBox}><span className={styles.statNum}>{totales.en_camino}</span><span className={styles.statLbl}>🚚 En camino</span></div>
              <div className={styles.statBox}><span className={styles.statNum}>{totales.entregado}</span><span className={styles.statLbl}>✅ Entregados</span></div>
              <div className={`${styles.statBox} ${styles.statBoxGold}`}>
                <span className={styles.statNum}>{fmt(ingresos)}</span>
                <span className={styles.statNumUSD}>{fmtUSD(ingresos)}</span>
                <span className={styles.statLbl}>💰 Ingresos</span>
              </div>
            </div>

            <div className={styles.list}>
              {filtrados.length === 0 && (
                <div className={styles.empty}>
                  <span>No hay pedidos{filtro !== "todos" ? ` con estado "${ESTADO_LABEL[filtro]}"` : ""}</span>
                </div>
              )}
              {filtrados.map(pedido => (
                <div key={pedido.id} className={`${styles.card} ${expandido === pedido.id ? styles.cardOpen : ""}`}>
                  <div className={styles.cardHead} onClick={() => setExpandido(expandido === pedido.id ? null : pedido.id)}>
                    <div className={styles.cardHeadLeft}>
                      <span style={{ color: ESTADO_COLOR[pedido.estado] }}>
                        {ESTADO_EMOJI[pedido.estado]} {ESTADO_LABEL[pedido.estado]}
                      </span>
                      <div className={styles.clienteMeta}>
                        <span className={styles.clienteNombre}>{pedido.nombre} {pedido.apellidos}</span>
                        <span className={styles.clienteUbicacion}>{pedido.ciudad}</span>
                      </div>
                    </div>
                    <div className={styles.cardHeadRight}>
                      <span className={styles.pedidoTotal}>{fmt(pedido.total)}</span>
                      <span className={styles.pedidoTotalUSD}>{fmtUSD(pedido.total)}</span>
                      <span className={styles.pedidoItems}>{pedido.productos?.reduce((s,p)=>s+p.qty,0)||0} item(s)</span>
                      <span className={styles.chevron}>{expandido === pedido.id ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {expandido === pedido.id && (
                    <div className={styles.cardBody}>
                      <div className={styles.section}>
                        <p className={styles.sectionTitle}>Datos del cliente</p>
                        <div className={styles.clienteGrid}>
                          <InfoRow label="WhatsApp" value={
                            <a href={`https://wa.me/57${pedido.whatsapp}?text=Hola%20${encodeURIComponent(pedido.nombre)}%2C%20tu%20pedido%20de%20NOVO%C2%B7V%20est%C3%A1%20listo.%20%F0%9F%93%A6`}
                              target="_blank" rel="noreferrer" className={styles.waLink}>
                              {pedido.whatsapp}
                              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.534 5.845L0 24l6.335-1.651A11.938 11.938 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.008-1.37l-.36-.213-3.732.972.993-3.627-.234-.373A9.817 9.817 0 0 1 2.182 12c0-5.42 4.398-9.818 9.818-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z"/>
                              </svg>
                            </a>
                          } />
                          <InfoRow label="Correo"    value={pedido.correo}    />
                          <InfoRow label="Direccion" value={pedido.direccion} full />
                          <InfoRow label="Pago"      value={pedido.tipoPago === "descuento" ? "Con 20% OFF" : "Contraentrega"} />
                        </div>
                      </div>

                      <div className={styles.section}>
                        <p className={styles.sectionTitle}>Productos del pedido</p>
                        <div className={styles.productosTable}>
                          <div className={styles.tableHead}>
                            <span>Producto</span><span>Cant.</span><span>Precio unit.</span><span>Subtotal</span>
                          </div>
                          {(pedido.productos || []).map((p,i) => {
                            const tieneDescuento = pedido.tipoPago === "descuento"
                            const precioFinal    = tieneDescuento ? (p.price||0)*0.8 : (p.price||0)
                            const subtotalFinal  = precioFinal * (p.qty||0)
                            return (
                              <div key={i} className={styles.tableRow}>
                                <span>{p.name}</span>
                                <span>×{p.qty??""}</span>
                                <span>
                                  {tieneDescuento && <span className={styles.precioOriginal}>{fmt(p.price)}</span>}
                                  {fmt(precioFinal)}
                                  {tieneDescuento && <span className={styles.badgeDescuento}>-20%</span>}
                                  <span className={styles.cellUSD}>{fmtUSD(precioFinal)}</span>
                                </span>
                                <span>{fmt(subtotalFinal)}<span className={styles.cellUSD}>{fmtUSD(subtotalFinal)}</span></span>
                              </div>
                            )
                          })}
                          <div className={`${styles.tableRow} ${styles.tableTotal}`}>
                            <span>Total</span><span/><span/>
                            <span>{fmt(pedido.total)}<span className={styles.cellUSD}>{fmtUSD(pedido.total)}</span></span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.section}>
  <p className={styles.sectionTitle}>Pago</p>
  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
    <span style={{
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: 600,
      background: pedido.estado_pago === "pagado" ? "#22c55e22" : "#f59e0b22",
      color: pedido.estado_pago === "pagado" ? "#22c55e" : "#f59e0b",
    }}>
      {pedido.estado_pago === "pagado" ? "✅ Pagado" : "⏳ Pendiente de pago"}
    </span>
    {pedido.estado_pago !== "pagado" && (
      <button
        onClick={() => updateDoc(doc(db, "pedidos", pedido.id), { estado_pago: "pagado" })}
        style={{
          background: "#22c55e22",
          color: "#22c55e",
          border: "1px solid #22c55e44",
          borderRadius: "8px",
          padding: "4px 12px",
          fontSize: "0.8rem",
          cursor: "pointer",
        }}
      >
        💳 Marcar como pagado
      </button>
    )}
  </div>
</div>

<div className={styles.section}>
  <p className={styles.sectionTitle}>Estado del pedido</p>
  <div className={styles.estadoTracker}>
    {ESTADOS.map((e,i) => {
      const idx       = ESTADOS.indexOf(pedido.estado)
      const isPast    = i < idx
      const isCurr    = e === pedido.estado
      const isLoading = updating === pedido.id + e
      return (
        <button key={e}
          className={`${styles.estadoStep} ${isCurr?styles.estadoCurr:""} ${isPast?styles.estadoPast:""}`}
          onClick={() => cambiarEstado(pedido.id, e)}
          disabled={isLoading}
        >
          <span className={styles.estadoDot}>
            {isLoading ? <span className={styles.miniSpinner}/> : (isCurr||isPast) ? "✓" : i+1}
          </span>
          <span>{ESTADO_LABEL[e]}</span>
        </button>
      )
    })}
  </div>
</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

// ─── Sub-componente: Gestión del catálogo ──────────────────────────────────────
function CatalogoAdmin() {
  const [productos,   setProductos]   = useState([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando,    setEditando]    = useState(null)
  const [saving,      setSaving]      = useState(false)
  const [deleting,    setDeleting]    = useState(null)
  const [urlError,    setUrlError]    = useState("")
  const [uploading,   setUploading]   = useState(false)

  const CLOUD_NAME    = "duu6tud55"
  const UPLOAD_PRESET = "novov_uploads"

  const subirImagen = async (file) => {
    if (!file) return
    if (!file.type.startsWith("image/")) { setUrlError("Solo se permiten imágenes"); return }
    if (file.size > 10 * 1024 * 1024)   { setUrlError("La imagen debe pesar menos de 10MB"); return }
    setUploading(true)
    setUrlError("")
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("upload_preset", UPLOAD_PRESET)
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: fd })
      const json = await res.json()
      if (json.secure_url) {
        setForm(f => ({ ...f, imagen: json.secure_url }))
      } else {
        setUrlError("Error subiendo la imagen")
      }
    } catch {
      setUrlError("Error de conexión")
    } finally {
      setUploading(false)
    }
  }

  const emptyForm = { nombre:"", precio:"", categoria:"classic", colores:["#C9A96E"], activo:true, imagen:"" }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    const q = query(collection(db, "productos"), orderBy("creadoEn", "desc"))
    const unsub = onSnapshot(q, snap => {
      setProductos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [])

  const abrirNuevo = () => {
    setEditando(null)
    setForm(emptyForm)
    setUrlError("")
    setMostrarForm(true)
  }

  const abrirEditar = (p) => {
    setEditando(p)
    setForm({
      nombre:    p.nombre    || "",
      precio:    p.precio    || "",
      categoria: p.categoria || "classic",
      colores:   p.colores   || ["#C9A96E"],
      activo:    p.activo    ?? true,
      imagen:    p.imagen    || "",
    })
    setUrlError("")
    setMostrarForm(true)
  }

  const cancelar = () => {
    setMostrarForm(false)
    setEditando(null)
    setForm(emptyForm)
    setUrlError("")
  }

  const agregarColor = () => setForm(f => ({ ...f, colores: [...f.colores, "#888888"] }))
  const cambiarColor = (i, v) => setForm(f => { const c = [...f.colores]; c[i] = v; return { ...f, colores: c } })
  const quitarColor  = i => setForm(f => ({ ...f, colores: f.colores.filter((_,idx) => idx !== i) }))

  const guardar = async () => {
    if (!form.nombre.trim()) return alert("El nombre es requerido")
    if (!form.precio)        return alert("El precio es requerido")
    if (!form.imagen.trim()) { setUrlError("Pega la URL de la imagen"); return }
    try { new URL(form.imagen.trim()) } catch { setUrlError("La URL no es válida"); return }

    setSaving(true)
    try {
      const data = {
        nombre:    form.nombre.trim(),
        precio:    Number(form.precio),
        categoria: form.categoria,
        colores:   form.colores,
        activo:    form.activo,
        imagen:    form.imagen.trim(),
      }
      if (editando) {
        await updateDoc(doc(db, "productos", editando.id), data)
      } else {
        await addDoc(collection(db, "productos"), { ...data, creadoEn: serverTimestamp() })
      }
      cancelar()
    } catch (err) {
      console.error(err)
      alert("Error guardando el producto")
    } finally {
      setSaving(false)
    }
  }

  const toggleActivo = async (p) => {
    await updateDoc(doc(db, "productos", p.id), { activo: !p.activo })
  }

  const eliminar = async (p) => {
    if (!confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`)) return
    setDeleting(p.id)
    try { await deleteDoc(doc(db, "productos", p.id)) }
    finally { setDeleting(null) }
  }

  return (
    <div className={catStyles.wrap}>

      {!mostrarForm && (
        <button className={catStyles.btnNuevo} onClick={abrirNuevo}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Agregar producto
        </button>
      )}

      {mostrarForm && (
        <div className={catStyles.formCard}>
          <h3 className={catStyles.formTitle}>{editando ? "Editar producto" : "Nuevo producto"}</h3>

          <div className={catStyles.fields}>

            <div className={catStyles.fieldGroup}>
              <label className={catStyles.label}>Imagen del producto</label>
              <label className={catStyles.btnSubirArchivo} style={{ opacity: uploading ? 0.6 : 1, cursor: uploading ? "wait" : "pointer" }}>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={e => subirImagen(e.target.files[0])}
                  disabled={uploading}
                />
                {uploading ? "⏳ Subiendo..." : "📁 Seleccionar imagen desde PC"}
              </label>

              <span className={catStyles.fieldHint} style={{ margin: "6px 0" }}>— o pega una URL de Imgur —</span>

              <input
                className={`${catStyles.input} ${urlError ? catStyles.inputError : ""}`}
                placeholder="https://i.imgur.com/ejemplo.jpg"
                value={form.imagen}
                onChange={e => { setForm(f => ({ ...f, imagen: e.target.value })); setUrlError("") }}
              />

              {urlError && <span className={catStyles.errorMsg}>{urlError}</span>}

              {form.imagen && (() => { try { new URL(form.imagen); return true } catch { return false } })() && (
                <div className={catStyles.imgPreviewWrap} style={{ marginTop: "10px" }}>
                  <img
                    src={form.imagen}
                    alt="preview"
                    className={catStyles.imgPreview}
                    onError={e => { e.target.style.display = "none" }}
                    onLoad={e => { e.target.style.display = "block" }}
                  />
                </div>
              )}
            </div>

            <div className={catStyles.fieldGroup}>
              <label className={catStyles.label}>Nombre del producto</label>
              <input
                className={catStyles.input}
                placeholder="Ej: Noir Classic"
                value={form.nombre}
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              />
            </div>

            <div className={catStyles.fieldGroup}>
              <label className={catStyles.label}>Precio (COP)</label>
              <input
                className={catStyles.input}
                type="number"
                placeholder="Ej: 220000"
                value={form.precio}
                onChange={e => setForm(f => ({ ...f, precio: e.target.value }))}
              />
              {form.precio && (
                <span className={catStyles.fieldHint}>
                  ≈ ${(Number(form.precio) / TRM).toFixed(2)} USD
                </span>
              )}
            </div>

            <div className={catStyles.fieldGroup}>
              <label className={catStyles.label}>Categoría</label>
              <select
                className={catStyles.select}
                value={form.categoria}
                onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
              >
                {CATEGORIAS.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className={catStyles.fieldGroup}>
              <label className={catStyles.label}>Colores</label>
              <div className={catStyles.coloresRow}>
                {form.colores.map((c, i) => (
                  <div key={i} className={catStyles.colorItem}>
                    <input
                      type="color"
                      className={catStyles.colorPicker}
                      value={c}
                      onChange={e => cambiarColor(i, e.target.value)}
                    />
                    {form.colores.length > 1 && (
                      <button className={catStyles.btnQuitarColor} onClick={() => quitarColor(i)}>×</button>
                    )}
                  </div>
                ))}
                <button className={catStyles.btnAgregarColor} onClick={agregarColor}>+ Color</button>
              </div>
            </div>

            <div className={catStyles.fieldGroup}>
              <label className={catStyles.labelToggle}>
                <span className={catStyles.label}>Visible en tienda</span>
                <div
                  className={`${catStyles.toggle} ${form.activo ? catStyles.toggleOn : ""}`}
                  onClick={() => setForm(f => ({ ...f, activo: !f.activo }))}
                >
                  <div className={catStyles.toggleKnob} />
                </div>
              </label>
            </div>

          </div>

          <div className={catStyles.formActions}>
            <button className={catStyles.btnCancelar} onClick={cancelar} disabled={saving}>Cancelar</button>
            <button className={catStyles.btnGuardar}  onClick={guardar}  disabled={saving}>
              {saving ? "Guardando..." : editando ? "Guardar cambios" : "Agregar al catálogo"}
            </button>
          </div>
        </div>
      )}

      {productos.length === 0 && !mostrarForm && (
        <div className={catStyles.emptyState}>
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <p>No hay productos en el catálogo</p>
          <p style={{ fontSize:"0.8rem", opacity:0.5 }}>Agrega el primero con el botón de arriba</p>
        </div>
      )}

      <div className={catStyles.grid}>
        {productos.map(p => (
          <div key={p.id} className={`${catStyles.prodCard} ${!p.activo ? catStyles.prodInactivo : ""}`}>
            <div className={catStyles.prodImgWrap}>
              <img src={p.imagen} alt={p.nombre} className={catStyles.prodImg} />
              {!p.activo && <div className={catStyles.inactivoBadge}>Oculto</div>}
            </div>
            <div className={catStyles.prodInfo}>
              <p className={catStyles.prodNombre}>{p.nombre}</p>
              <p className={catStyles.prodPrecio}>{fmt(p.precio)}</p>
              <p className={catStyles.prodPrecioUSD}>{fmtUSD(p.precio)}</p>
              <p className={catStyles.prodCat}>{p.categoria}</p>
              {p.colores?.length > 0 && (
                <div className={catStyles.prodColores}>
                  {p.colores.map((c,i) => (
                    <span key={i} className={catStyles.prodColorDot} style={{ background:c }} />
                  ))}
                </div>
              )}
            </div>
            <div className={catStyles.prodActions}>
              <button
                className={`${catStyles.btnToggleActivo} ${p.activo ? catStyles.btnDesactivar : catStyles.btnActivar}`}
                onClick={() => toggleActivo(p)}
              >
                {p.activo ? "👁 Ocultar" : "👁 Mostrar"}
              </button>
              <button className={catStyles.btnEditar} onClick={() => abrirEditar(p)}>✏️ Editar</button>
              <button className={catStyles.btnEliminar} onClick={() => eliminar(p)} disabled={deleting === p.id}>
                {deleting === p.id ? "..." : "🗑"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function InfoRow({ label, value, full }) {
  return (
    <div className={`${styles.infoRow} ${full ? styles.infoRowFull : ""}`}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  )
}