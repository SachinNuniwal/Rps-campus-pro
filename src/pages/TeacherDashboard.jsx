import { useState, useCallback } from 'react';
import TeacherSidebar from '../components/TeacherSidebar';
import TeacherHeader from '../components/TeacherHeader';
import Toast from '../components/Toast';

import TDashboardPage from './teacher/TDashboardPage';
import TResultPage from './teacher/TResultPage';
import TAttendancePage from './teacher/TAttendancePage';
import { TGroupsPage, TMessagesPage, TLeavePage, TSubjectsPage, TProfilePage } from './teacher/TPages';

import { students as initialStudents, initialClasses } from '../data/data';

const PAGE_TITLES = {
    dashboard: 'Dashboard',
    result: 'Results Management',
    attendance: 'Attendance',
    groups: 'My Groups',
    messages: 'Messages',
    leaves: 'Leave Management',
    subjects: 'Subject Performance',
    profile: 'My Profile',
};

// Default logged-in teacher — Dr. Priya Verma
const defaultTeacher = {
    id: 'TCH-4421',
    name: 'Dr. Priya Verma',
    dept: 'CSE',
    subjects: ['DSA', 'OS'],
    classes: ['CSE-3A', 'CSE-3B'],
    designation: 'Sr. Professor',
    exp: '12 yrs',
    email: 'priya@college.edu',
    status: 'Active',
    photo: localStorage.getItem('teacherPhoto') || null,
};

export default function TeacherDashboard() {
    const [page, setPage] = useState('dashboard');
    const [toast, setToast] = useState('');
    const [teacher, setTeacher] = useState(defaultTeacher);

    const showToast = useCallback((msg) => setToast(msg), []);
    const navigate = (p) => setPage(p);

    const subtitle = page === 'dashboard'
        ? `Welcome back, ${teacher.name} 👋 — Sunday, 5 April 2026`
        : '';

    const renderPage = () => {
        switch (page) {
            case 'dashboard':
                return (
                    <TDashboardPage
                        teacher={teacher}
                        students={initialStudents}
                        classes={initialClasses}
                        onNavigate={navigate}
                        showToast={showToast}
                    />
                );
            case 'result':
                return <TResultPage showToast={showToast} />;
            case 'attendance':
                return <TAttendancePage showToast={showToast} />;
            case 'groups':
                return <TGroupsPage showToast={showToast} />;
            case 'messages':
                return <TMessagesPage showToast={showToast} />;
            case 'leaves':
                return <TLeavePage showToast={showToast} />;
            case 'subjects':
                return <TSubjectsPage showToast={showToast} />;
            case 'profile':
                return (
                    <TProfilePage
                        teacher={teacher}
                        onUpdateTeacher={(updated) => {
                            setTeacher(updated);
                            if (updated.photo) localStorage.setItem('teacherPhoto', updated.photo);
                        }}
                        showToast={showToast}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0d1117] text-[#e6edf3] text-[13px]"
            style={{ fontFamily: 'Inter, sans-serif' }}>

            <TeacherSidebar
                activePage={page}
                onNavigate={navigate}
                onLogout={() => {
                    if (window.confirm('Are you sure you want to logout?'))
                        showToast('👋 Logged out!');
                }}
                teacher={teacher}
            />

            <div className="ml-64 flex-1 flex flex-col min-h-screen">
                <TeacherHeader
                    title={PAGE_TITLES[page] || page}
                    subtitle={subtitle}
                    teacher={teacher}
                    onRefresh={() => showToast('🔄 Refreshed!')}
                    onProfileClick={() => navigate('profile')}
                />

                <div className="p-5 flex-1">
                    {renderPage()}
                </div>
            </div>

            <Toast message={toast} onHide={() => setToast('')} />
        </div>
    );
}