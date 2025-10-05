import jwt from 'jsonwebtoken';

// lmao super secure
const JWT_SECRET = 'my_super_secret_jwt_secret_key';

// Middleware to authenticate JWT tokens in requests
export const authMiddleware = (req, res, next) => {
  try {
    // Expecting token in the format "Bearer <token>"
    const token = req.headers.authorization?.split(' ')[1];
    
    // return 401 if no token
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token and extract user information
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId; // attach userId for routes to use
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};