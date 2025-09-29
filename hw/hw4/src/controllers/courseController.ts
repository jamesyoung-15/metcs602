import { Request, Response } from "express";
import Course from "../models/course.js";

// Get all courses from mongoDB
export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find({ isDeleted: { $exists: false } });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// Create a new course in mongoDB
export const createCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: "Failed to create course" });
  }
};

// Get all enabled courses from mongoDB
export const getEnabledCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find({ enabled: true });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enabled courses" });
  }
};

// Update an existing course in mongoDB
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { courseName, semester, year, enabled } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { courseName, semester, year, enabled },
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(400).json({ error: "Failed to update course" });
  }
};