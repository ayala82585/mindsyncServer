
import authRoutes from './routes/authRoutes';
import express, { Request, Response, NextFunction } from 'express';
import userRoutes from './routes/userRoutes';
import { authenticate } from './middleware/auth';
// import tokenRoute from './routes/tokenRoute';
import './Firebase'; // מוודא אתחול פעם אחת
import twofaRoutes from "./routes/twofaRoutes";

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string | null;
  };
}

// const admin = require('firebase-admin');
// const serviceAccount = require('./config/serviceAccountKey.json'); 
const app = express();
// const admin = require('firebase-admin');
// const serviceAccount = require('./mindsync-b978b-c1d1826e0375.json'); 


app.use(express.json());
app.use('/', userRoutes);
app.use('/', authRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});


app.use("/2fa", twofaRoutes);
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



