import { Server } from 'socket.io';
import ChatRoom from '../models/chatRoom.js'; 

const socketMiddleware = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["https://stack-overflow-client-seven.vercel.app"],
      methods: ["POST","GET"]
    }
  });

  io.on('connection', (socket) => {

    socket.on('joinRoom', async ({ pin, userId }) => {
      socket.join(pin);

      const joinMessage = { type: 'system', userId: userId, message: 'joined the room' };
      io.to(pin).emit('message', joinMessage);

      try {
        const chatRoom = await ChatRoom.findOneAndUpdate(
          { pin },
          { $addToSet: { users: { user: userId } } },
          { new: true }
        );

        console.log(`User ${userId} joined room ${pin}`);
      } catch (error) {
        console.error('Error updating ChatRoom:', error);
      }
    });

    socket.on('sendMessage', ({ pin, userId, message }) => {
      io.to(pin).emit('message', { userId, message, type: 'user' });
    });

    socket.on('leaveRoom', async ({ pin, userId }) => {
      socket.leave(pin);

      const leaveMessage = { type: 'system', userId: userId, message: 'left the room' };
      io.to(pin).emit('message', leaveMessage);

      try {
        const chatRoom = await ChatRoom.findOneAndUpdate(
          { pin },
          { $pull: { users: { user: userId } } },
          { new: true }
        );

        console.log(`User ${userId} left room ${pin}`);
      } catch (error) {
        console.error('Error updating ChatRoom:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });

  return io;
};

export { socketMiddleware };
