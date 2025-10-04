/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import * as api from '../services/api';

interface StudentProfileProps {
    onProfileLoad: (studentId: string) => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ onProfileLoad }) => {
    const initialFormState = {
        firstName: '',
        middleName: '',
        lastName: '',
        publicStudentId: ''
    };
    const [allStudents, setAllStudents] = useState<any[]>([]);
    const [student, setStudent] = useState<any>(null); // The currently loaded student
    const [formData, setFormData] = useState(initialFormState);
    const [message, setMessage] = useState('');

    const fetchAllStudents = async () => {
        try {
            const res = await api.getStudents();
            setAllStudents(res.data);
        } catch (error) {
            console.error("Failed to fetch students", error);
            setMessage('Failed to load student list.');
        }
    };

    useEffect(() => {
        fetchAllStudents();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLoadProfile = (selectedStudent: any) => {
        setStudent(selectedStudent);
        setFormData(selectedStudent);
        onProfileLoad(selectedStudent.publicStudentId);
        setMessage(`Profile for ${selectedStudent.firstName} ${selectedStudent.lastName} loaded for editing.`);
    };

    const handleClearForm = () => {
        setStudent(null);
        setFormData(initialFormState);
        onProfileLoad('');
        setMessage('Form cleared. You can now create a new profile.');
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let res;
            if (student) {
                res = await api.updateStudent(student.publicStudentId, formData);
                setMessage('Profile updated successfully!');
            } else {
                res = await api.createStudent(formData);
                setMessage('Profile created successfully!');
            }
            setStudent(res.data);
            onProfileLoad(res.data.publicStudentId);
            fetchAllStudents(); // Refresh the list
        } catch (error: any) {
            setMessage(`Error: ${error.response?.data?.error || 'Failed to save profile.'}`);
        }
    };

    const handleDelete = async () => {
        if (!student) return;
        if (window.confirm('Are you sure you want to delete this profile?')) {
            try {
                await api.deleteStudent(student.publicStudentId);
                setMessage('Profile deleted.');
                handleClearForm();
                fetchAllStudents(); // Refresh the list
            } catch (error: any) {
                setMessage(`Error: ${error.response?.data?.error || 'Failed to delete profile.'}`);
            }
        }
    };

    return (
        <div>
            <div className="form-grid">
                <form onSubmit={handleSave} className='form-grid'>
                    <h3>{student ? 'Edit Profile' : 'Create New Profile'}</h3>
                    <p>Either load a profile and enter below to edit profile, or create a new profile.</p>
                    <input name="publicStudentId" value={formData.publicStudentId} onChange={handleInputChange} placeholder="Public Student ID" required disabled={!!student} />
                    <input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" required />
                    <input name="middleName" value={formData.middleName || ''} onChange={handleInputChange} placeholder="Middle Name" />
                    <input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" required />
                    <div className="button-group">
                        <button type="submit">{student ? 'Update Profile' : 'Create Profile'}</button>
                        {student && <button type="button" onClick={handleDelete}>Delete Profile</button>}
                        {/* <button type="button" onClick={handleClearForm}>New Profile</button> */}
                    </div>
                </form>
                {message && <p className="message">{message}</p>}
            </div>

            <hr />

            <h3>Existing Student Profiles</h3>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {allStudents.map((s) => (
                        <tr key={s._id}>
                            <td>{s.publicStudentId}</td>
                            <td>{`${s.firstName} ${s.lastName}`}</td>
                            <td>
                                <button onClick={() => handleLoadProfile(s)}>Load Profile</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentProfile;