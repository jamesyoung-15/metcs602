import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import insuranceRouter from '../routes/insuranceRoutes.js';

// setup express app for testing
const app = express();
app.use(express.json());
app.use('/insurance', insuranceRouter);

// Connect to a test database  and clear it  after tests
beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/patient-intaker-test');
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe('Insurance Details API', () => {
    it('should submit insurance details successfully', async () => {
        const res = await request(app)
            .post('/insurance')
            .send({
                userId: new mongoose.Types.ObjectId().toHexString(),
                insuranceCarrier: 'HealthCare Inc.',
                policyNumber: 'HC123456789',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Insurance details submitted successfully!');
        expect(res.body.insuranceData).toHaveProperty('userId');
        expect(res.body.insuranceData).toHaveProperty('insuranceCarrier', 'HealthCare Inc.');
        expect(res.body.insuranceData).toHaveProperty('policyNumber', 'HC123456789');
    });
    it('should return error for missing fields', async () => {
        const res = await request(app)
            .post('/insurance')
            .send({
                userId: new mongoose.Types.ObjectId().toHexString(),
                // Missing provider, policyNumber, groupNumber, phone
            });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error');
    });
});