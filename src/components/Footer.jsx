import { useState } from 'react'
import styles from './Footer.module.css'
import Shipping from './Shipping'
import Returns from './Returns'
import Terms from './Terms'

export default function Footer() {
  const year = new Date().getFullYear()
  const [page, setPage] = useState(null)

  return (
    <>
      {/* Páginas informativas */}
      {page === 'shipping'  && <Shipping />}
      {page === 'returns'   && <Returns />}
      {page === 'terms'     && <Terms />}

      <footer className={styles.footer}>
        <div className={styles.topBorder} aria-hidden="true" />

        <div className={styles.inner}>
          <div className={styles.brand}>
            <span className={styles.logo}>NOVO·V</span>
            <p className={styles.tagline}>
              Gorras de alta distinción.<br />
              Hechas para quienes entienden la diferencia.
            </p>
            <div className={styles.greekOrnament} aria-hidden="true">⸻ ✦ ⸻</div>
          </div>

          <div className={styles.col}>
            <p className={styles.colTitle}>Colección</p>
            <ul className={styles.links}>
              <li><a href="#drops">Nuevos Drops</a></li>
              <li><a href="#catalog">Catálogo</a></li>
              <li><a href="#catalog">Clásicos</a></li>
              <li><a href="#catalog">Edición Limitada</a></li>
            </ul>
          </div>

          <div className={styles.col}>
            <p className={styles.colTitle}>Información</p>
            <ul className={styles.links}>
              <li><a href="#about">Nosotros</a></li>
              <li><a href="#" onClick={e => { e.preventDefault(); setPage(page === 'shipping' ? null : 'shipping') }}>Política de envíos</a></li>
              <li><a href="#" onClick={e => { e.preventDefault(); setPage(page === 'returns'  ? null : 'returns')  }}>Devoluciones</a></li>
              <li><a href="#" onClick={e => { e.preventDefault(); setPage(page === 'terms'    ? null : 'terms')    }}>Términos</a></li>
            </ul>
          </div>

          <div className={styles.col}>
            <p className={styles.colTitle}>Redes</p>
            <ul className={styles.links}>
              <li><a href="https://www.instagram.com/novo.v_?igsh=MXM2eGVwazRuMnJ1Yw==" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href="https://www.tiktok.com/@novo.v_?is_from_webapp=1&sender_device=pc" target="_blank" rel="noreferrer">TikTok</a></li>
              <li><a href="https://wa.me/573218074429" target="_blank" rel="noreferrer">WhatsApp</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.bottomLine} aria-hidden="true" />
          <div className={styles.bottomInner}>
            <p className={styles.copy}>© {year} NOVO.V — Todos los derechos reservados.</p>
            <p className={styles.motto}><em>Ars longa, vita brevis</em></p>
          </div>
        </div>
      </footer>
    </>
  )
}