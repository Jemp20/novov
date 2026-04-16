import { useState, useRef, useEffect } from 'react'

// ─── Conocimiento base de NOVOV ───────────────────────────────────────────────
const SYSTEM_PROMPT = `Eres el asistente virtual de NOVO·V, una marca colombiana de gorras de alta distinción con estética greco-clásica y espíritu premium. Tu nombre es Hermes (el mensajero).

RESPONDE SOLO sobre temas relacionados con NOVO·V. Si alguien pregunta algo que no tenga que ver con la marca, dile amablemente que solo puedes ayudar con temas de NOVO·V.

INFORMACIÓN DE LA MARCA:
- Nombre: NOVO·V
- Lema: "Los últimos son los primeros" / "No vendemos gorras. Ofrecemos distinción."
- País: Colombia
- Historia: Nació de una obsesión por el detalle. Cada gorra es concebida como una pieza de autor — materia prima, construcción y acabado por encima del estándar.
- Pilares: 100% Materiales Premium · Marca Colombiana · Distinción Garantizada

PRODUCTOS ACTUALES (Drops activos):
1. Obsidian I — $280.000 COP (~$66.67 USD). Antes $350.000. Tag: Drop 01. Badge: Nuevo. Descripción: "La oscuridad forjada en corona." Colores: negro.
2. Aurum Elite — $260.000 COP (~$61.90 USD). Antes $320.000. Tag: Drop 02. Badge: Nuevo. Descripción: "Dorado como el sol de Helios." Colores: rojo/dorado.
3. Ivory Night — $240.000 COP (~$57.14 USD). Antes $300.000. Tag: Drop 03. Badge: Nuevo. Descripción: "La sabiduría de Atenea en tu frente." Colores: azul.

CATÁLOGO: La tienda tiene catálogo en Firestore con más productos que pueden variar. Para ver el catálogo completo, el cliente puede visitar la sección "Catálogo" del sitio.

PROCESO DE COMPRA:
- El cliente agrega al carrito y procede al checkout.
- Pagos aceptados: Nequi y Bancolombia (transferencia).
- El pago se coordina por WhatsApp con el dueño.
- El número de WhatsApp es +57 321 807 4429.

ENVÍOS:
- Procesamiento: 1 a 2 días hábiles después de confirmado el pago.
- Envíos a toda Colombia con transportadora de confianza y seguimiento en tiempo real.
- Ciudades principales (Bogotá, Medellín, Cali, Barranquilla): 2 a 4 días hábiles.
- Municipios y zonas rurales: 5 a 9 días hábiles.
- Costo de envío: se calcula según ciudad de destino al finalizar la compra.
- 100% de envíos rastreables. El cliente puede usar su código de pedido en la sección "Rastrear" del sitio.
- Envíos internacionales: contactar por WhatsApp antes de hacer el pedido.

DEVOLUCIONES:
- Se aceptan por: defecto de fabricación, producto incorrecto enviado, o daño durante el transporte.
- Plazo: 5 días calendario desde que recibe el pedido para reportar.
- Tiempo de respuesta garantizado: 48 horas.
- Costo de gestión: $0 (gratis).
- Cómo solicitar: escribir por WhatsApp con código de pedido, descripción y fotos del producto.
- Condición del producto: sin uso, con etiquetas originales y en su empaque original.
- NO aplica devolución por: talla incorrecta elegida por el cliente, producto usado o sin empaque.
- Nota importante: al ser edición limitada, revisar bien las medidas antes de confirmar.

CONTACTO:
- Instagram: @novo.v_ → https://www.instagram.com/novo.v_
- WhatsApp: +57 321 807 4429 → https://wa.me/573218074429
- Email: novo.v.nonovp@gmail.com
- Facebook: https://www.facebook.com/share/18cEVkraKD/
- Ubicación: Colombia

TONO Y ESTILO:
- Habla con elegancia y confianza, acorde a una marca premium.
- Usa lenguaje natural, cálido y colombiano (pero sin caer en slang excesivo).
- Puedes usar de vez en cuando referencias sutiles a la estética greco-clásica de la marca (sin exagerar).
- Sé conciso pero completo. No des respuestas larguísimas innecesariamente.
- Si el cliente quiere comprar, guíalo al carrito o al WhatsApp.
- Si el cliente tiene una queja o devolución, dirígelo al WhatsApp con su código de pedido.
- Responde siempre en español.`

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

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }))

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages
        })
      })

      const data = await response.json()
      const reply = data.content?.map(b => b.text || '').join('') || 'Lo siento, no pude responder en este momento.'

      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Disculpa, hubo un problema de conexión. Intenta de nuevo o escríbenos al WhatsApp +57 321 807 4429.'
      }])
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
          transform-origin: bottom right;
          animation: chatOpen 0.22s cubic-bezier(0.34,1.56,0.64,1) forwards;
          font-family: 'Jost', sans-serif;
          overflow: hidden;
        }
        @keyframes chatOpen {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }

        .novo-chat-header {
          padding: 14px 18px 12px;
          background: linear-gradient(135deg, #1a1208, #2e1f06);
          border-bottom: 1px solid rgba(160,120,64,0.4);
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .novo-chat-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(160,120,64,0.15);
          border: 1px solid rgba(160,120,64,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }
        .novo-chat-header-text {
          flex: 1;
        }
        .novo-chat-header-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          font-weight: 600;
          color: #d4a85a;
          letter-spacing: 0.04em;
          line-height: 1;
        }
        .novo-chat-header-sub {
          font-size: 10px;
          color: rgba(160,120,64,0.65);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-top: 2px;
        }
        .novo-chat-close {
          background: none;
          border: none;
          color: rgba(160,120,64,0.6);
          cursor: pointer;
          font-size: 18px;
          padding: 4px;
          line-height: 1;
          transition: color 0.15s;
        }
        .novo-chat-close:hover { color: #d4a85a; }

        .novo-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          scrollbar-width: thin;
          scrollbar-color: rgba(160,120,64,0.2) transparent;
        }
        .novo-chat-messages::-webkit-scrollbar { width: 4px; }
        .novo-chat-messages::-webkit-scrollbar-thumb { background: rgba(160,120,64,0.25); border-radius: 2px; }

        .novo-msg {
          max-width: 88%;
          display: flex;
          flex-direction: column;
          gap: 2px;
          animation: msgIn 0.18s ease forwards;
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .novo-msg.assistant { align-self: flex-start; }
        .novo-msg.user      { align-self: flex-end; }

        .novo-msg-bubble {
          padding: 9px 13px;
          border-radius: 2px;
          font-size: 13.5px;
          line-height: 1.55;
          white-space: pre-wrap;
        }
        .novo-msg.assistant .novo-msg-bubble {
          background: rgba(160,120,64,0.08);
          border: 1px solid rgba(160,120,64,0.2);
          color: #e8d9b8;
          border-radius: 2px 12px 12px 2px;
        }
        .novo-msg.user .novo-msg-bubble {
          background: rgba(160,120,64,0.18);
          border: 1px solid rgba(160,120,64,0.35);
          color: #f5ead4;
          border-radius: 12px 2px 2px 12px;
        }

        .novo-typing {
          display: flex;
          gap: 5px;
          padding: 10px 14px;
          align-self: flex-start;
        }
        .novo-typing span {
          width: 6px;
          height: 6px;
          background: #a07840;
          border-radius: 50%;
          animation: typingDot 1.2s infinite ease-in-out;
        }
        .novo-typing span:nth-child(2) { animation-delay: 0.2s; }
        .novo-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }

        .novo-chat-input-area {
          padding: 10px 12px 12px;
          border-top: 1px solid rgba(160,120,64,0.2);
          background: #0d0b08;
          flex-shrink: 0;
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }
        .novo-chat-textarea {
          flex: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(160,120,64,0.25);
          border-radius: 2px;
          color: #e8d9b8;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          padding: 8px 11px;
          resize: none;
          max-height: 80px;
          min-height: 36px;
          outline: none;
          transition: border-color 0.15s;
          line-height: 1.5;
        }
        .novo-chat-textarea::placeholder { color: rgba(160,120,64,0.35); }
        .novo-chat-textarea:focus { border-color: rgba(160,120,64,0.55); }

        .novo-chat-send {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          background: linear-gradient(135deg, #a07840, #7a5c2e);
          border: none;
          border-radius: 2px;
          cursor: pointer;
          color: #1a1208;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.15s, transform 0.1s;
          font-size: 14px;
        }
        .novo-chat-send:hover:not(:disabled) { opacity: 0.9; transform: scale(1.05); }
        .novo-chat-send:disabled { opacity: 0.35; cursor: default; }

        .novo-chat-divider {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 2px;
        }
        .novo-chat-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(160,120,64,0.15);
        }
        .novo-chat-divider-glyph {
          font-size: 9px;
          color: rgba(160,120,64,0.35);
          letter-spacing: 0.15em;
        }
      `}</style>

      {/* FAB Button */}
      <button
        className="novo-chat-fab"
        onClick={() => setOpen(v => !v)}
        title="Chat NOVO·V"
      >
        {open ? '✕' : '✦'}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="novo-chat-window">
          {/* Header */}
          <div className="novo-chat-header">
            <div className="novo-chat-avatar">⚡</div>
            <div className="novo-chat-header-text">
              <div className="novo-chat-header-name">Hermes · NOVO·V</div>
              <div className="novo-chat-header-sub">Asistente de la marca</div>
            </div>
            <button className="novo-chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="novo-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`novo-msg ${msg.role}`}>
                <div className="novo-msg-bubble">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="novo-typing">
                <span /><span /><span />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="novo-chat-input-area">
            <textarea
              ref={inputRef}
              className="novo-chat-textarea"
              placeholder="Escríbenos..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
              disabled={loading}
            />
            <button
              className="novo-chat-send"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              title="Enviar"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}
