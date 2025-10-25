import express from 'express';
import { submitIntakeForm } from '../controllers/intakeController.js';

const router = express.Router();

/**
 * Route to handle submission of intake form
 */
router.post('/', submitIntakeForm);

export default router;