const functions = require("firebase-functions")
const admin = require("firebase-admin")

admin.initializeApp()

exports.boldWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const data = req.body

    console.log("Webhook recibido:", data)

    if (data.status === "approved") {
      const pedidoId = data.metadata?.pedidoId

      if (!pedidoId) {
        console.log("No hay pedidoId")
        return res.sendStatus(400)
      }

      await admin.firestore().collection("pedidos").doc(pedidoId).update({
        estado: "pagado"
      })

      console.log("Pedido actualizado:", pedidoId)
    }

    res.sendStatus(200)

  } catch (error) {
    console.error("Error en webhook:", error)
    res.sendStatus(500)
  }
})