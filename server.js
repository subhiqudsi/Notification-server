'use strict';

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');


const INDEX = path.join(__dirname, 'index.html');
var router = express.Router();
var port = process.env.PORT || 3000;

//default/test route
router.get('/status', function(req, res) {
    res.json({ status: 'App is running!' });
});

//connect path to router


var connectedUsers = [];
//init Express
var app = express();
app.use("/", router);

const server =app.listen(port, () => console.log(`Listening on ${ port }`));

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

app.post('/send-Notification',(req,res)=>{
    res = req.body.json()
})

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
