import express from "express";
import { getStudents, createStudent, getStudentById, deleteStudent, updateStudent } from "../controllers/studentController.js";

const router = express.Router();

// Routes for /api/students to get and create students
router.get("/", getStudents); // Get all students
router.post("/", createStudent); // Create a student
router.get("/:id", getStudentById); // Get a student by ID
router.put("/:id", updateStudent); // Update a student by ID
router.delete("/:id", deleteStudent); // Soft delete a student by ID

export default router;