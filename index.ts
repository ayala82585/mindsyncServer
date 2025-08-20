import express from 'express';
import userRoutes from './server/routes/userRoutes'; // Import user routes

const app = express();

app.use(express.json()); // To parse JSON request bodies
app.use('/', userRoutes); // All /user requests go to userRoutes

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
