import { useState } from 'react';
import StudentProfile from './components/StudentProfile';
import MyCourses from './components/MyCourses';
import CourseManagement from './components/CourseManagement';
import './App.css';

type Tab = 'profile' | 'my-courses' | 'course-admin';

function App() {
  const [activeStudentId, setActiveStudentId] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const handleProfileLoad = (studentId: string) => {
    setActiveStudentId(studentId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <StudentProfile onProfileLoad={handleProfileLoad} />;
      case 'my-courses':
        return <MyCourses publicStudentId={activeStudentId} />;
      case 'course-admin':
        return <CourseManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <h1>METCS602 HW4 - StudentTrac</h1>
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          My Profile
        </button>
        <button
          className={`tab-button ${activeTab === 'my-courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-courses')}
          disabled={!activeStudentId}
        >
          My Courses
        </button>
        <button
          className={`tab-button ${activeTab === 'course-admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('course-admin')}
        >
          Course Management
        </button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default App;