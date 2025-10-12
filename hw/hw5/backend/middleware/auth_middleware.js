/**
 * @file auth_middleware.js
 * @description Authentication Middleware module, checks for valid JWT tokens in request headers.
 * @module authMiddleware
 */

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

/** 
 * Middleware to authenticate requests using JWT
 * @param {Object} req - The request object, should contain an Authorization header with a Bearer token
 * @param {Object} res - The response object, used to send a response back to the client
 * @param {Function} next - The next middleware function, called if authentication is successful
 * 
 * @returns {void} - Calls next() if authentication is successful, or sends a 401 response if not
 */
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