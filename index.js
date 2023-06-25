const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
  authStrategy: new LocalAuth()
});
client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post('/sendmessage', async (req, res, next) => {
  try {
    console.log(req.body); const { number, message } = req.body; // Get the body
    const msg = await client.sendMessage(`${number}@c.us`, message); // Send the message
    res.send({ msg }); // Send the response
  } catch (error) {
    next(error);
  }
});

client.initialize();



