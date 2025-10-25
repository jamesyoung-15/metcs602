import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import scheduleRouter from '../routes/scheduleRoutes';

// setup express app for testing
const app = express();
app.use(express.json());
app.use('/schedule', scheduleRouter);

// Connect to a test database  and clear it  after tests
beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/patient-intaker-test');
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe('Schedule Appointment API', () => {
    it('should schedule an appointment successfully', async () => {
        const res = await request(app)
            .post('/schedule')
            .send({
                userId: new mongoose.Types.ObjectId().toHexString(),
                appointmentDate: '2024-07-01',
                appointmentTime: '10:00 AM'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Appointment scheduled successfully!');
        expect(res.body).toHaveProperty('appointment');
        expect(res.body.appointment).toHaveProperty('userId');
        expect(res.body.appointment).toHaveProperty('appointmentDate');
        expect(res.body.appointment).toHaveProperty('appointmentTime');
    });

    it('should return error for missing fields', async () => {
        const res = await request(app)
            .post('/schedule')
            .send({
                userId: new mongoose.Types.ObjectId().toHexString(),
                // Missing appointmentDate and appointmentTime
            });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error');
    });
});