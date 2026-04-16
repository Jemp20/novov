export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: 'Método no permitido' })
  }

  const { messages } = req.body

  // 🧠 RESPUESTA INTELIGENTE SIMULADA (SIN PAGAR API)
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase()

  let reply = "✦ En NOVO·V cada pieza representa distinción. ¿Buscas algún modelo en particular?"

  if (lastMessage.includes('precio') || lastMessage.includes('cuanto')) {
    reply = "Las piezas actuales están entre $240.000 y $280.000 COP. ¿Quieres que te muestre los modelos?"
  }

  if (lastMessage.includes('envio')) {
    reply = "Hacemos envíos a toda Colombia. Ciudades principales tardan 2 a 4 días hábiles."
  }

  if (lastMessage.includes('comprar')) {
    reply = "Puedes comprar directamente desde el carrito o escribirnos al WhatsApp +57 321 807 4429 para atención personalizada."
  }

  if (lastMessage.includes('hola')) {
    reply = "✦ Bienvenido. Estás entrando al universo NOVO·V. ¿Qué pieza llamó tu atención?"
  }

  res.status(200).json({ reply })
}