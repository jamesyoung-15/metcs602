import express from "express";
import { getCourses, createCourse, getEnabledCourses } from "../controllers/courseController.js";

const router = express.Router();

// Routes for /api/courses to get and create courses
router.get("/", getCourses); // Get all courses
router.post("/", createCourse); // Create a course
router.get("/enabled", getEnabledCourses); // Get all enabled courses

export default router;