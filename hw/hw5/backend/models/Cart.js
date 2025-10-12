/**
 * @file Cart.js
 * @description Mongoose model for the Cart collection, representing a user's shopping cart.
 * @module models/Cart
 */

import mongoose from 'mongoose';

/**
 * Schema for a single cart item.
 * @typedef {Object} CartItem
 * @property {mongoose.Schema.Types.ObjectId} venueId - The ID of the venue associated with the cart item.
 * @property {number} quantity - The quantity of the item in the cart (minimum: 1).
 * @property {number} price - The price of the item.
 */
const cartItemSchema = new mongoose.Schema({
  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

/**
 * Schema for the Cart collection.
 * @typedef {Object} Cart
 * @property {mongoose.Schema.Types.ObjectId} userId - The ID of the user associated with the cart.
 * @property {CartItem[]} items - An array of items in the cart.
 * @property {Date} updatedAt - The timestamp of the last update to the cart.
 */
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Mongoose model for the Cart collection.
 */
export default mongoose.model('Cart', cartSchema);