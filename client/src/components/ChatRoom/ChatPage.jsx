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
    socketRef.current = io('https://stack-overflow-wine-three.vercel.app', {
      transports: ['websocket'],
      path: '/socket.io',
    });
    const socket = socketRef.current;

    console.log('Connecting to WebSocket server');

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      socket.emit('joinRoom', { pin, userId: User?.result?.name });
    });

    socket.on('message', (msg) => {
      if (msg.type === 'user') {
        setMessages((prevMessages) => [...prevMessages, { userId: msg.userId, message: msg.message }]);
      } else if (msg.type === 'system') {
        setNotifications((prevNotifications) => [...prevNotifications, msg]);
        setTimeout(() => {
          setNotifications((prevNotifications) => prevNotifications.filter((n) => n !== msg));
        }, 5000);
      }
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    return () => {
      socket.emit('leaveRoom', { pin });
      socket.disconnect();
    };
  }, [pin, User]);

  const sendMessage = () => {
    if (message.trim() && User?.result?.name) {
      socketRef.current.emit('sendMessage', { pin, userId: User.result.name, message });
      setMessage('');
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
    socketRef.current.emit('leaveRoom', { pin });
    socketRef.current.disconnect();
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
              <div key={index}><strong>{msg.userId}:</strong> {msg.message}</div>
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
