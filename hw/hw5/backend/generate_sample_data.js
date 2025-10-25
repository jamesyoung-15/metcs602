import mongoose from 'mongoose';
import Venue from './models/Venue.js';
import venuesData from './data/venues.json' with { type: 'json' };
import dotenv from 'dotenv';
import config from './config/index.js';

// connect to mongoDB, insert sample venues from venues.json to create sample data
mongoose.connect(config.dbUri)
  .then(async () => {
    console.log('MongoDB connected');
    
    await Venue.deleteMany({});
    await Venue.insertMany(venuesData);
    
    console.log('Venues created successfully');
    process.exit(0);
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
