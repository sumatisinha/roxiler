import { User } from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const signup = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    const hash = await bcrypt.hash(password, 10);
    
    const user = await User.create({ 
      name, 
      email, 
      password_hash: hash, 
      address, 
      role: 'normal' 
    });

    // MODIFICATION: Automatically create a token upon signup for immediate login.
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // MODIFICATION: Send the token back to the frontend.
    res.status(201).json({ token });

  } catch (err) {
    // MODIFICATION: Add specific error handling for duplicate emails.
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    // Generic error for other issues
    res.status(400).json({ error: 'Failed to create user.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials. Please try again.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'An internal error occurred' });
  }
};