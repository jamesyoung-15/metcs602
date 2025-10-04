import express from "express";
import { getEnrollments, createEnrollment, getEnrollmentsByStudentId } from "../controllers/enrollmentController.js";

const router = express.Router();

// Routes for /api/enrollments to get and create enrollments
router.get("/", getEnrollments);
router.get("/:studentId", getEnrollmentsByStudentId);
router.post("/", createEnrollment);

export default router;