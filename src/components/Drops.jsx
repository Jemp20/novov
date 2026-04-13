import { useRef, useEffect } from 'react'
import { CapObsidian, CapAurum, CapIvory } from './CapSVG'
import styles from './Drops.module.css'
import Negra1 from "../assets/gorras/Negra1.jpg";
import Roja2 from "../assets/gorras/Roja2.jpg";
import Azul3 from "../assets/gorras/Azul3.jpg";

const TRM = 4200 // 1 USD = 4,200 COP — actualiza este valor cuando quieras

const drops = [
  {
    id: 'obsidian',
    name: 'Obsidian I',
    price: 280000,
    oldPrice: 350000,
    tag: 'Drop 01',
    badge: 'Nuevo',
    img: Negra1,
    desc: 'La oscuridad forjada en corona',
  },
  {
    id: 'aurum',
    name: 'Aurum Elite',
    price: 260000,
    oldPrice: 320000,
    tag: 'Drop 02',
    badge: 'Nuevo',
    img: Roja2,
    desc: 'Dorado como el sol de Helios',
  },
  {
    id: 'ivory',
    name: 'Ivory Night',
    price: 240000,
    oldPrice: 300000,
    tag: 'Drop 03',
    badge: 'Nuevo',
    img: Azul3,
    desc: 'La sabiduría de Atenea en tu frente',
  },
]

function fmtCOP(n) {
  return '$' + Number(n).toLocaleString('es-CO') + ' COP'
}

function fmtUSD(n) {
  return '~$' + (n / TRM).toFixed(2) + ' USD'
}

export default function Drops({ onAddToCart }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.1 }
    )
    const el = sectionRef.current
    if (el) {
      el.classList.add('reveal')
      observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.section} id="drops" ref={sectionRef}>
      <div className={styles.topDeco} aria-hidden="true">
        <span className={styles.decoLine} />
        <span className={styles.decoGlyph}>⸻ ✦ ⸻</span>
        <span className={styles.decoLine} />
      </div>

      <p className={styles.label}>Nuevos Lanzamientos</p>
      <h2 className={styles.title}>
        Limitless <em className={styles.em}>Drop</em>
      </h2>
      <p className={styles.subtitle}>
        Piezas únicas, concebidas como ofrendas a los dioses del estilo
      </p>

      <div className={styles.grid}>
        {drops.map((drop, i) => (
          <article
            key={drop.id}
            className={styles.card}
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            {drop.badge && (
              <div className={styles.badge}>{drop.badge}</div>
            )}

            <span className={styles.cornerTL} aria-hidden="true">✦</span>
            <span className={styles.cornerTR} aria-hidden="true">✦</span>

            <div className={styles.imgWrap}>
              <img src={drop.img} alt={drop.name} className={styles.img}/>
            </div>

            <div className={styles.info}>
              <p className={styles.tag}>{drop.tag}</p>
              <p className={styles.name}>{drop.name}</p>
              <p className={styles.desc}>{drop.desc}</p>
              <div className={styles.greekKey} aria-hidden="true" />
              <p className={styles.price}>
                <s>{fmtCOP(drop.oldPrice)}</s>
                <strong>{fmtCOP(drop.price)}</strong>
              </p>
              <p className={styles.priceUSD}>{fmtUSD(drop.price)}</p>
            </div>

            <button
              className={styles.addBtn}
              onClick={() => onAddToCart(drop)}
            >
              + Agregar al Carrito
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
