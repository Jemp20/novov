import { useState, useRef, useEffect } from 'react'
import { CapSmall } from './CapSVG'
import styles from './Catalog.module.css'
import { db } from '../firebase'
import { collection, onSnapshot } from 'firebase/firestore'

const TRM = 4200

function fmtCOP(n) {
  return '$' + Number(n).toLocaleString('es-CO') + ' COP'
}
function fmtUSD(n) {
  return '$' + (n / TRM).toFixed(2) + ' USD'
}

const FILTER_LABELS = {
  all:      'Olympo',
  classic:  'Baseball cap',
  snapback: 'Trucker cap',
  fitted:   'Cowboyhat',
  trucker:  'Durags',
}

export default function Catalog({ onAddToCart }) {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [active,   setActive]   = useState('all')
  const sectionRef = useRef(null)

  // Leer productos desde Firestore en tiempo real
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'productos'), snap => {
      const todos = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      // Filtrar activos en el cliente y ordenar por fecha descendente
      const activos = todos
        .filter(p => p.activo !== false)
        .sort((a, b) => (b.creadoEn?.seconds || 0) - (a.creadoEn?.seconds || 0))
      setProducts(activos)
      setLoading(false)
    }, () => setLoading(false))
    return () => unsub()
  }, [])

  // Animación reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.1 }
    )
    const el = sectionRef.current
    if (el) { el.classList.add('reveal'); observer.observe(el) }
    return () => observer.disconnect()
  }, [])

  // Categorías dinámicas basadas en los productos que existen
  const cats = ['all', ...new Set(products.map(p => p.categoria).filter(Boolean))]
  const visible = products.filter(p => active === 'all' || p.categoria === active)

  return (
    <section className={styles.section} id="catalog" ref={sectionRef}>
      <div className={styles.topDeco} aria-hidden="true">
        <span className={styles.decoLine} />
        <span className={styles.decoGlyph}>— ΚΑΤ —</span>
        <span className={styles.decoLine} />
      </div>

      <p className={styles.label}>Toda la Colección</p>
      <h2 className={styles.title}>
        Catálogo <em className={styles.em}>Permanente</em>
      </h2>

      <div className={styles.filters} role="group" aria-label="Filtrar colección">
        {cats.map(cat => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${active === cat ? styles.filterActive : ''}`}
            onClick={() => setActive(cat)}
          >
            {FILTER_LABELS[cat] ?? cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading && (
        <p style={{ textAlign: 'center', color: 'var(--gold-deep)', fontFamily: 'var(--font-heading)', letterSpacing: '0.2em', padding: '4rem' }}>
          Cargando colección...
        </p>
      )}

      {!loading && visible.length === 0 && (
        <p style={{ textAlign: 'center', color: 'rgba(201,169,110,0.4)', fontFamily: 'var(--font-heading)', letterSpacing: '0.2em', padding: '4rem' }}>
          No hay productos en esta categoría
        </p>
      )}

      <div className={styles.grid}>
        {visible.map((p, i) => (
          <article
            key={p.id}
            className={styles.card}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className={styles.imgWrap}>
              <img src={p.imagen} alt={p.nombre} className={styles.img} />
              <div className={styles.overlay}>
                <button
                  className={styles.overlayBtn}
                  onClick={() => onAddToCart({
                    id:    p.id,
                    name:  p.nombre,
                    price: p.precio,
                    img:   p.imagen,
                  })}
                >
                  + Carrito
                </button>
              </div>
            </div>

            <div className={styles.info}>
              <p className={styles.name}>{p.nombre}</p>
              <p className={styles.price}>{fmtCOP(p.precio)}</p>
              <p className={styles.priceUSD}>{fmtUSD(p.precio)}</p>
              {p.colores?.length > 0 && (
                <div className={styles.colors}>
                  {p.colores.map((c, ci) => (
                    <ColorDot key={ci} color={c} defaultActive={ci === 0} />
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function ColorDot({ color, defaultActive }) {
  const [active, setActive] = useState(defaultActive)
  return (
    <button
      className={`${styles.colorDot} ${active ? styles.colorDotActive : ''}`}
      style={{ background: color }}
      onClick={() => setActive(v => !v)}
      aria-label={`Color ${color}`}
    />
  )
}
