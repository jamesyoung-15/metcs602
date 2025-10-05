import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import venueRouter from '../routes/venues.js';
import Venue from '../models/Venue.js';

// set up express app with necessary middleware and routes, no need auth so no need cors
const app = express();
app.use(express.json());
app.use('/api/venues', venueRouter);

// connect to test database, clear relevant collections before each test
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/ticketmaster-test');
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Venue.deleteMany({});
});

describe('Venue Routes', () => {
  const sampleVenue = {
    title: {
      en: 'Test',
      it: 'Test',
      fr: 'Test',
      es: 'Test'
    },
    slogan: {
      en: 'test',
      it: 'test',
      fr: 'test',
      es: 'test'
    },
    showcaseImage: 'test.jpg',
    galleryImages: ['test1.jpg', 'test2.jpg'],
    date: new Date(),
    location: {
      city: 'London',
      country: 'UK',
      venue: 'Wembley Stadium'
    },
    ticketPrice: 89.99,
    availableTickets: 500
  };

  // test get all venues
  describe('GET /api/venues', () => {
    test('should return all venues', async () => {
      await Venue.create(sampleVenue);
      await Venue.create({
        ...sampleVenue,
        title: { en: 'Another', it: 'Altro', fr: 'Autre', es: 'Otro' }
      });

      const res = await request(app).get('/api/venues');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });
  });

  // test get single venue by id
  describe('GET /api/venues/:id', () => {
    test('should return single venue', async () => {
      const venue = await Venue.create(sampleVenue);

      const res = await request(app).get(`/api/venues/${venue._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title');
      expect(res.body.title.en).toBe('Test');
      expect(res.body).toHaveProperty('ticketPrice', 89.99);
    });

    test('should return 404 for non-existent venue', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/venues/${fakeId}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Venue not found');
    });
  });

  // test create venue
  describe('POST /api/venues', () => {
    test('should create new venue', async () => {
      const res = await request(app)
        .post('/api/venues')
        .send(sampleVenue);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title.en).toBe('Test');

      const venues = await Venue.find();
      expect(venues).toHaveLength(1);
    });
  });
});