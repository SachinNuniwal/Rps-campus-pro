import { useState, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import AnalyticsPage from './AnalyticsPage';
import Topbar from '../components/Header';
import Toast from '../components/Toast';
import { Modal, ModalFooter, FormGroup, Input, Btn } from '../components/UI';

import DashboardPage from './DashboardPage';
import StudentsPage from './StudentsPage';
import TeachersPage from './TeachersPage';
import { LeavesPage, NoticesPage, EventsPage, ClassesPage } from './OtherPages';
import { MessagesPage, SettingsPage } from './CommsPages';
import { FeePage, TimetablePage, AttendancePage } from './AcademicPages';

import {
    students as initialStudents,
    initialTeachers,
    initialClasses,
    initialEvents,
    initialPendingLeaves,
    initialLeaveHistory,
    initialNotices,
    initialNotifications,
    initialConversations,
} from '../data/data';

const PAGE_TITLES = {
    dashboard: 'Admin Dashboard', analytics: 'Analytics', events: 'Events & Calendar',
    students: 'Students', teachers: 'Teachers', classes: 'Classes & Groups',
    results: 'Results Overview', attendance: 'Attendance Reports', fee: 'Fee Management',
    timetable: 'Timetable', messages: 'Messages', leaves: 'Leave Approvals',
    notices: 'Notices', settings: 'Settings',
};

export default function AdminDashboard() {
    const [page, setPage] = useState('dashboard');
    const [toast, setToast] = useState('');

    // State
    const [teachers, setTeachers] = useState(initialTeachers);
    const [classes, setClasses] = useState(initialClasses);
    const [events, setEvents] = useState(initialEvents);
    const [pendingLeaves, setPendingLeaves] = useState(initialPendingLeaves);
    const [leaveHistory, setLeaveHistory] = useState(initialLeaveHistory);
    const [notices, setNotices] = useState(initialNotices);
    const [notifications, setNotifications] = useState(initialNotifications);
    const [conversations, setConversations] = useState(initialConversations);
    const [profile, setProfile] = useState({ name: 'Prof. R.K. Sharma', desig: 'Head of Department — CSE', email: 'rksharma@college.edu', phone: '+91 98760 00001' });

    // Modals
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showNotifModal, setShowNotifModal] = useState(false);
    const [editProfile, setEditProfile] = useState({ ...profile });

    const showToast = useCallback((msg) => setToast(msg), []);
    const navigate = (p) => setPage(p);

    // Leave actions
    const approveLeave = (id) => {
        const leave = pendingLeaves.find(l => l.id === id);
        if (!leave) return;
        setPendingLeaves(prev => prev.filter(l => l.id !== id));
        setLeaveHistory(prev => [{ ...leave, id: Date.now(), status: 'Approved', approvedBy: profile.name }, ...prev]);
        showToast(`✅ Leave approved for ${leave.teacher}`);
    };

    const rejectLeave = (id) => {
        const leave = pendingLeaves.find(l => l.id === id);
        if (!leave) return;
        setPendingLeaves(prev => prev.filter(l => l.id !== id));
        setLeaveHistory(prev => [{ ...leave, id: Date.now(), status: 'Rejected', approvedBy: profile.name }, ...prev]);
        showToast(`❌ Leave rejected for ${leave.teacher}`);
    };

    // Teacher actions
    const addTeacher = (t) => setTeachers(prev => [...prev, t]);
    const removeTeacher = (id) => setTeachers(prev => prev.filter(t => t.id !== id));

    // Class actions
    const createClass = (c) => setClasses(prev => [...prev, c]);
    const deleteClass = (name) => setClasses(prev => prev.filter(c => c.name !== name));

    // Event actions
    const addEvent = (e) => setEvents(prev => [e, ...prev]);
    const deleteEvent = (id) => setEvents(prev => prev.filter(e => e.id !== id));

    // Notice actions
    const postNotice = (n) => setNotices(prev => [{ ...n, id: Date.now() }, ...prev]);
    const deleteNotice = (id) => setNotices(prev => prev.filter(n => n.id !== id));

    // Message actions
    const sendMsg = (convIdx, text) => {
        setConversations(prev => {
            const next = [...prev];
            next[convIdx] = {
                ...next[convIdx],
                msgs: [...next[convIdx].msgs, { sent: true, text, time: 'Just now' }],
                last: text,
            };
            return next;
        });
    };

    const newMsg = (recipient, body) => {
        const name = recipient.split(' (')[0];
        const role = recipient.includes('Group') ? 'Group' : recipient.includes('Teacher') ? 'Teacher' : 'Student';
        setConversations(prev => [{ id: Date.now(), name, role, last: body.substring(0, 40), time: 'Just now', msgs: [{ sent: true, text: body, time: 'Just now' }] }, ...prev]);
    };

    // Profile save
    const saveProfile = () => {
        setProfile({ ...editProfile });
        setShowProfileModal(false);
        showToast('✅ Profile updated successfully!');
    };

    // Notifications
    const unread = notifications.filter(n => !n.read).length;
    const clearNotifs = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        showToast('✅ All notifications cleared');
        setShowNotifModal(false);
    };

    const renderPage = () => {
        switch (page) {
            case 'dashboard':
                return <DashboardPage students={initialStudents} pendingLeaves={pendingLeaves} events={events} onApproveLeave={approveLeave} onRejectLeave={rejectLeave} onNavigate={navigate} />;
            case 'students':
                return <StudentsPage students={initialStudents} onViewStudent={(id) => showToast(`👁 Viewing student ${id}`)} showToast={showToast} />;
            case 'teachers':
                return <TeachersPage teachers={teachers} onViewTeacher={(id) => showToast(`👁 Viewing teacher ${id}`)} onAddTeacher={addTeacher} onRemoveTeacher={removeTeacher} showToast={showToast} />;
            case 'classes':
                return <ClassesPage classes={classes} onCreateClass={createClass} onDeleteClass={deleteClass} onNavigate={navigate} showToast={showToast} />;
            case 'events':
                return <EventsPage events={events} onAdd={addEvent} onDelete={deleteEvent} showToast={showToast} />;
            case 'leaves':
                return <LeavesPage pendingLeaves={pendingLeaves} leaveHistory={leaveHistory} onApprove={approveLeave} onReject={rejectLeave} showToast={showToast} />;
            case 'notices':
                return <NoticesPage notices={notices} onPost={postNotice} onDelete={deleteNotice} showToast={showToast} />;
            case 'messages':
                return <MessagesPage conversations={conversations} onSend={sendMsg} onNewMsg={newMsg} showToast={showToast} />;
            case 'fee':
                return <FeePage students={initialStudents} onViewStudent={(id) => showToast(`📋 Viewing fee for ${id}`)} showToast={showToast} />;
            case 'timetable':
                return <TimetablePage showToast={showToast} />;
            case 'attendance':
                return <AttendancePage students={initialStudents} classes={classes} showToast={showToast} />;
            case 'settings':
                return <SettingsPage profile={profile} onSave={(p) => setProfile(prev => ({ ...prev, ...p }))} showToast={showToast} />;
            case 'analytics':
                return <AnalyticsPage students={initialStudents} teachers={teachers} classes={classes} />;
            case 'results':
                return (
                    <div className="text-center py-20 text-[#8b949e]">
                        <div className="text-5xl mb-4">📋</div>
                        <div className="text-xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Results Overview</div>
                        <div className="text-[12px] mt-2">Connect to backend API to load result records</div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0d1117] text-[#e6edf3] text-[13px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <Sidebar
                activePage={page}
                onNavigate={navigate}
                onLogout={() => { if (window.confirm('Are you sure you want to logout?')) showToast('👋 Logged out!'); }}
                profile={profile}
                pendingLeavesCount={pendingLeaves.length}
                onProfileClick={() => { setEditProfile({ ...profile }); setShowProfileModal(true); }}
            />

            <div className="ml-60 flex-1 flex flex-col min-h-screen">
                <Topbar
                    title={PAGE_TITLES[page] || page}
                    unreadCount={unread}
                    subtitle={page === 'dashboard' ? `Welcome back, ${profile.name} 👋 — Thursday, 2 April 2026` : ''}
                    profile={profile}
                    notifications={notifications}
                    onNotifClick={() => setShowNotifModal(true)}
                    onMsgClick={() => navigate('messages')}
                    onProfileClick={() => { setEditProfile({ ...profile }); setShowProfileModal(true); }}
                    onRefresh={() => { showToast('🔄 Dashboard refreshed!'); }}
                />

                <div className="p-5 flex-1">
                    {renderPage()}
                </div>
            </div>

            {/* PROFILE MODAL */}
            <Modal open={showProfileModal} onClose={() => setShowProfileModal(false)} title="👤 Edit Profile">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 cursor-pointer border-2 border-[#30363d] hover:border-cyan-400 transition-all overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #f0a500, #ff7b29)' }}
                    onClick={() => document.getElementById('photoInput').click()}>
                    {profile.photo
                        ? <img src={profile.photo} alt="profile" className="w-full h-full object-cover rounded-full" />
                        : '🧑‍💼'
                    }
                </div>
                <input
                    id="photoInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                            const base64 = ev.target.result;
                            localStorage.setItem('adminPhoto', base64);
                            setProfile(p => ({ ...p, photo: base64 }));
                            setEditProfile(p => ({ ...p, photo: base64 }));
                        };
                        reader.readAsDataURL(file);
                    }}
                />
                <FormGroup label="Full Name">
                    <Input value={editProfile.name} onChange={e => setEditProfile(p => ({ ...p, name: e.target.value }))} />
                </FormGroup>
                <FormGroup label="Designation">
                    <Input value={editProfile.desig} onChange={e => setEditProfile(p => ({ ...p, desig: e.target.value }))} />
                </FormGroup>
                <FormGroup label="Email">
                    <Input type="email" value={editProfile.email} onChange={e => setEditProfile(p => ({ ...p, email: e.target.value }))} />
                </FormGroup>
                <FormGroup label="Phone">
                    <Input value={editProfile.phone} onChange={e => setEditProfile(p => ({ ...p, phone: e.target.value }))} />
                </FormGroup>
                <FormGroup label="Access Level">
                    <Input value="Level 5 — Full Admin" readOnly />
                </FormGroup>
                <ModalFooter>
                    <Btn variant="outline" onClick={() => setShowProfileModal(false)}>Cancel</Btn>
                    <Btn variant="primary" onClick={saveProfile}>💾 Save Profile</Btn>
                </ModalFooter>
            </Modal>

            {/* NOTIFICATIONS MODAL */}
            <Modal open={showNotifModal} onClose={() => setShowNotifModal(false)} title="🔔 Notifications">
                <div className="space-y-2">
                    {notifications.map(n => (
                        <div key={n.id} className={`flex gap-2.5 items-start p-2.5 rounded-lg border ${n.read ? 'border-transparent' : 'bg-cyan-400/5 border-cyan-400/10'}`}>
                            <div className="flex-1">
                                <div className="text-[13px]">{n.text}</div>
                                <div className="text-[10px] text-[#484f58] mt-0.5">{n.time}</div>
                            </div>
                            {!n.read && (
                                <Btn variant="outline" size="xs" onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}>✓</Btn>
                            )}
                        </div>
                    ))}
                </div>
                <ModalFooter>
                    <Btn variant="outline" onClick={() => setShowNotifModal(false)}>Close</Btn>
                    <Btn variant="primary" onClick={clearNotifs}>✅ Clear All</Btn>
                </ModalFooter>
            </Modal>

            <Toast message={toast} onHide={() => setToast('')} />
        </div>
    );
}