import { Server } from 'socket.io';
import ChatRoom from '../models/chatRoom.js'; 

const socketMiddleware = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://stack-overflow-client-seven.vercel.app",
      methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
    path: '/socket.io',  // Ensure this matches the client configuration
    transports: ['websocket'],
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('joinRoom', async ({ pin, userId }) => {
      socket.join(pin);
      const joinMessage = { type: 'system', userId, message: 'joined the room' };
      io.to(pin).emit('message', joinMessage);
      // Additional logic for handling room joining
    });

    socket.on('sendMessage', ({ pin, userId, message }) => {
      io.to(pin).emit('message', { userId, message, type: 'user' });
    });

    socket.on('leaveRoom', async ({ pin, userId }) => {
      socket.leave(pin);
      const leaveMessage = { type: 'system', userId, message: 'left the room' };
      io.to(pin).emit('message', leaveMessage);
      // Additional logic for handling room leaving
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export { socketMiddleware };
