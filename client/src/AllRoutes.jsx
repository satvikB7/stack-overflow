import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Auth from './Pages/Auth/Auth';
import Questions from './Pages/Questions/Questions';
import AskQuestion from './Pages/AskQuestion/AskQuestion';
import DisplayQuestion from './Pages/Questions/DisplayQuestion';
import Tags from './Pages/Tags/Tags';
import Users from './Pages/Users/Users';
import UserProfile from './Pages/UserProfile/UserProfile';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';
import VideoPage from './Pages/VideoPage/VideoPage';
import ChatRoom from './components/ChatRoom/ChatRoom';
import ChatPage from './components/ChatRoom/ChatPage';

const sampleVideo = {
  _id: '1',
  videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  videoTitle: 'video',
};

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Auth" element={<Auth />} />
      <Route path="/AskQuestion" element={<AskQuestion />} />
      <Route path="/Questions" element={<Questions />} />
      <Route path="/Questions/:id" element={<DisplayQuestion />} />
      <Route path="/Tags" element={<Tags />} />
      <Route path="/Users" element={<Users />} />
      <Route path="/Users/:id" element={<UserProfile />} />
      <Route path="/VideoPlayer" element={<VideoPlayer vid={sampleVideo} />} />
      <Route path="/videopage/:id" element={<VideoPage />} />
      <Route path="/ChatRoom" element={<ChatRoom />} />
      <Route path="/chat/:pin" element={<ChatPage />} /> 
    </Routes>
  );
};

export default AllRoutes;
