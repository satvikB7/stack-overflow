import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';

import userRoutes from './routes/users.js';
import questionRoutes from './routes/Questions.js';
import answerRoutes from './routes/Answers.js';
import chatRoutes from './routes/chatRoutes.js';
import { socketMiddleware } from './middleware/socket.js';

const app = express();
dotenv.config();

app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors(
  {
    origin: ["https://deploy-mern-1whq.vercel.app"],
    methods: ["POST","GET","PATCH","DELETE","PUT"],
    credentails: true
  }
));

app.get('/', (req, res) => {
  res.send('This is a stack overflow clone API');
});
app.use('/user', userRoutes);
app.use('/questions', questionRoutes);
app.use('/answer', answerRoutes);
app.use('/chat', chatRoutes);

app.post('/createRoom', (req, res) => {
  const pin = Math.random().toString(36).substring(2, 8).toUpperCase();
  res.json({ pin });
});

const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.CONNECTION_URL;

mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const server = http.createServer(app);
    socketMiddleware(server); 

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err.message));
  

