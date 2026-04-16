import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.bgImg} aria-hidden="true" />
      <div className={styles.bgOverlay} aria-hidden="true" />
      <div className={styles.bgGlow} aria-hidden="true" />

      <div className={styles.content}>
        <p className={styles.sup}>
          ✦ Colección Exclusiva · MMXXV ✦
        </p>

        <div className={styles.logoWrap}>
          <div className={styles.laurelLeft}>🌿</div>
          <h1 className={styles.title}>
            NOVO<em className={styles.dot}>·</em>V
          </h1>
          <div className={styles.laurelRight}>🌿</div>
        </div>

        <p className={styles.sub}>Gorras de Alta Distinción</p>
        <p className={styles.tagline}>
          Los ultimos son los primeros
        </p>

        <div className={styles.ctas}>
          <a href="#drops" className={styles.ctaPrimary}>Ver Colección →</a>
          <a href="#about" className={styles.ctaSecondary}>Nuestra Historia</a>
        </div>
      </div>
    </section>
  )
}
