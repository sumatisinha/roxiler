import express from 'express';
import { signup, login } from '../controllers/authController.js';
import { userSchema, loginSchema } from '../utils/validationSchemas.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.post('/signup', validate(userSchema), signup);
router.post('/login', validate(loginSchema), login);

export default router;