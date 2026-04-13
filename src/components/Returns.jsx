import { useRef, useEffect } from 'react'
import styles from './Returns.module.css'

const items = [
  { num: '5',    label: 'Días para\nreportar',      glyph: 'Σ' },
  { num: '48h',  label: 'Respuesta\ngarantizada',   glyph: 'Ρ' },
  { num: '0%',   label: 'Costo de\ngestión',        glyph: 'Ε' },
]

export default function Returns() {
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
    <section className={styles.section} id="returns" ref={sectionRef}>
      <div className={styles.frieze} aria-hidden="true" />

      <div className={styles.inner}>
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

        <div className={styles.textCol}>
          <p className={styles.label}>Devoluciones</p>

          <div className={styles.ornamentRow} aria-hidden="true">
            <span>❧</span>
            <span className={styles.ornLine} />
          </div>

          <h2 className={styles.title}>
            Política de<br />
            <em className={styles.em}>devoluciones</em>
          </h2>

          <p className={styles.body}>
            Aceptamos devoluciones por defecto de fabricación, producto incorrecto
            enviado o daño durante el transporte. Tienes 5 días calendario desde
            que recibes tu pedido para reportar cualquier inconveniente.
          </p>

          <div className={styles.infoBlock}>
            <div className={styles.infoItem}>
              <span className={styles.infoTitle}>Cómo solicitar</span>
              <span className={styles.infoText}>Escríbenos por WhatsApp con tu código de pedido, descripción y fotos del producto.</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoTitle}>Condición del producto</span>
              <span className={styles.infoText}>Sin uso, con etiquetas originales y en su empaque original.</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoTitle}>No aplica devolución</span>
              <span className={styles.infoText}>Talla incorrecta elegida por el cliente, producto usado o sin empaque.</span>
            </div>
          </div>

          <div className={styles.quoteBlock}>
            <span className={styles.quoteGlyph}>"</span>
            <p className={styles.quote}>
              Al ser edición limitada, revisa bien las medidas antes de confirmar tu compra.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
