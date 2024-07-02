import React, { useState, useEffect } from 'react';
import './Notification.css'; 

const Notification = ({ message }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000); // Remove notification after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {visible && (
        <div className="notification">
          <p>{message}</p>
        </div>
      )}
    </>
  );
};

export default Notification;
