import { useRef, useEffect } from 'react'
import styles from './Terms.module.css'

const items = [
  { num: 'COP',  label: 'Moneda\nprincipal',        glyph: 'Λ' },
  { num: 'SSL',  label: 'Pagos\ncifrados',           glyph: 'Π' },
  { num: '©',    label: 'Diseños\nprotegidos',       glyph: 'Ψ' },
]

export default function Terms() {
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
    <section className={styles.section} id="terms" ref={sectionRef}>
      <div className={styles.frieze} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.textCol}>
          <p className={styles.label}>Legal</p>

          <div className={styles.ornamentRow} aria-hidden="true">
            <span>❧</span>
            <span className={styles.ornLine} />
          </div>

          <h2 className={styles.title}>
            Términos y<br />
            <em className={styles.em}>condiciones</em>
          </h2>

          <p className={styles.body}>
            Al navegar y realizar compras en este sitio aceptas los presentes
            términos. NOVO.V se reserva el derecho de modificarlos en cualquier
            momento sin previo aviso.
          </p>

          <div className={styles.infoBlock}>
            <div className={styles.infoItem}>
              <span className={styles.infoTitle}>Precios y pagos</span>
              <span className={styles.infoText}>Todos los precios están en pesos colombianos (COP) con equivalente aproximado en USD. Los pagos se procesan de forma segura a través de Bold o PayPal.</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoTitle}>Disponibilidad</span>
              <span className={styles.infoText}>Al ser edición limitada, NOVO.V no garantiza disponibilidad continua. Una vez agotado un modelo no se repone.</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoTitle}>Propiedad intelectual</span>
              <span className={styles.infoText}>Todos los diseños, imágenes y logos son propiedad exclusiva de NOVO.V. Está prohibida su reproducción sin autorización escrita.</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoTitle}>Contacto</span>
              <span className={styles.infoText}>Para dudas sobre estos términos escríbenos por WhatsApp o al correo indicado en el sitio.</span>
            </div>
          </div>

          <div className={styles.quoteBlock}>
            <span className={styles.quoteGlyph}>"</span>
            <p className={styles.quote}>
              NOVO.V es una marca colombiana. Todos los derechos reservados.
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
