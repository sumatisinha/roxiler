import express from 'express';
import { submitRating, getRatingsForStore } from '../controllers/ratingController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { ratingSchema } from '../utils/validationSchemas.js';

const router = express.Router();

// User submits or updates a rating
router.post('/', authMiddleware(['normal']), validate(ratingSchema), submitRating);

// Anyone can get ratings for a store
router.get('/store/:storeId', getRatingsForStore);

export default router;