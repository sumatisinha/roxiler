import express from 'express';
import { getAllUsers, getUserDetails, updatePassword, getStats } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// MODIFICATION: Added a dedicated stats route for the admin dashboard
router.get('/stats', authMiddleware(['admin']), getStats);

// MODIFICATION: Add a new PUT route for admins to update a user's role
router.put('/:id/role', authMiddleware(['admin']), updateUserRole);

router.get('/:id', authMiddleware(), getUserDetails);
router.post('/', authMiddleware(['admin']), getALLUsers);

// Admin can list all users
router.get('/', authMiddleware(['admin']), getAllUsers);

// Any logged-in user can view their details
router.get('/:id', authMiddleware(), getUserDetails);

// User updates own password
router.post('/update-password', authMiddleware(), updatePassword);

export default router;