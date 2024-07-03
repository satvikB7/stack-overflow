import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import Notification from './Notification';
import './ChatPage.css';
import LeftSidebar from '../LeftSidebar/LeftSidebar';

const ChatPage = () => {
  const { pin } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showPin, setShowPin] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  const User = useSelector((state) => state.currentUserReducer);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000', {
      transports: ['websocket'], 
    });
    const socket = socketRef.current;

    socket.connect();

    socket.emit('joinRoom', { pin });

    socket.on('message', (msg) => {
      console.log('Received message:', msg);
      if (msg.type === 'user') {
        const newMessage = { userId: msg.userId, message: msg.message };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } else if (msg.type === 'system') {
        console.log('System Message:', msg);
        setNotifications((prevNotifications) => [...prevNotifications, msg]);
        setTimeout(() => {
          setNotifications((prevNotifications) => prevNotifications.filter((n) => n !== msg));
        }, 5000); // Remove notification after 5 seconds
      }
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    return () => {
      socket.emit('leaveRoom', { pin });
      socket.disconnect();
    };
  }, [pin]);

  const sendMessage = () => {
    if (message.trim() !== '' && User && User.result && User.result.name) {
      const socket = socketRef.current;
      socket.emit('sendMessage', { pin, userId: User.result.name, message });
      setMessage(''); // Clear the input field after sending
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleShowPin = () => {
    setShowPin((prevShowPin) => !prevShowPin);
    setTimeout(() => {
      setShowPin(false);
    }, 5000);
  };

  const handleLeave = () => {
    const socket = socketRef.current;
    socket.emit('leaveRoom', { pin });
    socket.disconnect();
    navigate('/ChatRoom');
  };

  return (
    <div className='home-container-1'>
      <LeftSidebar />
      <div className='home-container-2'>
        <div className="chat-page-container">
          <div className="notifications-container">
            {notifications.map((msg, index) => (
              <Notification key={index} userId={msg.userId} message={msg.message} />
            ))}
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.userId}:</strong> {msg.message}
              </div>
            ))}
          </div>
          <div className="button-container">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your message"
            />
            <button className="send-button" onClick={sendMessage}>Send</button>
            <button className="allow-button" onClick={handleShowPin}>
              {showPin ? 'Hide PIN' : 'Join Others'}
            </button>
          </div>
          {showPin && <p>Share this PIN: {pin}</p>}
          <button className="leave-button" onClick={handleLeave}>Leave</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
