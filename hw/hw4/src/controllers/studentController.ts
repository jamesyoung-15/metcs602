import { Request, Response } from "express";
import Student from "../models/student.js";

// Get all students from mongoDB
export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await Student.find({ isDeleted: { $exists: false } });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// Create a new student in mongoDB
export const createStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: "Failed to create student" });
  }
};