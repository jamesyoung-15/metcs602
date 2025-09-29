import express from "express";
import { getCourses, createCourse } from "../controllers/courseController.js";

const router = express.Router();

// Routes for /api/courses to get and create courses
router.get("/", getCourses);
router.post("/", createCourse);

export default router;