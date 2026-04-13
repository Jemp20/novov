export default function WhatsAppButton() {
  const phone = "573218074429"
  const message = encodeURIComponent("Hola, tengo una pregunta sobre NOVO.V 👋")
  const url = `https://wa.me/${phone}?text=${message}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: '#25D366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.1)'
        e.currentTarget.style.boxShadow = '0 6px 28px rgba(37,211,102,0.55)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,211,102,0.4)'
      }}
    >
      <svg viewBox="0 0 32 32" width="30" height="30" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.492.648 4.832 1.782 6.86L2 30l7.34-1.762A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.54 11.54 0 0 1-5.88-1.608l-.42-.252-4.356 1.044 1.08-4.236-.276-.432A11.56 11.56 0 0 1 4.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.344-8.668c-.348-.174-2.06-1.016-2.38-1.132-.32-.116-.552-.174-.784.174-.232.348-.9 1.132-1.104 1.364-.204.232-.406.26-.754.086-.348-.174-1.47-.542-2.8-1.726-1.034-.922-1.732-2.06-1.936-2.408-.204-.348-.022-.536.152-.708.158-.156.348-.406.522-.61.174-.202.232-.348.348-.58.116-.232.058-.436-.028-.61-.088-.174-.784-1.892-1.074-2.59-.282-.68-.57-.588-.784-.598-.204-.01-.436-.012-.668-.012s-.61.086-.928.434c-.318.348-1.218 1.19-1.218 2.902s1.246 3.366 1.42 3.598c.174.232 2.452 3.744 5.942 5.252.83.358 1.478.572 1.983.732.832.264 1.59.226 2.188.138.668-.1 2.06-.842 2.35-1.656.292-.814.292-1.512.204-1.658-.086-.144-.318-.232-.666-.406z"/>
      </svg>
    </a>
  )
}
