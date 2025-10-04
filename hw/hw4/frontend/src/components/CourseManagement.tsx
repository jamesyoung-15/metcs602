/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import * as api from '../services/api';

const CourseManagement: React.FC = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        publicCourseId: '',
        courseName: '',
        semester: '',
        year: new Date().getFullYear(),
        enabled: true,
    });
    const [message, setMessage] = useState('');

    const fetchCourses = async () => {
        try {
            const res = await api.getCourses();
            setCourses(res.data);
        } catch (error) {
            setMessage('Failed to fetch courses, error: ' + error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        // @ts-expect-error asdf
        setFormData({ ...formData, [name]: isCheckbox ? e.target.checked : value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createCourse(formData);
            setMessage('Course created successfully!');
            fetchCourses(); // Refresh the list
            // Reset form
            setFormData({
                publicCourseId: '',
                courseName: '',
                semester: '',
                year: new Date().getFullYear(),
                enabled: true,
            });
        } catch (error: any) {
            setMessage(`Error: ${error.response?.data?.error || 'Failed to create course.'}`);
        }
    };

    return (
        <div>
            <h2>Course Administration</h2>
            
            <form onSubmit={handleSave} className="form-grid">
                <h3>Create New Course</h3>
                <input name="publicCourseId" value={formData.publicCourseId} onChange={handleInputChange} placeholder="Public Course ID (e.g., METCS602)" required />
                <input name="courseName" value={formData.courseName} onChange={handleInputChange} placeholder="Course Name" required />
                <input name="semester" value={formData.semester} onChange={handleInputChange} placeholder="Semester (e.g., Fall)" required />
                <input type="number" name="year" value={formData.year} onChange={handleInputChange} placeholder="Year" required />
                <label>
                    <input type="checkbox" name="enabled" checked={formData.enabled} onChange={handleInputChange} />
                    Enabled for Enrollment
                </label>
                <button type="submit">Create Course</button>
            </form>
            {message && <p className="message">{message}</p>}

            <hr />

            <h3>Existing Courses</h3>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Course ID</th>
                        <th>Name</th>
                        <th>Semester</th>
                        <th>Year</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course._id}>
                            <td>{course.publicCourseId}</td>
                            <td>{course.courseName}</td>
                            <td>{course.semester}</td>
                            <td>{course.year}</td>
                            <td>{course.enabled ? 'Enabled' : 'Disabled'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CourseManagement;