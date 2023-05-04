const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const apiRouter = require('./api');
const bodyParser = require('body-parser');
const socketHandlers = require('./sockets');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', apiRouter);
app.use(express.static(`${__dirname}/build`));

io.on('connection', socketHandlers);

server.listen(process.env.PORT || 3001, () => {
	console.log(`Server started on port ${server.address().port}`);
});
