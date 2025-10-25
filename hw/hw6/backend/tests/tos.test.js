import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import tos from '../routes/tosRoutes.js';

// setup express app for testing
const app = express();
app.use(express.json());
app.use('/terms-of-service', tos);

// Connect to a test database  and clear it  after tests
beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/patient-intaker-test');
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe('Terms of Service API', () => {
    it('should submit TOS agreement successfully', async () => {
        const res = await request(app)
            .post('/terms-of-service')
            .send({
                tosAgreed: true,
                userId: new mongoose.Types.ObjectId().toHexString()
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Terms of Service agreement updated successfully!');
    });
    
    it('should return error for missing fields', async () => {
        const res = await request(app)
            .post('/terms-of-service')
            .send({
                // Missing tosAgreed and userId
            });

        expect(res.statusCode === 400 || res.statusCode === 500).toBeTruthy();
        expect(res.body).toHaveProperty('error');
    });
});