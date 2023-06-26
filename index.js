const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');

const client = new Client({
  authStrategy: new LocalAuth( {
    dataPath: __dirname
  })
});

client.on('qr', (qr) => {
  console.log('QR RECEIVED');
  fs.writeFileSync('last.qr', qr);
});

client.on('ready', () => {
  console.log('Client is ready!');
});

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const QRCode = require('qrcode');

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

app.get('/getqr', async (req, res, next) => {
  try {
    const msg = await client.getState(); // get the status
    if (msg) {
      res.send(msg)
    } else {
      QRCode.toDataURL(fs.readFileSync('last.qr', 'utf8'), function (err, url) {
        var base64Data = url.replace(/^data:image\/png;base64,/, '');
        var img = Buffer.from(base64Data, 'base64');
        res.writeHead(200, {
          'Content-Type': 'image/png',
          'Content-Length': img.length
        });
        res.end(img);
      })
    }
  } catch (error) {
    next(error);
  }
});

client.initialize();