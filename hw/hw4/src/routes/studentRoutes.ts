import express from "express";
import { getStudents, createStudent } from "../controllers/studentController.js";

const router = express.Router();

// Routes for /api/students to get and create students
router.get("/", getStudents);
router.post("/", createStudent);

export default router;