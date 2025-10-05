import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import authRouter from '../routes/auth.js';
import cartRouter from '../routes/cart.js';
import venueRouter from '../routes/venues.js';
import User from '../models/User.js';
import Cart from '../models/Cart.js';
import Venue from '../models/Venue.js';
import cors from 'cors';

// set up express app with necessary middleware and routes
const app = express();
app.use(cors()); // needed for token auth
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/venues', venueRouter);

// connect to test database, clear relevant collections before each test
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/ticketmaster-test');
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Cart.deleteMany({});
  await Venue.deleteMany({});
});


describe('Cart Routes', () => {
  let token;
  let venueId;

  // setup user, venue, and get auth token before each test 
  beforeEach(async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123',
        name: 'Test User'
      });
    token = registerRes.body.token;

    const venue = await Venue.create({
      title: { en: 'Test', it: 'TestIt', fr: 'TestFr', es: 'TestEs' },
      slogan: { en: 'En slogan', it: 'It slogan', fr: 'Fr slogan', es: 'Es slogan' },
      showcaseImage: 'image.jpg',
      galleryImages: ['1.jpg'],
      date: new Date(),
      location: { city: 'London', country: 'UK', venue: 'Wembley Stadium' },
      ticketPrice: 50,
      availableTickets: 100
    });
    venueId = venue._id.toString();
  });

  // test get, add, update, remove, and clear cart endpoints
  describe('GET /api/cart', () => {
    test('should get empty cart for new user', async () => {
      const res = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('items');
      expect(res.body.items).toHaveLength(0);
    });

    test('should not get cart without auth', async () => {
      const res = await request(app).get('/api/cart');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/cart/add', () => {
    test('should add item to cart', async () => {
      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({
          venueId: venueId,
          quantity: 2
        });

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].quantity).toBe(2);
      expect(res.body.items[0].price).toBe(50);
    });

    test('should increment quantity if item already in cart', async () => {
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ venueId: venueId, quantity: 2 });

      const res = await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ venueId: venueId, quantity: 3 });

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].quantity).toBe(5);
    });
  });

  describe('PUT /api/cart/update/:venueId', () => {
    test('should update item quantity', async () => {
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ venueId: venueId, quantity: 2 });

      const res = await request(app)
        .put(`/api/cart/update/${venueId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(200);
      expect(res.body.items[0].quantity).toBe(5);
    });
  });

  describe('DELETE /api/cart/remove/:venueId', () => {
    test('should remove item from cart', async () => {
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ venueId: venueId, quantity: 2 });

      const res = await request(app)
        .delete(`/api/cart/remove/${venueId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(0);
    });
  });

  describe('DELETE /api/cart/clear', () => {
    test('should clear entire cart', async () => {
      await request(app)
        .post('/api/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ venueId: venueId, quantity: 2 });

      const res = await request(app)
        .delete('/api/cart/clear')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(0);
    });
  });
});