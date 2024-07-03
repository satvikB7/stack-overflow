import axios from 'axios';

const API = axios.create({
  baseURL: 'https://stack-overflow-wine-three.vercel.app/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createRoom = async () => {
  try {
    const pin = Math.random().toString(36).substring(2, 8).toUpperCase();

    const response = await API.post('/createRoom', { pin });
    return response.data;
  } catch (error) {
    throw new Error(`Error creating room: ${error.message}`);
  }
};
