import { Request, Response } from "express";
import Enrollment from "../models/enrollment.js";

// Get all enrollments from mongoDB
export const getEnrollments = async (req: Request, res: Response) => {
  try {
    const enrollments = await Enrollment.find({ isDeleted: { $exists: false } });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
};

// Create a new enrollment in mongoDB
export const createEnrollment = async (req: Request, res: Response) => {
  try {
    const enrollment = await Enrollment.create(req.body);
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(400).json({ error: "Failed to create enrollment" });
  }
};