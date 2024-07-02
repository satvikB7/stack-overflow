import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './VideoPage.css';

const resolutions = ['144p', '240p', '320p', '480p', '720p', '1080p'];

const VideoPage = () => {
  const { id } = useParams();
  const videoRef = useRef(null);
  const [currentResolution, setCurrentResolution] = useState('720p');
  const [showOptions, setShowOptions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [gestureIndicator, setGestureIndicator] = useState('');
  const pressHoldIntervalRef = useRef(null);

  const video = {
    _id: '1',
    videoSrc: {
      '144p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      '240p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      '320p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      '480p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      '720p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      '1080p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
    videoTitle: 'Big Buck Bunny',
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement || !!document.webkitFullscreenElement);
    };

    const handleTimeUpdate = () => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);

      if (videoRef.current) {
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, []);

  const handleResolutionChange = (resolution) => {
    const wasPlaying = !videoRef.current.paused;
    const currentTime = videoRef.current.currentTime;
    
    setCurrentResolution(resolution);
    videoRef.current.src = video.videoSrc[resolution];
    videoRef.current.currentTime = currentTime;
    
    if (wasPlaying) {
      videoRef.current.play();
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current && videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      setGestureIndicator('Play');
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
        setGestureIndicator('Pause');
      }
    }
    setTimeout(() => setGestureIndicator(''), 1000); // Hide the indicator after 1 second
  };

  const handleFullscreen = () => {
    if (!isFullscreen) {
      if (videoRef.current && videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current && videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleSeek = (event) => {
    const newTime = event.target.value;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleClick = (event) => {
    const { clientX } = event;
    const { left, width } = videoRef.current.getBoundingClientRect();
    const clickRatio = (clientX - left) / width;

    if (clickRatio <= 0.25) {
      if (videoRef.current) {
        videoRef.current.currentTime -= 5;
        setGestureIndicator('-5s');
      }
    } else if (clickRatio >= 0.75) {
      if (videoRef.current) {
        videoRef.current.currentTime += 10;
        setGestureIndicator('+10s');
      }
    } else {
      handlePlayPause();
    }
    setTimeout(() => setGestureIndicator(''), 1000); 
  };

  const handlePressAndHold = (event) => {
    const { clientX } = event;
    const { left, width } = videoRef.current.getBoundingClientRect();
    const clickRatio = (clientX - left) / width;

    if (clickRatio <= 0.5) {
      if (videoRef.current) {
        setGestureIndicator('3x <<');
        const backwardInterval = setInterval(() => {
          videoRef.current.currentTime -= 3;
        }, 100)

        pressHoldIntervalRef.current = backwardInterval;
      }
    } else {
      if (videoRef.current) {
        setGestureIndicator('2x >>');
        const forwardInterval = setInterval(() => {
          videoRef.current.currentTime += 2;
        }, 100);

        pressHoldIntervalRef.current = forwardInterval;
      }
    }
  };

  const handleReleasePressAndHold = () => {
    // Clear the interval set during press and hold
    clearInterval(pressHoldIntervalRef.current);
    setGestureIndicator('');
  };

  return (
    <div className={`video_page ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="video_container">
        <video
          ref={videoRef}
          src={video.videoSrc[currentResolution]}
          className={`video_Player ${isFullscreen ? 'fullscreen' : ''}`}
          controlsList="nodownload"
          controls={false}
          onClick={handleClick}
          onMouseDown={handlePressAndHold}
          onMouseUp={handleReleasePressAndHold}
          onContextMenu={(e) => e.preventDefault()} // Prevent context menu on right-click
        />
        <div className={`custom_controls ${isFullscreen ? 'fullscreen' : ''}`}>
          <button onClick={handlePlayPause} className='play_button'>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={handleFullscreen} className="fullscreen_button">
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
          <button onClick={toggleOptions} className="resolution_button">Resolutions</button>
          {showOptions && (
            <div className="resolution_controls">
              {resolutions.map((resolution) => (
                <button key={resolution} onClick={() => handleResolutionChange(resolution)}>
                  {resolution}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="seek_bar_container">
          <input
            type="range"
            className="seek_bar"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
          />
        </div>
        {gestureIndicator && (
          <div className={`gesture_indicator`}>
            {gestureIndicator}
          </div>
        )}
      </div>
      <div className="video_info">
        <h1>{video.videoTitle}</h1>
      </div>
    </div>
  );
};

export default VideoPage;
