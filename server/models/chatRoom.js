import mongoose from 'mongoose';

const chatRoomSchema = mongoose.Schema({
  pin: { type: String, required: true, unique: true },
  joinedAt: { type: Date, default: Date.now },
});

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

export default ChatRoom;
