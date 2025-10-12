/**
 * @file cart.js
 * @description Routes for managing the user's shopping cart.
 * @module routes/cart
 */

import express from 'express';
import Cart from '../models/Cart.js';
import Venue from '../models/Venue.js';
import { authMiddleware } from '../middleware/auth_middleware.js';

const router = express.Router();

/**
 * Get the user's cart.
 * @route GET /api/cart
 * @param {express.Request} req - The request object with the user's JWT token.
 * @param {express.Response} res - The response object containing the user's cart.
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId }).populate('items.venueId');
    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Add an item to the user's cart.
 * @route POST /api/cart/add
 * @param {express.Request} req - The request object containing the venue ID and quantity.
 * @param {express.Response} res - The response object containing the updated cart.
 */
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { venueId, quantity } = req.body;
    
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    if (venue.availableTickets < quantity) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.venueId.toString() === venueId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        venueId,
        quantity,
        price: venue.ticketPrice
      });
    }

    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.venueId');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Update the quantity of an item in the user's cart.
 * @route PUT /api/cart/update/:venueId
 * @param {express.Request} req - The request object containing the new quantity.
 * @param {express.Response} res - The response object containing the updated cart.
 */
router.put('/update/:venueId', authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.venueId.toString() === req.params.venueId);
    if (!item) {
      return res.status(404).json({ message: 'Item not in cart' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(item => item.venueId.toString() !== req.params.venueId);
    } else {
      item.quantity = quantity;
    }

    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.venueId');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Remove an item from the user's cart.
 * @route DELETE /api/cart/remove/:venueId
 * @param {express.Request} req - The request object with the venue ID to remove.
 * @param {express.Response} res - The response object containing the updated cart.
 */
router.delete('/remove/:venueId', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.venueId.toString() !== req.params.venueId);
    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.venueId');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Clear all items from the user's cart.
 * @route DELETE /api/cart/clear
 * @param {express.Request} req - The request object with the user's JWT token.
 * @param {express.Response} res - The response object containing the cleared cart.
 */
router.delete('/clear', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;