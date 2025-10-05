import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import authRouter from '../routes/auth.js';
import User from '../models/User.js';
import cors from 'cors';

// set up express app with necessary middleware and routes
const app = express();
app.use(cors()); // needed for token auth
app.use(express.json());
app.use('/api/auth', authRouter);

// connect to test database, clear relevant collections before each test
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/ticketmaster-test');
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth Routes', () => {
  // register a user, login, and get profile tests
  describe('POST /api/auth/register', () => {
    test('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
          name: 'Test User',
          defaultLanguage: 'en'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('username', 'testuser');
      expect(res.body.user).not.toHaveProperty('password');
    });

    test('should not register duplicate username', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
          name: 'Test User',
          defaultLanguage: 'en'
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password456',
          name: 'Another User',
          defaultLanguage: 'en'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    // basic login tests
    test('should login existing user', async () => {
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
          name: 'Test User',
          defaultLanguage: 'en'
        });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('username', 'testuser');
    });

    test('should not login with wrong password', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@test.com',
          password: 'password123',
          name: 'Test User'
        });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    test('should not login non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'notexist@test.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
  });

  describe('GET /api/auth/profile', () => {
    test('should not get profile without token', async () => {
      const res = await request(app)
        .get('/api/auth/profile');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'No token provided');
    });

    test('should not get profile with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Invalid token');
    });
  });
});