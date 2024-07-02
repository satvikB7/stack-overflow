import React, { useState, useEffect } from 'react';
import './LeftSidebar.css';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import Globe from '../../assets/Globe.svg';
import { useSelector } from 'react-redux';

const LeftSidebar = ({ roomId }) => {
  const [pin, setPin] = useState('');
  const User = useSelector((state) => state.currentUserReducer)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomPIN = async () => {
      try {
        if (!roomId) return;
        const response = await axios.get(`http://localhost:5001/getRoomPin/${roomId}`);
        setPin(response.data.pin);
      } catch (error) {
        console.error('Error fetching PIN:', error);
      }
    };

    fetchRoomPIN();
  }, [roomId]);

  const handleChatRoomClick = (e) => {
    if (!User || !User.result || !User.result.name) {
      e.preventDefault();
      alert('You must be logged in to access the chat room.');
      navigate('/Auth');
    }
  };

  return (
    <div className='left-sidebar'>
      <nav className='side-nav'>
        <NavLink to='/' className='side-nav-links' activeClassName='active'>
          <p>Home</p>
        </NavLink>
        <div className='side-nav-div'>
          <div>
            <p>PUBLIC</p>
          </div>
          <NavLink to='/Questions' className='side-nav-links' activeClassName='active'>
            <img src={Globe} alt="Globe" />
            <p style={{ paddingLeft: "10px" }}>Questions</p>
          </NavLink>
          <NavLink to='/Tags' className='side-nav-links' activeClassName='active' style={{ paddingLeft: "40px" }}>
            <p>Tags</p>
          </NavLink>
          <NavLink to='/Users' className='side-nav-links' activeClassName='active' style={{ paddingLeft: "40px" }}>
            <p>Users</p>
          </NavLink>
          <NavLink to='/VideoPlayer' className='side-nav-links' activeClassName='active' style={{ paddingLeft: "40px" }}>
            <p>Video Player</p>
          </NavLink>
          <NavLink to='/ChatRoom' className='side-nav-links' activeClassName='active' style={{ paddingLeft: "40px" }} onClick={handleChatRoomClick}>
            <p>Chat Room</p>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default LeftSidebar;
