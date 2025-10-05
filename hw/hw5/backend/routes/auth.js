import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth_middleware.js';

const router = express.Router();
const JWT_SECRET = 'my_super_secret_jwt_secret_key';

// Setup multer for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // check for uploads dir
    cb(null, 'uploads/');
  },
  // add timestamp to filename to avoid conflicts
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Register new user
router.post('/register', async (req, res) => {
  try {
    // form data
    const { username, password, name, defaultLanguage } = req.body;
    
    // check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // create user
    const user = new User({ username, password, name, defaultLanguage });
    await user.save();

    // create JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    
    // return token and user info
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

// Login
router.post('/login', async (req, res) => {
  try {
    // form data
    const { username, password } = req.body;
    
    // find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // create JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    
    // return token and user info
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

// Get profile info from userid in JWT token
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, defaultLanguage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, defaultLanguage },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change password
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

// Upload profile picture
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