/* eslint-disable @typescript-eslint/no-explicit-any */ // too lazy to type everything right now
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3049/api', // Adjust if your backend port is different
});

// --- Student APIs ---
export const getStudent = (publicStudentId: string) => api.get(`/students/${publicStudentId}`);
export const getStudents = () => api.get('/students');
export const createStudent = (studentData: any) => api.post('/students', studentData);
export const updateStudent = (publicStudentId: string, studentData: any) => api.put(`/students/${publicStudentId}`, studentData);
export const deleteStudent = (publicStudentId: string) => api.delete(`/students/${publicStudentId}`);

// --- Course APIs ---
export const getCourses = () => api.get('/courses');
export const createCourse = (courseData: any) => api.post('/courses', courseData);

// --- Enrollment APIs ---
export const getStudentEnrollments = (publicStudentId: string) => api.get(`/enrollments/${publicStudentId}`);
export const enrollInCourse = (enrollmentData: any) => api.post('/enrollments', enrollmentData);

export default api;