import { submitTosAgreement } from "../controllers/tosController.js";
import express from "express";

const router = express.Router();

/**
 * Route to handle submission of Terms of Service agreement
 */
router.post("/", submitTosAgreement);

export default router;