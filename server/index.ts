
import authRoutes from './routes/authRoutes';
import express, { Request, Response } from 'express';
import userRoutes from './routes/userRoutes';
import { requireFirebaseAuth } from './middleware/auth';
import { ideasRouter } from './routes/ideaRoutes';
import { sessionsRouter } from './routes/sessionRoutes';
import { verifyUserInDb } from './middleware/verifyUserInDb';
import 'dotenv/config';
import './Firebase'; 

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string | null;
  };
}

const app = express();  
const port = process.env.PORT;

app.listen(port, () => console.log(`listening on ${port}`));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/sessions', sessionsRouter);
app.use('/ideas', ideasRouter);

app.use(requireFirebaseAuth, verifyUserInDb);
app.get('/protected-data', (req: AuthenticatedRequest, res: Response) => {
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
