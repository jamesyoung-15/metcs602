/**
 * @file venues.js
 * @description Routes for managing venues, including retrieving, creating, and viewing individual venues.
 * @module routes/venues
 */

import express from 'express';
import Venue from '../models/Venue.js';

const router = express.Router();

/**
 * Get all venues.
 * @route GET /api/venues
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object containing a list of venues.
 */
router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find().sort({ date: 1 });
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get a single venue by ID.
 * @route GET /api/venues/:id
 * @param {express.Request} req - The request object containing the venue ID in the URL parameters.
 * @param {express.Response} res - The response object containing the venue details.
 */
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    res.json(venue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Create a new venue (for testing or seeding purposes).
 * @route POST /api/venues
 * @param {express.Request} req - The request object containing the venue details in the body.
 * @param {express.Response} res - The response object containing the created venue.
 */
router.post('/', async (req, res) => {
  try {
    const venue = new Venue(req.body);
    await venue.save();
    res.status(201).json(venue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;