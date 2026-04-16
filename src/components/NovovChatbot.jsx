import { useState, useRef, useEffect } from 'react'

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function NovovChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '✦ Bienvenido a NOVO·V. Soy Hermes, tu guía en este olimpo del estilo. ¿En qué puedo ayudarte hoy?'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [messages, open])

  // ─── FUNCIÓN ARREGLADA ─────────────────────────────────────────────────────
  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]

    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })

      if (!response.ok) throw new Error('Error servidor')

      const data = await response.json()

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.reply }
      ])

    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Disculpa, hubo un problema de conexión. Escríbenos al WhatsApp +57 321 807 4429.'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Jost:wght@300;400;500&display=swap');

        .novo-chat-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1a1208, #2e1f06);
          border: 1px solid #a07840;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 24px rgba(160,120,64,0.35);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          font-size: 22px;
        }
        .novo-chat-fab:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 32px rgba(160,120,64,0.5);
        }

        .novo-chat-window {
          position: fixed;
          bottom: 100px;
          right: 28px;
          z-index: 9998;
          width: 370px;
          max-width: calc(100vw - 40px);
          height: 520px;
          max-height: calc(100vh - 130px);
          display: flex;
          flex-direction: column;
          background: #0d0b08;
          border: 1px solid #a07840;
          border-radius: 2px;
          box-shadow: 0 16px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(160,120,64,0.15);
          animation: chatOpen 0.22s ease forwards;
          font-family: 'Jost', sans-serif;
          overflow: hidden;
        }

        @keyframes chatOpen {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }

        .novo-chat-header {
          padding: 14px 18px;
          background: linear-gradient(135deg, #1a1208, #2e1f06);
          border-bottom: 1px solid rgba(160,120,64,0.4);
          display: flex;
          justify-content: space-between;
          color: #d4a85a;
        }

        .novo-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .novo-msg {
          max-width: 85%;
        }

        .novo-msg.assistant {
          align-self: flex-start;
        }

        .novo-msg.user {
          align-self: flex-end;
        }

        .novo-msg-bubble {
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13.5px;
          line-height: 1.5;
        }

        .assistant .novo-msg-bubble {
          background: rgba(160,120,64,0.08);
          border: 1px solid rgba(160,120,64,0.2);
          color: #e8d9b8;
        }

        .user .novo-msg-bubble {
          background: rgba(160,120,64,0.25);
          color: #fff;
        }

        .novo-chat-input-area {
          display: flex;
          padding: 10px;
          border-top: 1px solid rgba(160,120,64,0.2);
        }

        .novo-chat-textarea {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(160,120,64,0.3);
          color: #fff;
          padding: 8px;
        }

        .novo-chat-send {
          margin-left: 6px;
          background: #a07840;
          border: none;
          padding: 0 12px;
          cursor: pointer;
        }
      `}</style>

      {/* BOTÓN */}
      <button className="novo-chat-fab" onClick={() => setOpen(v => !v)}>
        {open ? '✕' : '✦'}
      </button>

      {/* CHAT */}
      {open && (
        <div className="novo-chat-window">

          <div className="novo-chat-header">
            Hermes · NOVO·V
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="novo-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`novo-msg ${msg.role}`}>
                <div className="novo-msg-bubble">{msg.content}</div>
              </div>
            ))}
            {loading && <p style={{ color: '#a07840' }}>Escribiendo...</p>}
            <div ref={bottomRef} />
          </div>

          <div className="novo-chat-input-area">
            <textarea
              ref={inputRef}
              className="novo-chat-textarea"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Escribe..."
            />
            <button className="novo-chat-send" onClick={sendMessage}>
              ➤
            </button>
          </div>

        </div>
      )}
    </>
  )
}