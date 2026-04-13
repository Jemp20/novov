import { useState, useRef, useEffect } from 'react'
import styles from './Contact.module.css'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const nombre = formData.get("nombre")
    const numero = formData.get("numero")
    const correo = formData.get("correo")
    const mensaje = formData.get("mensaje")

    const telefono = "573218074429" // número del dueño en formato internacional
    const texto = `Hola, soy ${nombre} ${numero} (${correo}).\n${mensaje}`
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`
    window.open(url, "_blank")

    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3500)
    e.target.reset()
  }

  const contacts = [
    { label: 'Instagram', value: '@novo.v', href: 'https://instagram.com' },
    { label: 'WhatsApp',  value: '+57 321 807 4429', href: 'https://wa.me/573218074429' },
    { label: 'Email',     value: 'hola@novov.co', href: 'mailto:hola@novov.co' },
    { label: 'Ubicación', value: 'Colombia', href: null },
  ]

  return (
    <section className={styles.section} id="contact" ref={sectionRef}>
      <div className={styles.friezeBar} aria-hidden="true" />

      <p className={styles.label}>Contacto</p>
      <h2 className={styles.title}>
        Habla con <em className={styles.em}>nosotros</em>
      </h2>

      <div className={styles.divider} aria-hidden="true">
        <span />
        <svg width="120" height="20" viewBox="0 0 120 20">
          <path d="M0,10 L30,10 L30,4 L36,4 L36,10 L42,10 L42,4 L48,4 L48,10 L54,10 L54,16 L60,16 L60,10 L66,10 L66,4 L72,4 L72,10 L78,10 L78,4 L84,4 L84,10 L90,10 L90,10 L120,10"
            stroke="#A07840" strokeWidth="1" fill="none" opacity="0.5"/>
        </svg>
        <span />
      </div>

      <div className={styles.grid}>
        <div className={styles.infoCol}>
          {contacts.map((c) => (
            <div key={c.label} className={styles.contactItem}>
              <span className={styles.contactLabel}>
                <span className={styles.labelGlyph}>✦</span>
                {c.label}
              </span>
              {c.href ? (
                <a href={c.href} target="_blank" rel="noreferrer" className={styles.contactValue}>
                  {c.value}
                </a>
              ) : (
                <span className={styles.contactValue}>{c.value}</span>
              )}
            </div>
          ))}
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formHeader} aria-hidden="true">
            <span className={styles.formCorner}>┌</span>
            <span className={styles.formTitle}>Mensaje</span>
            <span className={styles.formCorner}>┐</span>
          </div>

          <input
            type="text"
            name="nombre"
            placeholder="Tu nombre"
            className={styles.input}
            required
          />

          <input
            type="text"
            name="numero"
            placeholder="Tu número de teléfono"
            className={styles.input}
            required
          />

          <input
            type="email"
            name="correo"
            placeholder="Tu correo"
            className={styles.input}
            required
          />
          <textarea
            name="mensaje"
            placeholder="Tu mensaje..."
            className={`${styles.input} ${styles.textarea}`}
            required
          />

          <button type="submit" className={`${styles.submitBtn} ${submitted ? styles.submitted : ''}`}>
            {submitted ? '✓ Mensaje enviado' : 'Enviar mensaje'}
          </button>

          <div className={styles.formFooter} aria-hidden="true">
            <span className={styles.formCorner}>└</span>
            <span className={styles.footerLine} />
            <span className={styles.formCorner}>┘</span>
          </div>
        </form>
      </div>
    </section>
  )
}
