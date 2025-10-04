/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import * as api from '../services/api.js';

interface MyCoursesProps {
    publicStudentId: string;
}

const MyCourses: React.FC<MyCoursesProps> = ({ publicStudentId }) => {
    const [availableCourses, setAvailableCourses] = useState<any[]>([]);
    const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!publicStudentId) return;

        const fetchAllData = async () => {
            try {
                // Fetch available courses (enabled: true)
                const coursesRes = await api.getCourses();
                setAvailableCourses(coursesRes.data.filter((c: any) => c.enabled));

                // Fetch enrolled courses
                const enrolledRes = await api.getStudentEnrollments(publicStudentId);
                setEnrolledCourses(enrolledRes.data);
            } catch (error) {
                console.error("Failed to fetch course data", error);
                setMessage('Failed to load course data.');
            }
        };

        fetchAllData();
    }, [publicStudentId]);

    const handleEnroll = async (courseId: string) => {
        try {
            const enrollmentData = {
                studentId: publicStudentId,
                courseId: courseId,
                dateEnrolled: new Date().toISOString(),
            };
            await api.enrollInCourse(enrollmentData);
            setMessage(`Successfully enrolled in course ${courseId}.`);
            // Refresh enrolled courses
            const enrolledRes = await api.getStudentEnrollments(publicStudentId);
            setEnrolledCourses(enrolledRes.data);
        } catch (error: any) {
            setMessage(`Error: ${error.response?.data?.error || 'Failed to enroll.'}`);
        }
    };

    if (!publicStudentId) {
        return <div>Please load a student profile to see courses.</div>;
    }

    return (
        <div style={{ marginTop: '20px' }}>
            <hr />
            <h2>My Courses</h2>
            {enrolledCourses.length > 0 ? (
                <ul>
                    {enrolledCourses.map((enrollment) => (
                        <li key={enrollment.course._id}>
                            {enrollment.course.courseName} ({enrollment.course.semester} {enrollment.course.year}) - GPA: {enrollment.GPA}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You are not enrolled in any courses.</p>
            )}

            <h3 style={{ marginTop: '20px' }}>Available Courses</h3>
            {message && <p>{message}</p>}
            <table border={1} style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        <th>Course ID</th>
                        <th>Name</th>
                        <th>Semester</th>
                        <th>Year</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {availableCourses.map((course) => (
                        <tr key={course._id}>
                            <td>{course.publicCourseId}</td>
                            <td>{course.courseName}</td>
                            <td>{course.semester}</td>
                            <td>{course.year}</td>
                            <td>
                                <button onClick={() => handleEnroll(course._id)}>Enroll</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyCourses;