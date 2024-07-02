import ChatRoom from '../models/chatRoom.js';

export const createRoom = async (req, res) => {
  const { pin } = req.body;

  console.log('Received request to create room with pin:', pin);

  try {
    const room = await ChatRoom.create({ pin });

    console.log('Room created successfully:', room);

    res.status(200).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(405).json({ message: error.message });
  }
};
