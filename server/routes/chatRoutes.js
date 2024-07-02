import express from 'express';
const router = express.Router();
import ChatRoom from '../models/chatRoom.js'; 

router.get('/getRoomPin/:roomId', async (req, res) => {
  const { roomId } = req.params;
  try {
    const chatRoom = await ChatRoom.findById(roomId);
    if (chatRoom) {
      res.json({ pin: chatRoom.pin });
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
