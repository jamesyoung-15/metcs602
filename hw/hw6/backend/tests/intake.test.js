import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import intakeRouter from '../routes/intakeRoutes.js';

// setup express app for testing
const app = express();
app.use(express.json());
app.use('/intake', intakeRouter);

// Connect to a test database  and clear it  after tests
beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/patient-intaker-test');
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe('Intake Form API', () => {
    it('should submit intake form successfully', async () => {
        const res = await request(app)
            .post('/intake')
            .send({
                firstName: 'John',
                middleName: 'A',
                lastName: 'Doe',
                mobile: '123-456-7890',
                email: 'john.doe@example.com',
                address: '123 Main St, Anytown, USA'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User intake form submitted successfully!');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).toHaveProperty('firstName', 'John');
        expect(res.body.user).toHaveProperty('middleName', 'A');
        expect(res.body.user).toHaveProperty('lastName', 'Doe');
        expect(res.body.user).toHaveProperty('mobile', '123-456-7890');
        expect(res.body.user).toHaveProperty('email', 'john.doe@example.com');
        expect(res.body.user).toHaveProperty('address', '123 Main St, Anytown, USA');
    });
    it('should return error for missing fields', async () => {
        const res = await request(app)
            .post('/intake')
            .send({
                // Missing firstName, lastName, mobile, email, address
                middleName: 'A'
            });
            
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error');
    });
});