import authRoutes from './routes/authRoutes';
import express, { Request, Response, NextFunction } from 'express';
import userRoutes from './routes/userRoutes';
import { requireFirebaseAuth } from './middleware/auth';
// import tokenRoute from './routes/tokenRoute';
import './Firebase'; // מוודא אתחול פעם אחת
interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string | null;
  };
}
const app = express();
const admin = require('firebase-admin');
//const serviceAccount = require('./mindsync-3fb4f-firebase-adminsdk-fbsvc-6a8eb9b421.json');
app.use(express.json());
app.use('/', userRoutes);
app.use('/', authRoutes);
const port = process.env.PORT;
// app.listen(3000, () => {
//   console.log('Server running on port 3000');
// });
app.listen(port, () => console.log(`listening on ${port}`));
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