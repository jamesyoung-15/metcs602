import express from 'express';
import { submitHealthQuestions } from '../controllers/healthController.js';

const router = express.Router();

/**
 * Route to handle submission of health questionnaire
 */
router.post('/', submitHealthQuestions);

export default router;