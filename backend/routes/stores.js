import express from 'express';
import { getAllStores, createStore, getMyStore } from '../controllers/storeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { storeSchema } from '../utils/validationSchemas.js';

const router = express.Router();

// MODIFICATION: Added a dedicated route for an owner to fetch their store
router.get('/my-store', authMiddleware(['owner']), getMyStore);

// Admin can add store
router.post('/', authMiddleware(['admin']), validate(storeSchema), createStore);

// Any logged-in user can view stores
router.get('/', authMiddleware(), getAllStores);

export default router;