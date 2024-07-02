import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../../api/chat'; 
import './ChatRoom.css'; 
import LeftSidebar from '../LeftSidebar/LeftSidebar';

const ChatRoom = () => {
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    try {
      const response = await createRoom();
      const pin = response.pin;
      navigate(`/chat/${pin}`);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    const pin = e.target.pin.value;
    navigate(`/chat/${pin}`, { state: { pin } });
  };

  return (
    <div className='home-container-1'>
      <LeftSidebar />
      <div className='home-container-2'>
        <div className="chat-room-container">
          <h1>Create or Join a Chat Room</h1>
          <button onClick={handleCreateRoom}>Create Chat Room</button>
          <form onSubmit={handleJoinRoom}>
            <input type="text" name="pin" placeholder="Enter PIN to join" required />
            <button type="submit">Join Chat Room</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
