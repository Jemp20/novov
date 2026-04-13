import { useRef, useEffect } from 'react'
import styles from './Shipping.module.css'

const items = [
  { num: '1–2',  label: 'Días hábiles\nde procesamiento', glyph: 'Δ' },
  { num: '3–7',  label: 'Días hábiles\nde entrega',       glyph: 'Τ' },
  { num: '100%', label: 'Envíos\nrastreables',            glyph: 'Φ' },
]

export default function Shipping() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.08 }
    )
    const el = sectionRef.current
    if (el) { el.classList.add('reveal'); observer.observe(el) }
    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.section} id="shipping" ref={sectionRef}>
      <div className={styles.frieze} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.textCol}>
          <p className={styles.label}>Envíos</p>

          <div className={styles.ornamentRow} aria-hidden="true">
            <span>❧</span>
            <span className={styles.ornLine} />
          </div>

          <h2 className={styles.title}>
            Política de<br />
            <em className={styles.em}>envíos</em>
          </h2>

          <p className={styles.body}>
            Todos los pedidos se procesan en 1 a 2 días hábiles después de
            confirmado el pago. Despachamos a toda Colombia con transportadora
            de confianza y seguimiento en tiempo real.
          </p>

          <p className={styles.body}>
            Ciudades principales (Bogotá, Medellín, Cali, Barranquilla):
            2 a 4 días hábiles. Municipios y zonas rurales: 5 a 9 días hábiles.
          </p>

          <div className={styles.infoBlock}>
            <div className={styles.infoItem}>
              <span className={styles.infoTitle}>Costo de envío</span>
              <span className={styles.infoText}>Calculado según ciudad de destino al finalizar la compra.</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoTitle}>Seguimiento</span>
              <span className={styles.infoText}>Usa tu código de pedido en la sección "Rastrear" del sitio.</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoTitle}>Envíos internacionales</span>
              <span className={styles.infoText}>Contáctanos por WhatsApp antes de hacer tu pedido.</span>
            </div>
          </div>

          <div className={styles.quoteBlock}>
            <span className={styles.quoteGlyph}>"</span>
            <p className={styles.quote}>
              Tu pedido llega sellado, empacado y listo para coleccionar.
            </p>
          </div>
        </div>

        <div className={styles.pillarsCol}>
          {items.map((p, i) => (
            <div key={i} className={styles.pillar}>
              <div className={styles.pillarCapital} aria-hidden="true">
                <span className={styles.pillarGlyph}>{p.glyph}</span>
              </div>
              <div className={styles.pillarShaft}>
                <span className={styles.pillarNum}>{p.num}</span>
                <span className={styles.pillarLabel}>
                  {p.label.split('\n').map((line, li) => (
                    <span key={li}>{line}<br /></span>
                  ))}
                </span>
              </div>
              <div className={styles.pillarBase} aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
