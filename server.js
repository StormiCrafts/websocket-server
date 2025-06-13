const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.PORT || 10000 });

let clients = [];

wss.on('connection', function connection(ws) {
  clients.push(ws);
  console.log('Nouvelle connexion WebSocket');

  ws.on('message', function incoming(message) {
    console.log('Reçu :', message);
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
  });
});
