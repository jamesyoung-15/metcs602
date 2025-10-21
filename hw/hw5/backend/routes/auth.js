/**
 * @file auth.js
 * @description Routes for user authentication and profile management.
 * @module routes/auth
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth_middleware.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Multer storage configuration for profile picture uploads.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

/**
 * Register a new user.
 * @route POST /register
 * @param {express.Request} req - The request object containing user details.
 * @param {express.Response} res - The response object.
 */
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, defaultLanguage } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, password, name, defaultLanguage });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        profilePicture: user.profilePicture,
        defaultLanguage: user.defaultLanguage
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Log in an existing user.
 * @route POST /login
 * @param {express.Request} req - The request object containing login credentials.
 * @param {express.Response} res - The response object.
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        profilePicture: user.profilePicture,
        defaultLanguage: user.defaultLanguage
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get the profile of the logged-in user.
 * @route GET /profile
 * @param {express.Request} req - The request object with the user's JWT token.
 * @param {express.Response} res - The response object containing user details.
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Update the profile of the logged-in user.
 * @route PUT /profile
 * @param {express.Request} req - The request object containing updated user details.
 * @param {express.Response} res - The response object containing updated user details.
 */
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, defaultLanguage, phoneNumber, mailAddress } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, defaultLanguage, phoneNumber, mailAddress },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Change the password of the logged-in user.
 * @route PUT /change-password
 * @param {express.Request} req - The request object containing current and new passwords.
 * @param {express.Response} res - The response object.
 */
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Upload a profile picture for the logged-in user.
 * @route POST /upload-picture
 * @param {express.Request} req - The request object containing the uploaded file.
 * @param {express.Response} res - The response object containing updated user details.
 */
router.post('/upload-picture', authMiddleware, upload.single('picture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { profilePicture: `/uploads/${req.file.filename}` },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;