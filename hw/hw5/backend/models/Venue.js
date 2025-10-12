/**
 * @file Venue.js
 * @description Mongoose model for the Venue collection, representing event venues.
 * @module models/Venue
 */

import mongoose from 'mongoose';

/**
 * Schema for the Venue collection.
 * @typedef {Object} Venue
 * @property {Map<string, string>} title - The title of the venue.
 * @property {Map<string, string>} slogan - The slogan of the venue.
 * @property {string} showcaseImage - Filepath or URL to the venue's showcase image.
 * @property {string[]} galleryImages - An array of URLs/filepaths for the venue's gallery images.
 * @property {Date} date - The date of the event at venue.
 * @property {Object} location - The location details of venue.
 * @property {string} location.city - The city where venue is located.
 * @property {string} location.country - The country where venue is located.
 * @property {string} location.venue - Venue name.
 * @property {number} ticketPrice - Price of a ticket for event.
 * @property {number} availableTickets - Available tickets available for the event.
 * @property {Date} createdAt - UTC timestamp for creation.
 */
const venueSchema = new mongoose.Schema({
  title: {
    type: Map,
    of: String,
    required: true
  },
  slogan: {
    type: Map,
    of: String,
    required: true
  },
  showcaseImage: {
    type: String,
    required: true
  },
  galleryImages: [{
    type: String
  }],
  date: {
    type: Date,
    required: true
  },
  location: {
    city: String,
    country: String,
    venue: String
  },
  ticketPrice: {
    type: Number,
    required: true
  },
  availableTickets: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Mongoose model for the Venue collection.
 */
export default mongoose.model('Venue', venueSchema);