import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import healthRouter from '../routes/healthRoutes.js';

// setup express app for testing
const app = express();
app.use(express.json());
app.use('/health', healthRouter);

// Connect to a test database  and clear it  after tests
beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/patient-intaker-test');
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});


describe('Health Questions API', () => {
    it('should submit health questions successfully', async () => {
        const res = await request(app)
            .post('/health')
            .send({
                userId: new mongoose.Types.ObjectId().toHexString(),
                grayHairBeforeChildren: true,
                brokenBoneAfter16: false,
                tripsOverSmallStones: true
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message');
        expect(res.body.healthData).toHaveProperty('userId');
        expect(res.body.healthData).toHaveProperty('grayHairBeforeChildren', true);
        expect(res.body.healthData).toHaveProperty('brokenBoneAfter16', false);
        expect(res.body.healthData).toHaveProperty('tripsOverSmallStones', true);
    });

    it('should return error for missing fields', async () => {
        const res = await request(app)
            .post('/health')
            .send({
                userId: new mongoose.Types.ObjectId().toHexString(),
                // Missing grayHairBeforeChildren, brokenBoneAfter16, tripsOverSmallStones
            });
            
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error');
    });
});