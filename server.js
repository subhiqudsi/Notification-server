'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
server.use((req, res) => res.sendFile(INDEX) ).listen(PORT, () => console.log(`Listening on ${ PORT }`));

server.get('/',(req, res) => res.sendFile(INDEX) )
const wss = new SocketServer({ server,path:'/ws' });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);

server.post('/send_notification', (req, res) => {
  console.log(req)
  return res.send('Received a POST HTTP method');
});

// function send_to_channel(message,channel) {
//   wss.clients.forEach((client) => {
//     client.send()
//   })
// }