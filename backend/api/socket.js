// api/socket.js

import { Server } from 'socket.io';
import http from 'http';

const handler = (req, res) => {
  // Create a server
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket server is running');
  });

  // Create a Socket.IO server
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  // Start the server (Vercel handles the serverless lifecycle)
  server.listen(3000, () => {
    console.log('WebSocket server running');
  });
};

export default handler;
