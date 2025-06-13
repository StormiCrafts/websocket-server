const WebSocket = require('ws');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 10000;

// Création du serveur HTTP + WebSocket
const server = app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
const wss = new WebSocket.Server({ server });

let clients = [];

// Middleware pour parser JSON
app.use(bodyParser.json());

// Connexions WebSocket
wss.on('connection', function connection(ws) {
  clients.push(ws);
  console.log('Nouvelle connexion WebSocket');

  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
  });
});

// Route pour recevoir les notifications depuis PHP
app.post('/notify', (req, res) => {
  const message = req.body;
  console.log('Notification reçue via POST :', message);

  // Diffuser à tous les clients WebSocket
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });

  res.send({ status: 'ok' });
});
