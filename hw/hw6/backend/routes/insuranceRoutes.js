import express from 'express';
import { submitInsuranceDetails } from '../controllers/insuranceController.js';

const router = express.Router();

/** 
 * Route to handle submission of insurance details 
 */
router.post('/', submitInsuranceDetails);

export default router;