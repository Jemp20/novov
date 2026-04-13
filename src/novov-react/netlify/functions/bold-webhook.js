import emailjs from "@emailjs/browser"

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" }
  }

  try {
    const body = JSON.parse(event.body)

    // Bold envía el estado del pago aquí
    if (body.status !== "APPROVED") {
      return { statusCode: 200, body: "Pago no aprobado, ignorado" }
    }

    const metadata = body.metadata || {}

    await emailjs.send(
      process.env.VITE_EMAILJS_SERVICE_ID,
      process.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        to_name: metadata.nombre || "Cliente",
        to_email: metadata.correo,
        order_id: metadata.idPedido,
        productos: metadata.productos,
        total: metadata.total,
        tipo_pago: "Pago en línea (Bold)",
        ciudad: metadata.ciudad,
        direccion: metadata.direccion,
        whatsapp: metadata.whatsapp,
      },
      process.env.VITE_EMAILJS_PUBLIC_KEY
    )

    return { statusCode: 200, body: "Correo enviado" }
  } catch (err) {
    console.error(err)
    return { statusCode: 500, body: "Error interno" }
  }
}