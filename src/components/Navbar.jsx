import { useState, useEffect } from 'react'
import styles from './Navbar.module.css'
import logoImg from '../assets/Novo.jpg'
import TrackOrder from './TrackOrder'

export default function Navbar({ onCartOpen, cartCount }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [trackOpen, setTrackOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      {/* Greek top border */}
      <div className={styles.meander} aria-hidden="true" />

      <div className={styles.inner}>
        <a href="#home" className={styles.logo}>
          <img src={logoImg} alt="NOVO·V" className={styles.logoImg} />
        </a>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {['drops','catalog','about','contact'].map(section => (
            <li key={section}>
              <a
                href={`#${section}`}
                className={styles.link}
                onClick={() => setMenuOpen(false)}
              >
                {section === 'drops' ? 'Drops' :
                 section === 'catalog' ? 'Colección' :
                 section === 'about' ? 'Nosotros' : 'Contacto'}
              </a>
            </li>
          ))}
        </ul>

        <button 
  className={styles.link} 
  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
  onClick={() => setTrackOpen(true)}
>
  RASTREAR
</button>

        <button className={styles.cartBtn} onClick={onCartOpen} aria-label="Carrito">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
        </button>
      </div>

    {trackOpen && <TrackOrder onClose={() => setTrackOpen(false)} />}

    </nav>
  )
}
