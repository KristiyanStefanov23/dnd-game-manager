import gameHandlers from './game.js';

export default (socket) => {
	console.log(`New client connected: ${socket.id}`);

	// Handle game-related events
	gameHandlers(socket);

	socket.on('disconnect', () => {
		console.log(`Client disconnected: ${socket.id}`);
	});
};
