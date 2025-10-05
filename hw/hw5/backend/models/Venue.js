import mongoose from 'mongoose';

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

export default mongoose.model('Venue', venueSchema);