import { useRef, useEffect, useState } from 'react'
import styles from './Reviews.module.css'
import { db } from '../firebase'
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore'

export default function Reviews() {
  const sectionRef = useRef(null)
  const [reviews, setReviews] = useState([])
  const [form, setForm] = useState({ nombre: '', ciudad: '', texto: '', estrellas: 5 })
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mostrarForm, setMostrarForm] = useState(false)

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

  useEffect(() => {
    cargarReviews()
  }, [])

  const cargarReviews = async () => {
    try {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setReviews(data.length > 0 ? data : reviewsIniciales)
    } catch {
  setReviews([])
}
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.nombre || !form.texto) return
    setLoading(true)
    try {
      await addDoc(collection(db, 'reviews'), {
        ...form,
        estrellas: Number(form.estrellas),
        inicial: form.nombre.charAt(0).toUpperCase(),
        createdAt: serverTimestamp()
      })
      setEnviado(true)
      setForm({ nombre: '', ciudad: '', texto: '', estrellas: 5 })
      setMostrarForm(false)
      setTimeout(() => setEnviado(false), 3500)
      cargarReviews()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.section} id="reviews" ref={sectionRef}>
      <div className={styles.friezeBar} aria-hidden="true" />

      <p className={styles.label}>Testimonios</p>
      <h2 className={styles.title}>
        Lo que dicen <em className={styles.em}>nuestros clientes</em>
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
        {reviews.map((r, i) => (
          <div key={r.id || i} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.avatar}>{r.inicial}</div>
              <div className={styles.meta}>
                <span className={styles.nombre}>{r.nombre}</span>
                {r.ciudad && (
                  <span className={styles.ciudad}>
                    <span className={styles.labelGlyph}>✦</span>
                    {r.ciudad}
                  </span>
                )}
              </div>
              <div className={styles.estrellas}>
                {'★'.repeat(r.estrellas)}{'☆'.repeat(5 - r.estrellas)}
              </div>
            </div>
            <div className={styles.quoteGlyph} aria-hidden="true">"</div>
            <p className={styles.texto}>{r.texto}</p>
            <div className={styles.cardFooter} aria-hidden="true">
              <span className={styles.footerLine} />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.ctaRow}>
        {enviado && (
          <p className={styles.successMsg}>✦ ¡Gracias por tu reseña!</p>
        )}
        <button className={styles.ctaBtn} onClick={() => setMostrarForm(v => !v)}>
          {mostrarForm ? 'Cancelar' : '✦ Dejar mi reseña'}
        </button>
      </div>

      {mostrarForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formHeader} aria-hidden="true">
            <span className={styles.formCorner}>┌</span>
            <span className={styles.formTitle}>Tu experiencia</span>
            <span className={styles.formCorner}>┐</span>
          </div>

          <input
            name="nombre"
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={handleChange}
            className={styles.input}
            required
          />
          <input
            name="ciudad"
            placeholder="Tu ciudad"
            value={form.ciudad}
            onChange={handleChange}
            className={styles.input}
          />
          <textarea
            name="texto"
            placeholder="Cuéntanos tu experiencia..."
            value={form.texto}
            onChange={handleChange}
            className={`${styles.input} ${styles.textarea}`}
            required
          />

          <div className={styles.starsRow}>
            <span className={styles.starsLabel}>Calificación</span>
            <div className={styles.starsBtns}>
              {[1,2,3,4,5].map(n => (
                <button
                  key={n}
                  type="button"
                  className={`${styles.starBtn} ${Number(form.estrellas) >= n ? styles.starActive : ''}`}
                  onClick={() => setForm({ ...form, estrellas: n })}
                >★</button>
              ))}
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Enviando...' : 'Publicar reseña'}
          </button>

          <div className={styles.formFooter} aria-hidden="true">
            <span className={styles.formCorner}>└</span>
            <span className={styles.footerLine2} />
            <span className={styles.formCorner}>┘</span>
          </div>
        </form>
      )}
    </section>
  )
}


