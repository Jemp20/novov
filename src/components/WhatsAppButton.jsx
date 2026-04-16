import { useState, useEffect, useRef } from "react"

const PHONE = "573218074429"

export default function WhatsAppButton() {
  const [open, setOpen]       = useState(false)
  const [msg, setMsg]         = useState("")
  const [chat, setChat]       = useState([])
  const [typing, setTyping]   = useState(false)
  const [sent, setSent]       = useState(false)
  const bottomRef             = useRef(null)
  const inputRef              = useRef(null)

  // Mensaje de bienvenida al abrir
  useEffect(() => {
    if (open && chat.length === 0) {
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        setChat([{
          from: "owner",
          text: "👋 Hola! Soy el dueño de NOVO.V. ¿En qué te puedo ayudar? Cuéntame qué gorra te llamó la atención y coordinamos el domicilio 🧢",
          time: now()
        }])
      }, 1000)
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  // Scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat, typing])

  function now() {
    return new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
  }

  function handleSend() {
    const text = msg.trim()
    if (!text) return

    const newChat = [...chat, { from: "client", text, time: now() }]
    setChat(newChat)
    setMsg("")
    setSent(true)

    // Respuesta automática + abrir WhatsApp con todo el historial
    setTimeout(() => {
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        setChat(prev => [...prev, {
          from: "owner",
          text: "¡Perfecto! Te respondo ahora mismo por WhatsApp para coordinar todo 📦",
          time: now()
        }])

        // Construir historial para enviar por WhatsApp
        const historial = newChat
          .map(m => (m.from === "client" ? `Yo: ${m.text}` : `NOVO.V: ${m.text}`))
          .join("\n")
        const waText = encodeURIComponent(`${historial}\nYo: ${text}`)
        const url = `https://wa.me/${PHONE}?text=${waText}`

        setTimeout(() => {
          const v = window.open(url, "_blank")
          if (!v) window.location.href = url
        }, 1200)
      }, 1500)
    }, 400)
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <>
      {/* ── Ventana de chat ── */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '5.5rem', right: '1.5rem', zIndex: 9999,
          width: '320px', maxWidth: 'calc(100vw - 3rem)',
          background: '#1a1a1a', borderRadius: '16px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          border: '1px solid rgba(201,169,110,0.2)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          fontFamily: 'system-ui, sans-serif',
          animation: 'slideUp 0.25s ease'
        }}>

          {/* Header */}
          <div style={{
            background: '#111', padding: '0.85rem 1rem',
            display: 'flex', alignItems: 'center', gap: '10px',
            borderBottom: '1px solid rgba(201,169,110,0.15)'
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #C9A96E, #8B6914)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', fontWeight: 'bold', color: '#111'
              }}>N</div>
              <div style={{
                position: 'absolute', bottom: '1px', right: '1px',
                width: '10px', height: '10px', borderRadius: '50%',
                background: '#25D366', border: '2px solid #111'
              }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, color: '#C9A96E', fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.05em' }}>NOVO.V</p>
              <p style={{ margin: 0, color: '#25D366', fontSize: '0.72rem' }}>● En línea · responde al instante</p>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1, padding: '4px'
            }}>✕</button>
          </div>

          {/* Mensajes */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '1rem 0.8rem',
            display: 'flex', flexDirection: 'column', gap: '8px',
            minHeight: '200px', maxHeight: '280px',
            background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 24px)'
          }}>
            {chat.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.from === 'client' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '0.5rem 0.75rem',
                  borderRadius: m.from === 'client' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: m.from === 'client' ? 'rgba(201,169,110,0.9)' : 'rgba(255,255,255,0.08)',
                  color: m.from === 'client' ? '#111' : 'rgba(255,255,255,0.88)',
                  fontSize: '0.82rem', lineHeight: 1.45
                }}>
                  <p style={{ margin: 0 }}>{m.text}</p>
                  <p style={{ margin: '3px 0 0', fontSize: '0.65rem', opacity: 0.55, textAlign: 'right' }}>{m.time}</p>
                </div>
              </div>
            ))}

            {/* Indicador "escribiendo..." */}
            {typing && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '0.5rem 0.85rem', borderRadius: '12px 12px 12px 2px',
                  background: 'rgba(255,255,255,0.08)', display: 'flex', gap: '4px', alignItems: 'center'
                }}>
                  {[0, 0.2, 0.4].map((d, i) => (
                    <span key={i} style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: '#C9A96E', opacity: 0.7,
                      animation: `bounce 1s ${d}s infinite`
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Aviso si ya envió */}
          {sent && (
            <div style={{
              padding: '0.4rem 1rem', background: 'rgba(37,211,102,0.08)',
              borderTop: '1px solid rgba(37,211,102,0.15)',
              fontSize: '0.72rem', color: '#25D366', textAlign: 'center'
            }}>
              📲 Continuando en WhatsApp...
            </div>
          )}

          {/* Input */}
          <div style={{
            display: 'flex', gap: '8px', padding: '0.7rem',
            borderTop: '1px solid rgba(255,255,255,0.07)', background: '#111'
          }}>
            <textarea
              ref={inputRef}
              value={msg}
              onChange={e => setMsg(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Escribe tu mensaje..."
              rows={1}
              style={{
                flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(201,169,110,0.2)',
                borderRadius: '8px', color: '#fff', padding: '0.5rem 0.75rem',
                fontSize: '0.82rem', resize: 'none', outline: 'none',
                fontFamily: 'system-ui, sans-serif', lineHeight: 1.4
              }}
            />
            <button
              onClick={handleSend}
              disabled={!msg.trim()}
              style={{
                background: msg.trim() ? '#25D366' : 'rgba(37,211,102,0.2)',
                border: 'none', borderRadius: '8px', width: '38px', minWidth: '38px',
                cursor: msg.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Botón flotante ── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Chat en vivo"
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999,
          width: '56px', height: '56px', borderRadius: '50%',
          background: open ? '#1a1a1a' : '#25D366',
          border: open ? '2px solid rgba(201,169,110,0.4)' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.3s'
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
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        ) : (
          <svg viewBox="0 0 32 32" width="30" height="30" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C8.268 2 2 8.268 2 16c0 2.492.648 4.832 1.782 6.86L2 30l7.34-1.762A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.54 11.54 0 0 1-5.88-1.608l-.42-.252-4.356 1.044 1.08-4.236-.276-.432A11.56 11.56 0 0 1 4.4 16C4.4 9.592 9.592 4.4 16 4.4S27.6 9.592 27.6 16 22.408 27.6 16 27.6zm6.344-8.668c-.348-.174-2.06-1.016-2.38-1.132-.32-.116-.552-.174-.784.174-.232.348-.9 1.132-1.104 1.364-.204.232-.406.26-.754.086-.348-.174-1.47-.542-2.8-1.726-1.034-.922-1.732-2.06-1.936-2.408-.204-.348-.022-.536.152-.708.158-.156.348-.406.522-.61.174-.202.232-.348.348-.58.116-.232.058-.436-.028-.61-.088-.174-.784-1.892-1.074-2.59-.282-.68-.57-.588-.784-.598-.204-.01-.436-.012-.668-.012s-.61.086-.928.434c-.318.348-1.218 1.19-1.218 2.902s1.246 3.366 1.42 3.598c.174.232 2.452 3.744 5.942 5.252.83.358 1.478.572 1.983.732.832.264 1.59.226 2.188.138.668-.1 2.06-.842 2.35-1.656.292-.814.292-1.512.204-1.658-.086-.144-.318-.232-.666-.406z"/>
          </svg>
        )}
      </button>

      {/* Animaciones CSS */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30%            { transform: translateY(-5px); }
        }
      `}</style>
    </>
  )
}
