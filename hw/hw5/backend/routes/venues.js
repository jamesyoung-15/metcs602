import express from 'express';
import Venue from '../models/Venue.js';

const router = express.Router();

// Get all venues
router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find().sort({ date: 1 });
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single venue
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

// Create venue (for testing/seeding)
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