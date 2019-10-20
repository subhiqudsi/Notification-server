'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT =  80;
const INDEX = path.join(__dirname, 'index.html');
//init Express Router
var router = express.Router();


var connectedUsers = [];
//init Express
var app = express();

const server =app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

// function send_to_channel(message,channel) {
//   wss.clients.forEach((client) => {
//     client.send()
//   })
// }

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);



//return static page with websocket client
app.get('/', function(req, res) {
    res.sendFile(INDEX);
});

//init Websocket ws and handle incoming connect requests
wss.on('connection', function connection(ws) {
    console.log("connection ...");
    //on connect message
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        connectedUsers.push(message);
    });
    ws.send('message from server at: ' + new Date());
});
