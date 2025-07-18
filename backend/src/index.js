import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import bookRoutes from './routes/book.route.js';
import { connectDB } from './lib/db.js';

const app = express();
dotenv.config();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
  connectDB();
});
