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

// Get a student by publicStudentId from mongoDB
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const student = await Student.findOne({ publicStudentId: req.params.id });
    if (!student || student.isDeleted) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch student, " + error });
  }
};

// Create a new student in mongoDB
export const createStudent = async (req: Request, res: Response) => {
  try {
    // check if publicStudentId already exists
    const existingStudent = await Student.findOne({ publicStudentId: req.body.publicStudentId });
    if (existingStudent) {
      return res.status(400).json({ error: "publicStudentId already exists" });
    }
    // destructure fields from req.body, create new Student instance
    const { firstName, middleName, lastName, publicStudentId } = req.body;
    const student = new Student({ 
      firstName : firstName, middleName: middleName || undefined, lastName: lastName, publicStudentId: publicStudentId });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: "Failed to create student, " + error });
  }
};

// Update an existing student in mongoDB
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { firstName, middleName, lastName } = req.body;
    // find by publicStudentId instead of _id
    const student = await Student.findOneAndUpdate(
      { publicStudentId: req.params.id },
      { firstName, middleName, lastName },
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: "Failed to update student, " + error });
  }
};

// Soft delete a student by setting isDeleted field
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    // find by publicStudentId instead of _id, set isDeleted to current date
    const student = await Student.findOneAndUpdate(
      { publicStudentId: req.params.id },
      { isDeleted: new Date() },
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete student" });
  }
};