
import authRoutes from './routes/authRoutes';
import express, { Request, Response, NextFunction } from 'express';
import userRoutes from './routes/userRoutes';
import { requireFirebaseAuth } from './middleware/auth';
import 'dotenv/config';
import './Firebase'; // מוודא אתחול פעם אחת
import { ideasRouter } from './routes/ideaRoutes';
import { sessionsRouter } from './routes/sessionRoutes';
import { json } from "body-parser";

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string | null;
  };
}
const app = express();

const admin = require('firebase-admin');

const port = process.env.PORT;
app.listen(port, () => console.log(`listening on ${port}`));

// app.use(requireFirebaseAuth);
app.use(express.json());
app.use('/user', userRoutes,requireFirebaseAuth);
app.use('/route', authRoutes,requireFirebaseAuth);
app.use('/ideas', ideasRouter);
app.use('/sessions', sessionsRouter);

app.get('/protected-data', requireFirebaseAuth, (req: AuthenticatedRequest, res: Response) => {
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





