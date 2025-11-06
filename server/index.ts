import authRoutes from './routes/authRoutes';
import express, { Request, Response } from 'express';
import userRoutes from './routes/userRoutes';
import { requireFirebaseAuth } from './middleware/auth';
import { ideasRouter } from './routes/ideaRoutes';
import { sessionsRouter } from './routes/sessionRoutes';
import 'dotenv/config';
import './Firebase'; // מוודא אתחול פעם אחת
import { verifyUserInDb } from './middleware/verifyUserInDb';
import aiRoutes from "./routes/aiRoutes";
import { swaggerSpec } from "./swagger";
import swaggerUi from "swagger-ui-express";
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import IdeaResponseRoutes from './routes/IdeaResponseRoutes';

const app = express();  
const admin = require('firebase-admin');
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: 'http://localhost:3000' } // התאימי את ה-origin לפי הצורך
});

const port = process.env.PORT;
server.listen(port, () => console.log(`Server listening on ${port}`));

//  app.use(requireFirebaseAuth,verifyUserInDb);
app.use(express.json());
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/ideas', ideasRouter);
app.use('/sessions', sessionsRouter);
app.use('/ideas', ideasRouter);
app.use("/ai", aiRoutes);
app.use("/ideaResponse", IdeaResponseRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/protected-data', requireFirebaseAuth, (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(500).json({ error: "Authenticated user information not found." });
  }
  const userUid = req.user.uid;
  const userEmail = req.user.email;
  res.status(200).json({
    message: `Hello, ${userEmail || 'authenticated user'}!`,
    user_id: userUid,
    user_email: userEmail,
    data_access: "You have successfully accessed protected data!"
  });
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('joinSession', (sessionId) => {
    socket.join(`session_${sessionId}`);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// ייצוא socket.io לשימוש פנימי
export { io };