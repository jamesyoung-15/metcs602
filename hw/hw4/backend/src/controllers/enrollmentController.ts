import { Request, Response } from "express";
import Enrollment from "../models/enrollment.js";
import Student from "../models/student.js";
import type {CourseEnrollmentResponse} from "../models/course.js";

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
    const { studentId, courseId, dateEnrolled, GPA } = req.body;
    
    // Find the student by publicStudentId to get the ObjectId
    const student = await Student.findOne({ publicStudentId: studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // check if mongodb student._id is already enrolled in courseId
    const existingEnrollment = await Enrollment.findOne({ 
      "courses.student": student._id,
      "courses.course": courseId,
      isDeleted: { $exists: false } 
    });
    if (existingEnrollment) {
      return res.status(400).json({ error: "Student is already enrolled in this course" });
    }

    // Create enrollment with the correct schema structure
    const enrollment = await Enrollment.create({
      courses: [{
        course: courseId,
        student: student._id,
        GPA: GPA || 0.0,
        dateEnrolled: dateEnrolled
      }]
    });
    
    res.status(201).json(enrollment);
  } catch (error) {
    console.error("Error creating enrollment:", error);
    res.status(400).json({ error: "Failed to create enrollment" });
  }
};

// Get enrollments by publicStudentId from mongoDB
export const getEnrollmentsByStudentId = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    
    // Find the student by publicStudentId to get the ObjectId
    const student = await Student.findOne({ publicStudentId: studentId });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Find enrollments where the student is enrolled
    const enrollments = await Enrollment.find({ 
      "courses.student": student._id,
      isDeleted: { $exists: false } 
    }).populate('courses.course');

    // Transform the data to match your test expectations
    const courseEnrollments : CourseEnrollmentResponse[] = [];
    enrollments.forEach(enrollment => {
      enrollment.courses.forEach(courseEnrollment => {
        // @ts-ignore
        if (courseEnrollment.student.toString() === student._id.toString()) {
          courseEnrollments.push({
            course: courseEnrollment.course,
            GPA: courseEnrollment.GPA,
            dateEnrolled: courseEnrollment.dateEnrolled
          });
        }
      });
    });
    
    res.json(courseEnrollments);
  } catch (error) {
    console.error("Error in getEnrollmentsByStudentId:", error);
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
};