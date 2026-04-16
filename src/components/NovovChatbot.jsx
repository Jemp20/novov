import { useState, useRef, useEffect } from 'react'

export default function NovovChatbot() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState('inicio')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '✦ Bienvenido a NOVO·V.\nSoy Hermes.\n\nNo vendemos gorras… ofrecemos distinción.\n\n¿Qué deseas explorar hoy?'
    }
  ])

  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content }])
  }

  const handleOption = (option) => {
    addMessage('user', option)

    switch (step) {
      case 'inicio':
        if (option === 'Ver colección') {
          addMessage('assistant',
            'Nuestra colección es limitada.\nCada pieza es símbolo de estatus.\n\n¿Qué línea deseas ver?'
          )
          setStep('coleccion')
        }

        if (option === 'Envíos') {
          addMessage('assistant',
            'Envíos en Colombia:\n\n• 2–4 días ciudades\n• 5–9 días otras zonas\n• Seguimiento incluido'
          )
        }

        if (option === 'Pagos') {
          addMessage('assistant',
            'Pagos disponibles:\n• Bold\n• PayPal\n\nSe realiza al finalizar compra.'
          )
        }

        if (option === 'Asesor') {
          window.open('https://wa.me/573218074429', '_blank')
        }
        break

      case 'coleccion':
        if (option === 'Obsidian I') {
          addMessage('assistant', 'Obsidian I\n\n$280.000\nEdición limitada.')
        }

        if (option === 'Aurum Elite') {
          addMessage('assistant', 'Aurum Elite\n\n$260.000\nEdición limitada.')
        }

        if (option === 'Ivory Night') {
          addMessage('assistant', 'Ivory Night\n\n$240.000\nEdición limitada.')
        }

        if (option === 'Comprar') {
          window.open('https://wa.me/573218074429', '_blank')
        }

        if (option === 'Volver') {
          setStep('inicio')
        }
        break
    }
  }

  const getOptions = () => {
    if (step === 'inicio') {
      return ['Ver colección', 'Envíos', 'Pagos', 'Asesor']
    }
    if (step === 'coleccion') {
      return ['Obsidian I', 'Aurum Elite', 'Ivory Night', 'Comprar', 'Volver']
    }
    return []
  }

  return (
    <>
      <style>{`

        .novo-chat-fab {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 999999;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1a1208, #2e1f06);
          border: 1px solid #a07840;
          color: #d4a85a;
          font-size: 22px;
          cursor: pointer;
        }

        .novo-chat-window {
          position: fixed;
          bottom: 90px;
          right: 20px;
          z-index: 999999;

          width: 360px;
          height: 520px;

          display: flex;
          flex-direction: column;

          background: #0d0b08;
          border: 1px solid #a07840;
          border-radius: 8px;

          box-shadow: 0 16px 64px rgba(0,0,0,0.7);
          overflow: hidden;
        }

        .novo-header {
          padding: 14px;
          border-bottom: 1px solid rgba(160,120,64,0.3);
          display: flex;
          justify-content: space-between;
          color: #d4a85a;
        }

        .novo-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
        }

        .novo-bubble {
          margin-bottom: 12px;
          padding: 12px;
          border: 1px solid rgba(160,120,64,0.2);
          background: rgba(160,120,64,0.06);
          color: #e8d9b8;
          white-space: pre-line;
        }

        .novo-buttons {
          padding: 12px;
          display: grid;
          gap: 8px;
          border-top: 1px solid rgba(160,120,64,0.2);
        }

        .novo-btn {
          background: transparent;
          border: 1px solid #a07840;
          color: #d4a85a;
          padding: 10px;
          cursor: pointer;
        }

        .novo-btn:hover {
          background: #a07840;
          color: #000;
        }

        @media (max-width: 600px) {
          .novo-chat-window {
            left: 12px;
            right: 12px;
            width: auto;
            height: 70vh;
          }
        }

      `}</style>

      <button className="novo-chat-fab" onClick={() => setOpen(v => !v)}>
        {open ? '✕' : '✦'}
      </button>

      {open && (
        <div className="novo-chat-window">

          <div className="novo-header">
            Hermes · NOVO·V
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="novo-messages">
            {messages.map((m, i) => (
              <div key={i} className="novo-bubble">{m.content}</div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="novo-buttons">
            {getOptions().map((opt, i) => (
              <button key={i} className="novo-btn" onClick={() => handleOption(opt)}>
                {opt}
              </button>
            ))}
          </div>

        </div>
      )}
    </>
  )
}
