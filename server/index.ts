import authRoutes from './routes/authRoutes';
import express, { Request, Response, NextFunction } from 'express';
import userRoutes from './routes/userRoutes';
import { authenticate } from './middleware/auth';
import './Firebase'; // מוודא אתחול פעם אחת

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string | null;
  };
}
const app = express();

app.get('/protected-data', authenticate, (req: AuthenticatedRequest, res: Response) => {
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

app.use('/', authRoutes);
app.use(express.json());
app.use('/', userRoutes);
app.listen(3000, () => {
  console.log('Server running on port 3000');
})