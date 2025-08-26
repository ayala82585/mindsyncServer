import express from 'express';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';


const app = express();
app.use(express.json());
app.use('/users', userRoutes);
app.use('/', authRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

