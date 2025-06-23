const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Ruta básica de prueba
app.get('/', (req, res) => {
  res.send('Lunyee Soporte IA - Sistema activo ✅');
});

// Webhook de Telegram
app.post('/telegram', async (req, res) => {
  const update = req.body;
  if (!update.message || !update.message.text) {
    return res.status(200).send('No es un mensaje de texto');
  }

  const chatId = update.message.chat.id;
  const text = update.message.text;

  console.log('Mensaje recibido:', text);

  // Responder con un mensaje simple
  await sendMessage(chatId, `Recibido: ${text}`);

  // Opcional: Enviar al motor de flujos (n8n)
  // await axios.post('https://tu-n8n.onrailway.app/webhook-telegram',  update);

  res.status(200).send('OK');
});

// Función para responder al bot de Telegram
async function sendMessage(chatId, text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const url = `https://api.telegram.org/bot${token}/sendMessage`; 

  try {
    await axios.post(url, {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Error al enviar mensaje:', error.message);
  }
}

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});