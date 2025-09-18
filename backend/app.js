import express from 'express';
import cors from 'cors';
import { sequelize } from './models/index.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import storeRoutes from './routes/stores.js';
import ratingRoutes from './routes/ratings.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);

app.get('/', (req, res) => {
  res.send('API running');
});

// DB connect and start server
sequelize.authenticate()
  .then(() => sequelize.sync()) // Use { force: true } or { alter: true } during development if you need to reset tables
  .then(() => {
    app.listen(5000, () => console.log('Backend running on port 5000'));
  })
  .catch(err => console.error('DB error:', err));