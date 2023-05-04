const gameHandlers = require('./game');

module.exports = (socket) => {
  console.log(`New client connected: ${socket.id}`);
  
  // Handle game-related events
  gameHandlers(socket);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
};
