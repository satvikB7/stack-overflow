import React from 'react';
import { Link } from 'react-router-dom';
import './VideoPlayer.css';
import LeftSidebar from '../LeftSidebar/LeftSidebar';

const videos = [
  { _id: '1', title: 'Video 1', url: '/videopage/1' },
];

function VideoPlayer() {
  return (
    <div className="home-container-1">
      <LeftSidebar />
      <div className="home-container-2">
        <div className="video-player-container">
          <h1 className="video-player-title">Available Videos</h1>
          <ul className="video-list">
            {videos.map((video) => (
              <li key={video._id} className="video-item">
                <Link to={video.url} className="video-link">{video.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
