import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import emailjs from "@emailjs/browser";

// Crea el pedido en Firebase (sin enviar correo)
export const crearPedido = async (pedido) => {
  try {
    const docRef = await addDoc(collection(db, "pedidos"), {
      ...pedido,
      estado: "en_proceso",
      estado_pago: "pendiente",
      fecha: new Date(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creando pedido:", error);
    throw error;
  }
};

// Envía el correo de confirmación al cliente (llamar solo cuando el pago esté confirmado)
export const enviarCorreoConfirmacion = async (pedido, idPedido) => {
  try {
    const productosTexto = pedido.productos
      .map(
        (item) =>
          `${item.name} × ${item.qty} — $${(item.price * item.qty).toLocaleString("es-CO")} COP`
      )
      .join("\n");

    const tipoPagoTexto = {
      bold: "Pago en línea (Bold)",
      descuento_bold: "Pago en línea con 20% OFF (Bold)",
      paypal: "Pago con PayPal",
      descuento_paypal: "Pago con PayPal con 20% OFF",
      contraentrega: "Pago al recibir",
    }[pedido.tipoPago] || pedido.tipoPago;

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        to_name: `${pedido.nombre} ${pedido.apellidos}`,
        to_email: pedido.correo,
        order_id: idPedido,
        productos: productosTexto,
        total: `$${pedido.total.toLocaleString("es-CO")} COP`,
        tipo_pago: tipoPagoTexto,
        ciudad: pedido.ciudad,
        direccion: pedido.direccion,
        whatsapp: pedido.whatsapp,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    console.log("Correo de confirmación enviado a", pedido.correo);
  } catch (error) {
    console.error("Error enviando correo:", error);
  }
};
