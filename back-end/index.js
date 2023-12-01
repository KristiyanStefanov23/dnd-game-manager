import express, { static as expressStatic } from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import apiRouter from './api/index.js';
import bp from 'body-parser';
import socketHandlers from './sockets/index.js';

const app = express();
const server = createServer(app);
const io = new SocketServer(server);

app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());

app.use(expressStatic('./build'));
app.use((req, res, next) => {
	if (!req.url.startsWith('/api')) {
		return res.sendFile('/build/index.html');
	}
	next();
});
app.use('/api', apiRouter);

io.on('connection', socketHandlers);

server.listen(process.env.PORT || 3001, () => {
	console.log(`Server started on port ${server.address().port}`);
});
