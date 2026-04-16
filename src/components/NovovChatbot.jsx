import { useState } from 'react'

export default function NovovChatbot() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState('inicio')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '✦ Bienvenido a NOVO·V.\nSoy Hermes.\n\nNo vendemos gorras… ofrecemos distinción.\n\n¿Qué deseas explorar hoy?'
    }
  ])

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { role, content }])
  }

  const handleOption = (option) => {
    addMessage('user', option)

    switch (step) {
      case 'inicio':
        if (option === 'Ver colección') {
          addMessage('assistant',
            'Nuestra colección actual es limitada.\nCada pieza está diseñada como símbolo de estatus.\n\n¿Qué línea deseas ver?'
          )
          setStep('coleccion')
        }

        if (option === 'Envíos') {
          addMessage('assistant',
            'Enviamos a toda Colombia.\n\n• Ciudades principales: 2–4 días\n• Otras zonas: 5–9 días\n• Seguimiento en tiempo real incluido'
          )
        }

        if (option === 'Pagos') {
          addMessage('assistant',
            'Aceptamos pagos por: • Bold + Paypal, \n se realiza mediante al hacer la compra en el carrito.'
          )
        }

        if (option === 'Asesor') {
          window.open('https://wa.me/573218074429?text=Hola,%20quiero%20asesoría%20NOVOV', '_blank')
        }
        break

      case 'coleccion':
        if (option === 'Obsidian I') {
          addMessage('assistant',
            'Obsidian I\n\nLa oscuridad convertida en presencia.\n\nPrecio: $280.000\nEdición limitada.'
          )
        }

        if (option === 'Aurum Elite') {
          addMessage('assistant',
            'Aurum Elite\n\nInspirada en el oro de Helios.\n\nPrecio: $260.000\nEdición limitada.'
          )
        }

        if (option === 'Ivory Night') {
          addMessage('assistant',
            'Ivory Night\n\nElegancia silenciosa.\n\nPrecio: $240.000\nEdición limitada.'
          )
        }

        if (option === 'Comprar') {
          window.open('https://wa.me/573218074429?text=Hola,%20quiero%20comprar%20una%20gorra%20NOVOV', '_blank')
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
          bottom: 28px;
          right: 28px;
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
          bottom: 100px;
          right: 28px;
          width: 380px;
          background: #0b0a08;
          border: 1px solid #a07840;
          color: #e8d9b8;
          z-index: 999999;
          box-shadow: 0 20px 60px rgba(0,0,0,0.8);
        }

        .novo-header {
          padding: 14px;
          border-bottom: 1px solid rgba(160,120,64,0.3);
          display: flex;
          justify-content: space-between;
          color: #d4a85a;
          font-weight: 500;
        }

        .novo-messages {
          padding: 16px;
          max-height: 350px;
          overflow-y: auto;
        }

        .novo-bubble {
          margin-bottom: 12px;
          padding: 12px;
          border: 1px solid rgba(160,120,64,0.2);
          background: rgba(160,120,64,0.06);
          line-height: 1.5;
        }

        .novo-buttons {
          padding: 12px;
          display: grid;
          gap: 8px;
        }

        .novo-btn {
          background: transparent;
          border: 1px solid #a07840;
          color: #d4a85a;
          padding: 10px;
          cursor: pointer;
          transition: 0.2s;
        }

        .novo-btn:hover {
          background: #a07840;
          color: #000;
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