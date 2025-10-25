import express from 'express';
import upload from '../middleware/multer.js';
import { uploadInsuranceCard } from '../controllers/uploadController.js';

const router = express.Router();

/** 
 * Route to handle insurance card file uploads
 */
router.post('/', upload.single('insuranceCard'), uploadInsuranceCard);

export default router;