import express from 'express';
import { scheduleAppointment } from '../controllers/scheduleController.js';

const router = express.Router();

/**
 * Route to handle scheduling of appointments
 */
router.post('/', scheduleAppointment);

export default router;