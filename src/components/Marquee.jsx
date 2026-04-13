import styles from './Marquee.module.css'

const items = [
  'Edición Limitada', 'Craftsmanship Premium', 'Novo·V Collection',
  'Alta Distinción', 'Exclusivo · Colombia', 'Ars Coronaria',
  'Edición Limitada', 'Craftsmanship Premium', 'Novo·V Collection',
  'Alta Distinción', 'Exclusivo · Colombia', 'Ars Coronaria',
]

export default function Marquee() {
  return (
    <div className={styles.marquee}>
      <div className={styles.topLine} />
      <div className={styles.track}>
        {items.map((item, i) => (
          <span key={i} className={styles.item}>
            {item}
            <span className={styles.sep}>⸻</span>
          </span>
        ))}
      </div>
      <div className={styles.bottomLine} />
    </div>
  )
}
