import { useRef, useEffect } from 'react'
import styles from './About.module.css'

const pillars = [
  { num: '100%', label: 'Materiales\nPremium',   glyph: 'Α' },
  { num: '—I',   label: 'Marca\nColombiana',     glyph: 'Κ' },
  { num: '∞',    label: 'Distinción\nGarantizada', glyph: 'Ω' },
]

export default function About() {
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
    <section className={styles.section} id="about" ref={sectionRef}>
      {/* Background frieze pattern */}
      <div className={styles.frieze} aria-hidden="true" />

      <div className={styles.inner}>
        {/* Left text column */}
        <div className={styles.textCol}>
          <p className={styles.label}>Nuestra Historia</p>

          <div className={styles.ornamentRow} aria-hidden="true">
            <span>❧</span>
            <span className={styles.ornLine} />
          </div>

          <h2 className={styles.title}>
            Diseño con<br />
            <em className={styles.em}>propósito</em>
          </h2>

          <p className={styles.body}>
            NOVO.V nació de una obsesión por el detalle. Como los maestros artesanos
            de la Antigua Grecia que esculpían cada mármol con devoción, cada gorra
            es concebida como una pieza de autor — donde la materia prima, la
            construcción y el acabado se elevan por encima del estándar.
          </p>
          <p className={styles.body}>
            No vendemos gorras. Ofrecemos distinción.
          </p>

          <div className={styles.quoteBlock}>
            <span className={styles.quoteGlyph}>"</span>
            <p className={styles.quote}>
              Ἀρχή ἥμισυ παντός — El comienzo es la mitad del todo.
            </p>
          </div>

          <a href="#catalog" className={styles.cta}>
            Ver colección
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        {/* Right pillars / stats */}
        <div className={styles.pillarsCol}>
          {pillars.map((p, i) => (
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
