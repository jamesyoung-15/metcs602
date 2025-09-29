import express from "express";
import { getEnrollments, createEnrollment } from "../controllers/enrollmentController.js";

const router = express.Router();

// Routes for /api/enrollments to get and create enrollments
router.get("/", getEnrollments);
router.post("/", createEnrollment);

export default router;