// api/socket.js

import { Server } from 'socket.io';
import http from 'http';
import game from '../game'; // Import the game logic

const handler = (req, res) => {
  // Create a basic HTTP server
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket server is running');
  });

  // Set up Socket.IO server on the HTTP server
  const io = new Server(server, {
    cors: {
      origin: "*", // Adjust as needed
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('createRoom', (roomId) => {
      game.createRoom(roomId);
      socket.join(roomId);
      io.to(roomId).emit('gameState', game.getGameState(roomId));
    });

    socket.on('joinRoom', ({ roomId, username }) => {
      game.addPlayerToRoom(roomId, socket.id, username);
      socket.join(roomId);
      io.to(roomId).emit('gameState', game.getGameState(roomId));
    });

    socket.on('playCard', ({ roomId, card, targetId }) => {
      const result = game.playCard(roomId, socket.id, card, targetId);
      io.to(roomId).emit('gameState', { ...game.getGameState(roomId), result });
    });

    socket.on('disconnect', () => {
      for (const roomId in game.rooms) {
        if (game.rooms[roomId]?.players[socket.id]) {
          delete game.rooms[roomId].players[socket.id];
          game.removeEmptyRooms();
          io.to(roomId).emit('gameState', game.getGameState(roomId));
          console.log(`Player ${socket.id} disconnected from room ${roomId}.`);
        }
      }
    });
  });

  // Start serverless function
  server.listen(3000, () => {
    console.log('WebSocket server running');
  });

  res.status(200).send('Socket server is ready');
};

export default handler;
