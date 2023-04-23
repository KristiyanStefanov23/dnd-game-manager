const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const mapSocket = require('./functions/socket/socket');
const io = new Server(server);

mapSocket(io);
app.use(express.static(__dirname + '\\build'));
app.get('*', (req, res) => res.sendFile(__dirname + '\\build\\index.html'));

server.listen(3001, () => console.log('Listening on http://localhost:3001'));
