/**
 * @file User.js
 * @description Mongoose model for the User collection, representing user accounts.
 * @module models/User
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * Schema for the User collection.
 * @typedef {Object} User
 * @property {string} username - The unique username of the user, stored in lowercase.
 * @property {string} password - The hashed password of the user.
 * @property {string} name - The full name of the user.
 * @property {string} phoneNumber - The user's phone number.
 * @property {string} mailAddress - The user's mailing address.
 * @property {string} profilePicture - The URL of the user's profile picture.
 * @property {string} defaultLanguage - The default language of the user, one of ['en', 'it', 'fr', 'es'].
 * @property {Date} createdAt - The timestamp when the user account was created.
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  defaultLanguage: {
    type: String,
    enum: ['en', 'it', 'fr', 'es'],
    default: 'en'
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  mailAddress: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Pre-save hook to hash the user's password before saving.
 * @function
 * @name preSave
 * @memberof User
 * @param {Function} next - The next middleware function.
 */
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 5);
  next();
});

/**
 * Method to compare a candidate password with the stored hashed password.
 * @function
 * @name comparePassword
 * @memberof User
 * @param {string} candidatePassword - The password to compare.
 * @returns {Promise<boolean>} - True if the passwords match, false otherwise.
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Mongoose model for the User collection.
 * @type {mongoose.Model<User>}
 */
export default mongoose.model('User', userSchema);