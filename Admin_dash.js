
// ===== DATA =====
const students = [
  { id: '2201001', name: 'Aarav Singh', class: 'CSE-3A', cgpa: 8.9, att: 92, fee: { total: 80000, paid: 80000 }, gender: 'M', course: 'B.Tech', duration: 4 },
  { id: '2201002', name: 'Priya Mehta', class: 'CSE-3A', cgpa: 7.8, att: 85, fee: { total: 80000, paid: 60000 }, gender: 'F', course: 'B.Tech', duration: 4 },
  { id: '2201003', name: 'Rahul Sharma', class: 'CSE-3A', cgpa: 9.1, att: 95, fee: { total: 80000, paid: 80000 }, gender: 'M', course: 'B.Tech', duration: 4 },
  { id: '2201004', name: 'Sneha Gupta', class: 'CSE-3B', cgpa: 7.2, att: 78, fee: { total: 80000, paid: 40000 }, gender: 'F', course: 'B.Tech', duration: 4 },
  { id: '2201005', name: 'Arjun Rao', class: 'CSE-3B', cgpa: 5.8, att: 62, fee: { total: 80000, paid: 20000 }, gender: 'M', course: 'B.Tech', duration: 4 },
  { id: '2201006', name: 'Kavya Nair', class: 'CSE-3A', cgpa: 8.4, att: 68, fee: { total: 80000, paid: 80000 }, gender: 'F', course: 'B.Tech', duration: 4 },
  { id: '2201007', name: 'Vikram Tiwari', class: 'CSE-2A', cgpa: 7.6, att: 80, fee: { total: 75000, paid: 75000 }, gender: 'M', course: 'B.Tech', duration: 4 },
  { id: '2201008', name: 'Ananya Sharma', class: 'MCA-1', cgpa: 8.8, att: 90, fee: { total: 90000, paid: 90000 }, gender: 'F', course: 'MCA', duration: 3 },
  { id: '2201009', name: 'Rohan Verma', class: 'CSE-2A', cgpa: 6.5, att: 73, fee: { total: 75000, paid: 50000 }, gender: 'M', course: 'B.Tech', duration: 4 },
  { id: '2201010', name: 'Mohit Batra', class: 'CSE-3B', cgpa: 7.0, att: 73, fee: { total: 80000, paid: 80000 }, gender: 'M', course: 'B.Tech', duration: 4 },
];

const teachers = [
  { id: 'TCH-4421', name: 'Dr. Priya Verma', dept: 'CSE', subjects: ['DSA', 'OS'], classes: ['CSE-3A', 'CSE-3B'], leavesUsed: 3, status: 'Active', exp: '12 yrs', email: 'priya@college.edu' },
  { id: 'TCH-3812', name: 'Mr. Arun Kumar', dept: 'CSE', subjects: ['DBMS', 'CN'], classes: ['CSE-2A', 'CSE-3A'], leavesUsed: 1, status: 'Active', exp: '8 yrs', email: 'arun@college.edu' },
  { id: 'TCH-4102', name: 'Ms. Neha Singh', dept: 'CSE', subjects: ['SE', 'Python'], classes: ['MCA-1', 'CSE-2A'], leavesUsed: 5, status: 'Active', exp: '6 yrs', email: 'neha@college.edu' },
  { id: 'TCH-3560', name: 'Prof. R.K. Das', dept: 'Maths', subjects: ['Maths', 'Stats'], classes: ['CSE-2A', 'MCA-1'], leavesUsed: 2, status: 'Active', exp: '15 yrs', email: 'rkdas@college.edu' },
  { id: 'TCH-4890', name: 'Dr. Anita Joshi', dept: 'CSE', subjects: ['AI', 'ML'], classes: ['CSE-3B', 'MCA-1'], leavesUsed: 0, status: 'On Leave', exp: '10 yrs', email: 'anita@college.edu' },
];

let timetables = {
  'CSE-3A': [
    ['DSA\nDr.Priya', 'OS\nDr.Priya', 'DBMS\nMr.Arun', '—Break—', 'CN\nMr.Arun', 'SE\nMs.Neha'],
    ['OS\nDr.Priya', 'DSA Lab\nDr.Priya', 'DSA Lab\nDr.Priya', '—Break—', 'SE\nMs.Neha', 'DBMS\nMr.Arun'],
    ['CN\nMr.Arun', 'DBMS\nMr.Arun', 'DSA\nDr.Priya', '—Break—', 'OS\nDr.Priya', '—Free—'],
    ['SE\nMs.Neha', 'CN\nMr.Arun', 'OS\nDr.Priya', '—Break—', 'DSA\nDr.Priya', 'DBMS\nMr.Arun'],
    ['DBMS\nMr.Arun', 'SE\nMs.Neha', 'CN Lab\nMr.Arun', '—Break—', 'CN Lab\nMr.Arun', 'DSA\nDr.Priya'],
  ],
  'CSE-3B': [
    ['DBMS\nMr.Arun', 'AI\nDr.Anita', 'OS\nDr.Priya', '—Break—', 'DSA\nDr.Priya', 'SE\nMs.Neha'],
    ['AI\nDr.Anita', 'DBMS\nMr.Arun', 'SE\nMs.Neha', '—Break—', 'OS Lab\nDr.Priya', 'OS Lab\nDr.Priya'],
    ['OS\nDr.Priya', 'DSA\nDr.Priya', 'AI\nDr.Anita', '—Break—', 'DBMS\nMr.Arun', '—Free—'],
    ['SE\nMs.Neha', 'OS\nDr.Priya', 'DBMS\nMr.Arun', '—Break—', 'AI\nDr.Anita', 'DSA\nDr.Priya'],
    ['DSA\nDr.Priya', 'SE\nMs.Neha', 'DBMS Lab\nMr.Arun', '—Break—', 'DBMS Lab\nMr.Arun', 'AI\nDr.Anita'],
  ],
  'CSE-2A': [
    ['Maths\nProf.Das', 'Physics\nFaculty', 'DSA\nDr.Priya', '—Break—', 'OS\nDr.Priya', 'Python\nMs.Neha'],
    ['DSA\nDr.Priya', 'Maths\nProf.Das', 'Python\nMs.Neha', '—Break—', 'Physics\nFaculty', '—Free—'],
    ['Python\nMs.Neha', 'DSA\nDr.Priya', 'Maths\nProf.Das', '—Break—', 'OS\nDr.Priya', 'Physics\nFaculty'],
    ['OS\nDr.Priya', 'Python\nMs.Neha', 'DSA\nDr.Priya', '—Break—', 'Maths\nProf.Das', '—Free—'],
    ['Physics\nFaculty', 'OS\nDr.Priya', 'Python Lab\nMs.Neha', '—Break—', 'Python Lab\nMs.Neha', 'DSA\nDr.Priya'],
  ],
  'MCA-1': [
    ['Python\nMs.Neha', 'Stats\nProf.Das', 'DBMS\nMr.Arun', '—Break—', 'AI\nDr.Anita', 'SE\nMs.Neha'],
    ['DBMS\nMr.Arun', 'Python\nMs.Neha', 'AI\nDr.Anita', '—Break—', 'Stats\nProf.Das', '—Free—'],
    ['AI\nDr.Anita', 'DBMS\nMr.Arun', 'Stats\nProf.Das', '—Break—', 'Python\nMs.Neha', 'SE\nMs.Neha'],
    ['Stats\nProf.Das', 'SE\nMs.Neha', 'Python\nMs.Neha', '—Break—', 'DBMS\nMr.Arun', 'AI\nDr.Anita'],
    ['SE\nMs.Neha', 'AI\nDr.Anita', 'DBMS Lab\nMr.Arun', '—Break—', 'DBMS Lab\nMr.Arun', 'Python\nMs.Neha'],
  ],
};

let pendingLeaves = [
  { teacher: 'Mr. Arun Kumar', type: 'Medical', from: '5 Apr', to: '7 Apr', days: 3, reason: 'Fever & rest', status: 'Pending' },
  { teacher: 'Ms. Neha Singh', type: 'Personal', from: '10 Apr', to: '10 Apr', days: 1, reason: 'Family event', status: 'Pending' },
  { teacher: 'Prof. R.K. Das', type: 'Conference', from: '15 Apr', to: '17 Apr', days: 3, reason: 'IEEE Conference', status: 'Pending' },
  { teacher: 'Dr. Anita Joshi', type: 'Emergency', from: '3 Apr', to: '4 Apr', days: 2, reason: 'Family emergency', status: 'Pending' },
  { teacher: 'Dr. Priya Verma', type: 'Medical', from: '20 Apr', to: '21 Apr', days: 2, reason: 'Doctor appointment', status: 'Pending' },
];

let leaveHistory = [
  { teacher: 'Dr. Priya Verma', type: 'Medical', from: '15 Jan', to: '17 Jan', days: 3, status: 'Approved', approvedBy: 'Prof. R.K. Sharma' },
  { teacher: 'Mr. Arun Kumar', type: 'Personal', from: '5 Feb', to: '5 Feb', days: 1, status: 'Approved', approvedBy: 'Prof. R.K. Sharma' },
  { teacher: 'Ms. Neha Singh', type: 'Conference', from: '20 Mar', to: '22 Mar', days: 3, status: 'Approved', approvedBy: 'Prof. R.K. Sharma' },
  { teacher: 'Dr. Anita Joshi', type: 'Emergency', from: '28 Feb', to: '1 Mar', days: 2, status: 'Rejected', approvedBy: 'Prof. R.K. Sharma' },
];

let notices = [
  { title: 'Mid-Term Exam Schedule Released', content: 'Mid-term exams are scheduled from 20th April. Prepare accordingly.', date: '1 Apr 2026', target: 'All', priority: 'Important' },
  { title: 'Faculty Meeting — 5th April, 3PM', content: 'All faculty must attend the meeting in the conference room.', date: '31 Mar 2026', target: 'Teachers Group', priority: 'Urgent' },
  { title: 'Last date for fee submission: 15 April', content: 'Students must submit their fee by 15 April to avoid penalty.', date: '30 Mar 2026', target: 'Students Only', priority: 'Important' },
  { title: 'Holiday on 14th April — Dr. Ambedkar Jayanti', content: 'The college will remain closed on 14th April.', date: '28 Mar 2026', target: 'All', priority: 'Normal' },
];

let events = [
  { id: 1, title: 'Mid-Term Exam Starts', desc: 'CSE Mid-Term examinations begin', date: '2026-04-20', time: '09:00', category: 'Exam', audience: 'Students Only', deadline: '2026-04-20T08:00' },
  { id: 2, title: 'Faculty Meeting', desc: 'Monthly faculty coordination meeting', date: '2026-04-05', time: '15:00', category: 'Meeting', audience: 'Teachers Only', deadline: '2026-04-05T15:00' },
  { id: 3, title: 'IEEE Conference — Prof. Das', desc: 'Prof. R.K. Das attending IEEE conference', date: '2026-04-15', time: '08:00', category: 'Academic', audience: 'All', deadline: '2026-04-15T07:00' },
  { id: 4, title: 'Dr. Ambedkar Jayanti Holiday', desc: 'College closed for national holiday', date: '2026-04-14', time: '00:00', category: 'Holiday', audience: 'All', deadline: '2026-04-14T00:00' },
  { id: 5, title: 'Results Published — DSA', desc: 'DSA mid-term results published on portal', date: '2026-03-25', time: '12:00', category: 'Academic', audience: 'CSE-3A', deadline: '2026-03-26T12:00' },
];

let adminConvs = [
  { name: 'Dr. Priya Verma', role: 'Teacher', last: 'Noted, will submit by Friday', time: '10:30 AM', msgs: [{ sent: false, text: 'Please submit the mid-term marks by this week.', time: 'Yesterday' }, { sent: true, text: 'Noted, will submit by Friday', time: '10:30 AM' }] },
  { name: 'Dept. Principal', role: 'Admin', last: 'Meeting confirmed for 3PM', time: '9:00 AM', msgs: [{ sent: false, text: 'Faculty meeting today at 3PM, please confirm.', time: '9:00 AM' }, { sent: true, text: 'Meeting confirmed for 3PM', time: '9:15 AM' }] },
  { name: 'Teachers Group', role: 'Group', last: 'Happy to help!', time: 'Yesterday', msgs: [{ sent: false, text: 'Please check the updated timetable.', time: 'Yesterday' }, { sent: true, text: 'All noted, thank you.', time: 'Yesterday' }] },
  { name: 'CSE-3A Group', role: 'Group', last: 'Thank you Sir', time: '2 days ago', msgs: [{ sent: true, text: 'Mid-term exams start from 20th April. Be prepared!', time: '2 days ago' }, { sent: false, text: 'Thank you Sir', time: '2 days ago' }] },
  { name: 'Aarav Singh', role: 'Student', last: 'Thank you sir!', time: 'Yesterday', msgs: [{ sent: false, text: 'Thank you sir for the scholarship guidance!', time: 'Yesterday' }] },
];

let notifications = [
  { text: '🌿 Mr. Arun Kumar applied for Medical Leave (5–7 Apr)', time: '2 min ago', read: false },
  { text: '⚠️ Arjun Rao attendance dropped below 75%', time: '30 min ago', read: false },
  { text: '💰 Fee defaulter: Sneha Gupta — ₹40,000 pending', time: '1 hr ago', read: false },
  { text: '📋 DSA result uploaded by Dr. Priya Verma', time: '2 hr ago', read: true },
  { text: '🔔 3 new leave requests pending approval', time: '3 hr ago', read: true },
];

let selectedAudience = 'All';
let newClassSubjects = [];
let currentAdminConv = null;
let currentStudentId = null;
let currentTeacherId = null;
let studentChats = {};
let teacherChats = {};
let allStudents = [...students];
let allLeaveHistory = [...leaveHistory];

// ===== NAVIGATION =====
function navigate(page, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const p = document.getElementById('page-' + page);
  if (p) p.classList.add('active');
  if (el) el.classList.add('active');
  const titles = { dashboard: 'Admin Dashboard', analytics: 'Analytics', events: 'Events & Calendar', students: 'Students', teachers: 'Teachers', classes: 'Classes & Groups', results: 'Results Overview', attendance: 'Attendance Reports', fee: 'Fee Management', timetable: 'Timetable', messages: 'Messages', leaves: 'Leave Approvals', notices: 'Notices', settings: 'Settings', studentdetail: 'Student Profile', teacherdetail: 'Teacher Profile' };
  const subs = { dashboard: 'Welcome back, Prof. R.K. Sharma 👋 — Thursday, 2 April 2026' };
  document.getElementById('topbar-title').textContent = titles[page] || page;
  document.getElementById('topbar-sub').textContent = subs[page] || '';
  const inits = { dashboard: initDashboard, analytics: initAnalytics, events: initEvents, students: initStudents, teachers: initTeachers, classes: initClasses, results: initResults, attendance: initAttendance, fee: initFee, timetable: () => loadTimetable('CSE-3A'), messages: initMessages, leaves: initLeaves, notices: initNotices };
  if (inits[page]) setTimeout(inits[page], 50);
}

function setActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(n => {
    if (n.textContent.toLowerCase().includes(page.toLowerCase())) n.classList.add('active');
  });
}

// ===== PROFILE =====
function openProfileModal() { openModal('profileModal'); }
function saveProfile() {
  const name = document.getElementById('profileName').value.trim();
  const desig = document.getElementById('profileDesig').value.trim();
  document.getElementById('sidebarProfileName').textContent = name;
  document.getElementById('sidebarProfileSub').textContent = desig + '\nAdmin Access · Level 5';
  document.querySelector('.topbar-avatar').textContent = name.split(' ').map(x => x[0]).slice(0, 2).join('');
  closeModal('profileModal');
  showToast('✅ Profile updated successfully!');
}

// ===== REFRESH =====
function refreshDashboard() {
  showToast('🔄 Dashboard refreshed!');
  setTimeout(initDashboard, 200);
}

// ===== NOTIFICATIONS =====
function openNotifPanel() {
  const unread = notifications.filter(n => !n.read).length;
  const list = document.getElementById('notifList');
  list.innerHTML = notifications.map((n, i) => `
    <div style="display:flex;gap:10px;align-items:flex-start;padding:10px;border-radius:8px;background:${n.read ? 'transparent' : 'rgba(0,212,255,.05)'};border:1px solid ${n.read ? 'transparent' : 'rgba(0,212,255,.1)'};margin-bottom:8px;">
      <div style="flex:1;"><div style="font-size:13px;">${n.text}</div><div style="font-size:10px;color:var(--text-muted);margin-top:3px;">${n.time}</div></div>
      ${!n.read ? `<button class="btn btn-outline btn-xs" onclick="markNotifRead(${i})">✓</button>` : ''}
    </div>`).join('') || '<div style="text-align:center;color:var(--text-muted);padding:20px;">No notifications</div>';
  document.getElementById('notifDot').style.display = unread > 0 ? 'block' : 'none';
  openModal('notifModal');
}
function markNotifRead(i) { notifications[i].read = true; openNotifPanel(); }
function clearNotifications() { notifications.forEach(n => n.read = true); closeModal('notifModal'); document.getElementById('notifDot').style.display = 'none'; showToast('✅ All notifications cleared'); }

// ===== TABS =====
function switchTab2(group, name, el) {
  const detailPage = group === 'sd' ? 'studentdetail' : 'teacherdetail';
  const page = document.getElementById('page-' + detailPage);
  if (!page) return;
  page.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  page.querySelectorAll('.tab-pane').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const pane = document.getElementById(group + '-' + name);
  if (pane) pane.classList.add('active');
}

// ===== DASHBOARD =====
function initDashboard() {
  // Pending leaves widget
  const pl = document.getElementById('pendingLeavesList');
  if (pl) pl.innerHTML = pendingLeaves.slice(0, 3).map(l => `
    <div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);">
      <div style="width:32px;height:32px;border-radius:8px;background:rgba(255,123,41,.15);display:flex;align-items:center;justify-content:center;font-size:15px;">🌿</div>
      <div style="flex:1;"><div style="font-size:13px;font-weight:600;">${l.teacher}</div><div style="font-size:11px;color:var(--text-secondary);">${l.type} · ${l.from}–${l.to}</div></div>
      <div style="display:flex;gap:5px;"><button class="btn btn-success btn-xs" onclick="approveLeave('${l.teacher}')">✓</button><button class="btn btn-danger btn-xs" onclick="rejectLeave('${l.teacher}')">✗</button></div>
    </div>`).join('');

  // Upcoming events on dashboard
  const de = document.getElementById('dashEventsList');
  const now = new Date();
  const upcomingEvts = events.filter(e => {
    const ed = new Date(e.date + 'T' + e.time);
    return ed >= now;
  }).slice(0, 3);
  if (de) de.innerHTML = upcomingEvts.length ? upcomingEvts.map(e => `
    <div style="padding:8px 0;border-bottom:1px solid var(--border);">
      <div style="font-size:12px;font-weight:600;">${e.title}</div>
      <div style="font-size:11px;color:var(--text-secondary);">${e.date} · ${e.time} · <span class="badge badge-cyan">${e.category}</span></div>
    </div>`).join('') : '<div style="color:var(--text-muted);font-size:12px;padding:10px 0;">No upcoming events</div>';

  // Activity log
  const al = document.getElementById('activityLog');
  if (al) al.innerHTML = [
    { a: 'Result uploaded: DSA Mid-Term', p: 'Dr. Priya Verma', t: 'Teacher', time: '10 min ago' },
    { a: 'Attendance marked: CSE-3B', p: 'Mr. Arun Kumar', t: 'Teacher', time: '30 min ago' },
    { a: 'Leave applied: Medical', p: 'Dr. Anita Joshi', t: 'Teacher', time: '1 hr ago' },
    { a: 'Fee paid: ₹40,000', p: 'Arjun Rao (2201005)', t: 'Student', time: '2 hr ago' },
    { a: 'New notice sent to CSE-3A', p: 'Ms. Neha Singh', t: 'Teacher', time: '3 hr ago' },
  ].map(r => `<tr><td>${r.a}</td><td>${r.p}</td><td><span class="badge ${r.t === 'Teacher' ? 'badge-gold' : 'badge-cyan'}">${r.t}</span></td><td style="color:var(--text-muted)">${r.time}</td><td><button class="btn btn-outline btn-xs" onclick="showToast('Details viewed')">View</button></td></tr>`).join('');

  // Charts
  const dc = document.getElementById('deptCgpaChart');
  if (dc && !dc._chart) {
    dc._chart = new Chart(dc.getContext('2d'), {
      type: 'line', data: {
        labels: ['Sem1', 'Sem2', 'Sem3', 'Sem4', 'Sem5'], datasets: [
          { label: 'CSE-3A', data: [7.6, 7.9, 8.2, 8.5, 8.4], borderColor: '#00d4ff', backgroundColor: 'rgba(0,212,255,.08)', tension: .4, fill: true, pointRadius: 4 },
          { label: 'CSE-3B', data: [7.2, 7.5, 7.8, 8.1, 7.9], borderColor: '#f0a500', backgroundColor: 'rgba(240,165,0,.08)', tension: .4, fill: true, pointRadius: 4 },
          { label: 'MCA-1', data: [7.8, 8.0, 8.3, 8.6, 8.5], borderColor: '#a855f7', backgroundColor: 'rgba(168,85,247,.08)', tension: .4, fill: true, pointRadius: 4 },
        ]
      }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#8b949e', font: { size: 11 } } } }, scales: { y: { min: 7, max: 10, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } }, x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } } } }
    });
  }
  const ac = document.getElementById('deptAttChart');
  if (ac && !ac._chart) {
    ac._chart = new Chart(ac.getContext('2d'), { type: 'doughnut', data: { labels: ['Present', 'Absent', 'Medical'], datasets: [{ data: [85, 11, 4], backgroundColor: ['rgba(0,212,255,.7)', 'rgba(255,71,87,.7)', 'rgba(255,123,41,.7)'], borderColor: ['#00d4ff', '#ff4757', '#ff7b29'], borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#8b949e' } } } } });
  }
}


// ===== EVENTS =====
function initEvents() {
  const now = new Date();
  let upcoming = [], past = [], todayEvts = [];
  events.forEach(e => {
    const ed = new Date(e.date + 'T' + e.time);
    const isToday = e.date === now.toISOString().split('T')[0];
    if (isToday) todayEvts.push(e);
    else if (ed > now) upcoming.push(e);
    else past.push(e);
  });
  document.getElementById('eventStatUpcoming').textContent = upcoming.length;
  document.getElementById('eventStatToday').textContent = todayEvts.length;
  document.getElementById('eventStatExpired').textContent = past.length;
  document.getElementById('eventsNavBadge').textContent = upcoming.length + todayEvts.length;

  const ul = document.getElementById('eventsUpcomingList');
  const combined = [...todayEvts.map(e => ({ ...e, _type: 'today' })), ...upcoming.map(e => ({ ...e, _type: 'upcoming' }))];
  ul.innerHTML = combined.length ? combined.map(e => `
    <div class="event-card ${e._type}">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;">
        <div>
          <div class="event-title">${e.title}</div>
          <div class="event-meta">📅 ${e.date} · 🕐 ${e.time} · <span class="badge badge-cyan">${e.category}</span> · 👥 ${e.audience}</div>
          <div class="event-meta" style="margin-top:4px;">${e.desc}</div>
          ${e.deadline ? `<div class="event-deadline">⏰ Access closes: ${new Date(e.deadline).toLocaleString()}</div>` : ''}
        </div>
        <button class="btn btn-danger btn-xs" onclick="deleteEvent(${e.id})">🗑</button>
      </div>
    </div>`).join('') : '<div style="color:var(--text-muted);padding:20px;text-align:center;">No upcoming events</div>';

  const pl = document.getElementById('eventsPastList');
  pl.innerHTML = past.length ? past.map(e => `
    <div class="event-card past">
      <div class="event-title" style="color:var(--text-secondary);">${e.title} <span class="badge badge-orange" style="font-size:9px;">PAST</span></div>
      <div class="event-meta">📅 ${e.date} · ${e.category} · ${e.audience}</div>
    </div>`).join('') : '<div style="color:var(--text-muted);padding:20px;text-align:center;">No past events</div>';
}

function addEvent() {
  const title = document.getElementById('evtTitle').value.trim();
  const desc = document.getElementById('evtDesc').value.trim();
  const date = document.getElementById('evtDate').value;
  const time = document.getElementById('evtTime').value;
  const deadline = document.getElementById('evtDeadline').value;
  const category = document.getElementById('evtCategory').value;
  const audience = document.getElementById('evtAudience').value;
  if (!title || !date) { showToast('⚠️ Title and Date are required!'); return; }
  events.push({ id: Date.now(), title, desc, date, time, category, audience, deadline });
  closeModal('addEventModal');
  document.getElementById('evtTitle').value = '';
  document.getElementById('evtDesc').value = '';
  initEvents();
  showToast('✅ Event added successfully!');
}

function deleteEvent(id) {
  const idx = events.findIndex(e => e.id === id);
  if (idx > -1) events.splice(idx, 1);
  initEvents();
  showToast('🗑 Event deleted');
}

// ===== ANALYTICS =====
function initAnalytics() {
  const c1 = document.getElementById('classCgpaChart');
  if (c1 && !c1._chart) c1._chart = new Chart(c1.getContext('2d'), { type: 'bar', data: { labels: ['CSE-3A', 'CSE-3B', 'CSE-2A', 'MCA-1'], datasets: [{ label: 'Avg CGPA', data: [8.4, 7.9, 7.6, 8.5], backgroundColor: ['rgba(0,212,255,.4)', 'rgba(240,165,0,.4)', 'rgba(168,85,247,.4)', 'rgba(57,211,83,.4)'], borderColor: ['#00d4ff', '#f0a500', '#a855f7', '#39d353'], borderWidth: 2, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 7, max: 10, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } }, x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } } } } });
  const c2 = document.getElementById('classAttChart');
  if (c2 && !c2._chart) c2._chart = new Chart(c2.getContext('2d'), { type: 'bar', data: { labels: ['CSE-3A', 'CSE-3B', 'CSE-2A', 'MCA-1'], datasets: [{ label: 'Attendance %', data: [91, 81, 84, 88], backgroundColor: 'rgba(57,211,83,.3)', borderColor: '#39d353', borderWidth: 2, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 60, max: 100, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } }, x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } } } } });
  const c3 = document.getElementById('subjectPassChart');
  if (c3 && !c3._chart) c3._chart = new Chart(c3.getContext('2d'), { type: 'radar', data: { labels: ['DSA', 'OS', 'DBMS', 'CN', 'SE', 'AI'], datasets: [{ label: 'Pass Rate %', data: [92, 88, 95, 85, 91, 78], borderColor: '#f0a500', backgroundColor: 'rgba(240,165,0,.15)', pointBackgroundColor: '#f0a500', pointRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#8b949e' } } }, scales: { r: { grid: { color: 'rgba(255,255,255,.07)' }, ticks: { color: '#8b949e', backdropColor: 'transparent' }, pointLabels: { color: '#e6edf3' } } } } });
  const ts = document.getElementById('topStudentsBody');
  if (ts) ts.innerHTML = [...students].sort((a, b) => b.cgpa - a.cgpa).slice(0, 5).map((s, i) => `<tr><td><span style="color:var(--accent-gold);font-weight:700;">#${i + 1}</span></td><td><a href="#" onclick="openStudentDetail('${s.id}')" style="color:var(--accent-cyan);text-decoration:none;">${s.name}</a></td><td>${s.class}</td><td><span class="badge badge-green">${s.cgpa}</span></td><td>${s.att}%</td></tr>`).join('');
  const tt = document.getElementById('topTeachersBody');
  if (tt) tt.innerHTML = teachers.slice(0, 5).map((t, i) => `<tr><td><span style="color:var(--accent-gold);font-weight:700;">#${i + 1}</span></td><td><a href="#" onclick="openTeacherDetail('${t.id}')" style="color:var(--accent-cyan);text-decoration:none;">${t.name}</a></td><td>${t.dept}</td><td><span class="badge badge-cyan">${(8.2 + Math.random() * .6).toFixed(1)}</span></td></tr>`).join('');
}

// ===== STUDENTS =====
function initStudents() { renderStudentTable(allStudents); }
function renderStudentTable(data) {
  const tb = document.getElementById('studentTableBody');
  if (!tb) return;
  tb.innerHTML = data.map(s => {
    const bal = s.fee.total - s.fee.paid;
    const feeStatus = bal === 0 ? '<span class="badge badge-green">Paid</span>' : bal > s.fee.total / 2 ? '<span class="badge badge-red">Defaulter</span>' : '<span class="badge badge-orange">Partial</span>';
    const attBadge = s.att >= 80 ? 'badge-green' : s.att >= 75 ? 'badge-orange' : 'badge-red';
    return `<tr>
      <td style="color:var(--text-muted)">${s.id}</td>
      <td><a href="#" onclick="openStudentDetail('${s.id}')" style="color:var(--accent-cyan);text-decoration:none;font-weight:600;">${s.name}</a></td>
      <td><span class="badge badge-purple">${s.class}</span></td>
      <td><span class="badge ${s.cgpa >= 8.5 ? 'badge-green' : s.cgpa >= 7 ? 'badge-cyan' : 'badge-orange'}">${s.cgpa}</span></td>
      <td><span class="badge ${attBadge}">${s.att}%</span></td>
      <td>${feeStatus}</td>
      <td style="display:flex;gap:5px;flex-wrap:wrap;">
        <button class="btn btn-outline btn-xs" onclick="openStudentDetail('${s.id}')">👁 View</button>
        <button class="btn btn-outline btn-xs" onclick="msgStudent('${s.id}')">💬 Msg</button>
      </td>
    </tr>`;
  }).join('');
}
function filterStudents(cls) { allStudents = cls ? students.filter(s => s.class === cls) : [...students]; renderStudentTable(allStudents); }
function searchStudents(q) { renderStudentTable(students.filter(s => s.name.toLowerCase().includes(q.toLowerCase()) || s.id.includes(q) || s.class.toLowerCase().includes(q.toLowerCase()))); }

function openStudentDetail(id) {
  currentStudentId = id;
  const s = students.find(x => x.id === id);
  if (!s) return;
  navigate('studentdetail', null);
  const hdr = document.getElementById('studentDetailHeader');
  hdr.innerHTML = `
    <div class="detail-avatar" style="background:linear-gradient(135deg,#1a3a5c,#0d2a4c)">${s.gender === 'F' ? '👩‍🎓' : '👨‍🎓'}</div>
    <div>
      <div class="detail-name">${s.name}</div>
      <div class="detail-meta">Roll No: ${s.id} &nbsp;·&nbsp; Class: ${s.class} &nbsp;·&nbsp; Batch: 2022–26<br>
      CGPA: <span style="color:var(--accent-cyan)">${s.cgpa}</span> &nbsp;·&nbsp;
      Attendance: <span style="color:${s.att >= 75 ? 'var(--accent-green)' : 'var(--accent-red)'}">${s.att}%</span> &nbsp;·&nbsp;
      Fee: <span style="color:${s.fee.paid === s.fee.total ? 'var(--accent-green)' : 'var(--accent-orange)'}">₹${s.fee.paid.toLocaleString()} / ₹${s.fee.total.toLocaleString()}</span></div>
    </div>
    <div style="margin-left:auto;display:flex;gap:8px;flex-wrap:wrap;">
      <button class="btn btn-cyan btn-sm" onclick="msgStudent('${s.id}')">💬 Message</button>
      <button class="btn btn-outline btn-sm" onclick="exportData()">⬇️ Export</button>
    </div>`;

  // Overview tab
  document.getElementById('studentOverviewContent').innerHTML = `
    <div class="mini-stats">
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-cyan)">${s.cgpa}</div><div class="mini-stat-lbl">Current CGPA</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:${s.att >= 75 ? 'var(--accent-green)' : 'var(--accent-red)'}">${s.att}%</div><div class="mini-stat-lbl">Attendance</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-gold)">${Math.round(s.fee.paid / s.fee.total * 100)}%</div><div class="mini-stat-lbl">Fee Paid</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-purple)">5</div><div class="mini-stat-lbl">Semester</div></div>
    </div>
    <div class="grid-2">
      <div class="card"><div class="card-title">📋 Personal Details</div>
        <table><tbody>
          <tr><td style="color:var(--text-muted);width:140px;">Roll Number</td><td>${s.id}</td></tr>
          <tr><td style="color:var(--text-muted)">Class</td><td>${s.class}</td></tr>
          <tr><td style="color:var(--text-muted)">Batch</td><td>2022–26</td></tr>
          <tr><td style="color:var(--text-muted)">Programme</td><td>${s.course}</td></tr>
          <tr><td style="color:var(--text-muted)">Duration</td><td>${s.duration} Years</td></tr>
          <tr><td style="color:var(--text-muted)">Phone</td><td>+91 9876XXXXXX</td></tr>
          <tr><td style="color:var(--text-muted)">Email</td><td>${s.id}@college.edu</td></tr>
          <tr><td style="color:var(--text-muted)">Address</td><td>Delhi, India</td></tr>
        </tbody></table>
      </div>
      <div class="card"><div class="card-title">📊 Academic Snapshot</div>
        ${['DSA', 'OS', 'DBMS', 'CN', 'SE'].map((sub) => { const v = 60 + Math.floor(Math.random() * 35); return `<div style="margin-bottom:10px;"><div style="display:flex;justify-content:space-between;font-size:13px;"><span>${sub}</span><span style="color:var(--accent-cyan)">${v}/100</span></div><div class="prog-bar"><div class="prog-fill" style="width:${v}%;background:${v >= 75 ? 'var(--accent-green)' : v >= 50 ? 'var(--accent-cyan)' : 'var(--accent-red)'}"></div></div></div>`; }).join('')}
      </div>
    </div>`;

  // Results tab
  document.getElementById('studentResultContent').innerHTML = `
    <div class="card"><div class="card-title">📊 Semester-wise Results</div>
    <div class="table-wrap"><table>
      <thead><tr><th>Semester</th><th>DSA</th><th>OS</th><th>DBMS</th><th>CN</th><th>SE</th><th>SGPA</th><th>Grade</th></tr></thead>
      <tbody>${[1, 2, 3, 4, 5].map(sem => { const sgpa = (7 + Math.random() * 2.5).toFixed(1); return `<tr><td>Sem ${sem}</td>${[1, 2, 3, 4, 5].map(() => `<td>${55 + Math.floor(Math.random() * 40)}</td>`).join('')}<td><span class="badge badge-cyan">${sgpa}</span></td><td>${sgpa >= 9 ? 'O' : sgpa >= 8 ? 'A+' : sgpa >= 7 ? 'A' : 'B+'}</td></tr>`; }).join('')}
      </tbody>
    </table></div>
    <div class="card-title" style="margin-top:16px;">📈 CGPA Trend</div>
    <div style="height:150px;"><canvas id="studentCgpaChart"></canvas></div>
    </div>`;
  setTimeout(() => {
    const sc = document.getElementById('studentCgpaChart');
    if (sc && !sc._chart) { sc._chart = new Chart(sc.getContext('2d'), { type: 'line', data: { labels: ['Sem1', 'Sem2', 'Sem3', 'Sem4', 'Sem5'], datasets: [{ label: 'SGPA', data: [7.2, 7.6, 7.9, 8.3, s.cgpa], borderColor: '#00d4ff', backgroundColor: 'rgba(0,212,255,.1)', tension: .4, fill: true, pointRadius: 4, pointBackgroundColor: '#00d4ff' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 6, max: 10, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } }, x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } } } } }); }
  }, 100);

  // Attendance tab
  const studentSubjects = getClassSubjects(s.class);
  document.getElementById('studentAttContent').innerHTML = `
    <div class="mini-stats">
      <div class="mini-stat"><div class="mini-stat-val" style="color:${s.att >= 75 ? 'var(--accent-green)' : 'var(--accent-red)'}">${s.att}%</div><div class="mini-stat-lbl">Overall Att.</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-cyan)">${Math.round(s.att * .95)}%</div><div class="mini-stat-lbl">Class Att.</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-purple)">${Math.round(s.att * .85)}%</div><div class="mini-stat-lbl">Lab Att.</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:${s.att >= 75 ? 'var(--accent-green)' : 'var(--accent-red)'}">${s.att >= 75 ? 'OK' : '⚠️ Low'}</div><div class="mini-stat-lbl">Status</div></div>
    </div>
    <div class="card"><div class="card-title">📅 Subject-wise Attendance</div>
    <div class="table-wrap"><table>
      <thead><tr><th>Subject</th><th>Total Classes</th><th>Attended</th><th>Attendance %</th><th>Status</th></tr></thead>
      <tbody>${studentSubjects.map(sub => { const tot = 40; const att = Math.min(tot, Math.max(0, Math.floor(tot * s.att / 100 + Math.random() * 4 - 2))); const pct = Math.round(att / tot * 100); return `<tr><td>${sub}</td><td>${tot}</td><td>${att}</td><td>${pct}%</td><td><span class="badge ${pct >= 75 ? 'badge-green' : 'badge-red'}">${pct >= 75 ? 'OK' : 'Low'}</span></td></tr>`; }).join('')}
      </tbody>
    </table></div></div>
    <div class="card"><div class="card-title">📅 Monthly Attendance</div>
    <div class="table-wrap"><table>
      <thead><tr><th>Month</th><th>Working Days</th><th>Present</th><th>Absent</th><th>%</th></tr></thead>
      <tbody>${['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map(m => { const wd = 22; const pr = Math.floor(wd * s.att / 100 + Math.random() * 3 - 1); const pct = Math.round(pr / wd * 100); return `<tr><td>${m}</td><td>${wd}</td><td>${pr}</td><td>${wd - pr}</td><td><span class="badge ${pct >= 75 ? 'badge-green' : 'badge-red'}">${pct}%</span></td></tr>`; }).join('')}
      </tbody>
    </table></div></div>`;

  // Fee tab — ALL YEARS complete breakdown
  const bal = s.fee.total - s.fee.paid;
  const pct = Math.round(s.fee.paid / s.fee.total * 100);
  const yearlyFee = Math.round(s.fee.total / s.duration);
  let feeYearsHTML = '';
  for (let yr = 1; yr <= s.duration; yr++) {
    const yrPaid = yr === 1 ? Math.min(yearlyFee, s.fee.paid) : yr === 2 ? Math.max(0, s.fee.paid - yearlyFee) : 0;
    const yrBal = yearlyFee - yrPaid;
    const yrPct = Math.round(yrPaid / yearlyFee * 100);
    feeYearsHTML += `<tr>
      <td>Year ${yr}</td>
      <td>₹${yearlyFee.toLocaleString()}</td>
      <td style="color:var(--accent-green)">₹${yrPaid.toLocaleString()}</td>
      <td style="color:${yrBal > 0 ? 'var(--accent-red)' : 'var(--accent-green)'}">₹${yrBal.toLocaleString()}</td>
      <td><div class="prog-bar" style="min-width:80px;"><div class="prog-fill" style="width:${yrPct}%;background:${yrBal === 0 ? 'var(--accent-green)' : 'var(--accent-orange)'}"></div></div></td>
      <td><span class="badge ${yrBal === 0 ? 'badge-green' : yr < 3 ? 'badge-red' : 'badge-purple'}">${yrBal === 0 ? 'Paid' : yr < 3 ? 'Pending' : 'Upcoming'}</span></td>
    </tr>`;
  }
  document.getElementById('studentFeeContent').innerHTML = `
    <div style="background:rgba(0,212,255,.05);border:1px solid rgba(0,212,255,.15);border-radius:10px;padding:12px;margin-bottom:14px;font-size:12px;color:var(--accent-cyan);">🔒 Fee records are read-only. Only Admin/HOD can view this data. Payment processing is handled separately.</div>
    <div class="mini-stats">
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--text-primary)">₹${s.fee.total.toLocaleString()}</div><div class="mini-stat-lbl">Total Course Fee</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-green)">₹${s.fee.paid.toLocaleString()}</div><div class="mini-stat-lbl">Total Paid</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:${bal > 0 ? 'var(--accent-red)' : 'var(--accent-green)'}">₹${bal.toLocaleString()}</div><div class="mini-stat-lbl">Balance Due</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-gold)">${pct}%</div><div class="mini-stat-lbl">% Paid</div></div>
    </div>
    <div class="card">
      <div class="card-title">💰 Overall Fee Progress</div>
      <div class="fee-progress"><div class="fee-fill" style="width:${pct}%"></div></div>
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-secondary);margin-top:6px;"><span>Paid: ₹${s.fee.paid.toLocaleString()}</span><span>Balance: ₹${bal.toLocaleString()}</span></div>
    </div>
    <div class="card">
      <div class="card-title">📋 Year-wise Fee Breakdown (Full Course: ${s.duration} Years)</div>
      <div class="table-wrap"><table>
        <thead><tr><th>Year</th><th>Fee Amount</th><th>Paid</th><th>Balance</th><th>Progress</th><th>Status</th></tr></thead>
        <tbody>${feeYearsHTML}</tbody>
      </table></div>
    </div>
    <div class="card">
      <div class="card-title">📋 Payment History</div>
      <div class="table-wrap"><table>
        <thead><tr><th>Date</th><th>Amount</th><th>Mode</th><th>Transaction ID</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>10 Jan 2026</td><td>₹${Math.round(s.fee.paid / 2).toLocaleString()}</td><td>Online Transfer</td><td>TXN-9981234</td><td><span class="badge badge-green">Success</span></td></tr>
          ${s.fee.paid > s.fee.total / 2 ? `<tr><td>5 Mar 2026</td><td>₹${Math.round(s.fee.paid / 2).toLocaleString()}</td><td>Cash</td><td>CASH-00412</td><td><span class="badge badge-green">Success</span></td></tr>` : ''}
          ${bal > 0 ? `<tr><td colspan="5" style="color:var(--accent-red);text-align:center;padding:12px;">⚠️ ₹${bal.toLocaleString()} pending — No payment recorded</td></tr>` : ''}
        </tbody>
      </table></div>
    </div>`;

  if (!studentChats[id]) studentChats[id] = [];
  renderStudentChat(id);
}

function renderStudentChat(id) {
  const el = document.getElementById('studentChatMsgs');
  if (!el) return;
  el.innerHTML = studentChats[id].length ? studentChats[id].map(m => `<div class="msg-bubble ${m.sent ? 'sent' : 'recv'}">${m.text}<div class="msg-meta">${m.time}</div></div>`).join('') : '<div style="text-align:center;color:var(--text-muted);padding:30px;">No messages yet. Start a conversation.</div>';
  el.scrollTop = el.scrollHeight;
}

function quickStudentMsg() {
  const inp = document.getElementById('studentChatInput');
  const txt = inp.value.trim();
  if (!txt || !currentStudentId) return;
  studentChats[currentStudentId] = studentChats[currentStudentId] || [];
  studentChats[currentStudentId].push({ sent: true, text: txt, time: 'Just now' });
  inp.value = '';
  renderStudentChat(currentStudentId);
  showToast('✅ Message sent to student!');
}

function msgStudent(id) {
  openStudentDetail(id);
  setTimeout(() => { document.querySelectorAll('#page-studentdetail .tab')[4].click(); }, 200);
}

// ===== TEACHERS =====
function initTeachers() {
  const tb = document.getElementById('teacherTableBody');
  if (!tb) return;
  tb.innerHTML = teachers.map(t => `<tr>
    <td style="color:var(--text-muted)">${t.id}</td>
    <td><a href="#" onclick="openTeacherDetail('${t.id}')" style="color:var(--accent-cyan);text-decoration:none;font-weight:600;">${t.name}</a></td>
    <td>${t.dept}</td>
    <td>${t.subjects.join(', ')}</td>
    <td>${t.classes.join(', ')}</td>
    <td><span class="badge badge-orange">${t.leavesUsed} used</span></td>
    <td><span class="badge ${t.status === 'Active' ? 'badge-green' : 'badge-orange'}">${t.status}</span></td>
    <td style="display:flex;gap:5px;">
      <button class="btn btn-outline btn-xs" onclick="openTeacherDetail('${t.id}')">👁 View</button>
      <button class="btn btn-outline btn-xs" onclick="msgTeacher('${t.id}')">💬 Msg</button>
    </td>
  </tr>`).join('');
}
function searchTeachers(q) {
  const filtered = teachers.filter(t => t.name.toLowerCase().includes(q.toLowerCase()) || t.id.includes(q) || t.dept.toLowerCase().includes(q.toLowerCase()));
  const tb = document.getElementById('teacherTableBody');
  if (tb) tb.innerHTML = filtered.map(t => `<tr><td>${t.id}</td><td><a href="#" onclick="openTeacherDetail('${t.id}')" style="color:var(--accent-cyan);text-decoration:none;">${t.name}</a></td><td>${t.dept}</td><td>${t.subjects.join(', ')}</td><td>${t.classes.join(', ')}</td><td>${t.leavesUsed}</td><td><span class="badge ${t.status === 'Active' ? 'badge-green' : 'badge-orange'}">${t.status}</span></td><td><button class="btn btn-outline btn-xs" onclick="openTeacherDetail('${t.id}')">View</button></td></tr>`).join('');
}

function openTeacherDetail(id) {
  currentTeacherId = id;
  const t = teachers.find(x => x.id === id);
  if (!t) return;
  navigate('teacherdetail', null);
  document.getElementById('teacherDetailHeader').innerHTML = `
    <div class="detail-avatar" style="background:linear-gradient(135deg,#1a3a5c,#0d2240)">👩‍🏫</div>
    <div>
      <div class="detail-name">${t.name}</div>
      <div class="detail-meta">ID: ${t.id} &nbsp;·&nbsp; Dept: ${t.dept} &nbsp;·&nbsp; Exp: ${t.exp}<br>
      Email: <span style="color:var(--accent-cyan)">${t.email}</span> &nbsp;·&nbsp; Status: <span style="color:${t.status === 'Active' ? 'var(--accent-green)' : 'var(--accent-orange)'}">${t.status}</span></div>
    </div>
    <div style="margin-left:auto;display:flex;gap:8px;flex-wrap:wrap;">
      <button class="btn btn-cyan btn-sm" onclick="msgTeacher('${t.id}')">💬 Message</button>
      <button class="btn btn-outline btn-sm" onclick="exportData()">⬇️ Export</button>
    </div>`;

  document.getElementById('teacherOverviewContent').innerHTML = `
    <div class="mini-stats">
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-cyan)">${t.subjects.length}</div><div class="mini-stat-lbl">Subjects</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-gold)">${t.classes.length}</div><div class="mini-stat-lbl">Classes</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-orange)">${t.leavesUsed}</div><div class="mini-stat-lbl">Leaves Used</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-green)">${12 - t.leavesUsed}</div><div class="mini-stat-lbl">Leaves Left</div></div>
    </div>
    <div class="grid-2">
      <div class="card"><div class="card-title">📋 Personal Details</div>
        <table><tbody>
          <tr><td style="color:var(--text-muted);width:140px;">Employee ID</td><td>${t.id}</td></tr>
          <tr><td style="color:var(--text-muted)">Department</td><td>${t.dept}</td></tr>
          <tr><td style="color:var(--text-muted)">Experience</td><td>${t.exp}</td></tr>
          <tr><td style="color:var(--text-muted)">Email</td><td>${t.email}</td></tr>
          <tr><td style="color:var(--text-muted)">Status</td><td><span class="badge ${t.status === 'Active' ? 'badge-green' : 'badge-orange'}">${t.status}</span></td></tr>
          <tr><td style="color:var(--text-muted)">Subjects</td><td>${t.subjects.join(', ')}</td></tr>
          <tr><td style="color:var(--text-muted)">Classes</td><td>${t.classes.join(', ')}</td></tr>
        </tbody></table>
      </div>
      <div class="card"><div class="card-title">📊 Teaching Load</div>
        ${t.subjects.map(s => { const v = 18 + Math.floor(Math.random() * 8); return `<div style="margin-bottom:10px;"><div style="display:flex;justify-content:space-between;font-size:13px;"><span>${s}</span><span style="color:var(--accent-gold)">${v} hrs/sem</span></div><div class="prog-bar"><div class="prog-fill" style="width:${v * 3.5}%;background:var(--accent-gold)"></div></div></div>`; }).join('')}
      </div>
    </div>`;

  document.getElementById('teacherSubjectsContent').innerHTML = `
    <div class="card"><div class="card-title">📚 Assigned Subjects</div>
    <div class="table-wrap"><table>
      <thead><tr><th>Subject</th><th>Classes</th><th>Type</th><th>Hours/Week</th><th>Students</th><th>Avg Result</th></tr></thead>
      <tbody>${t.subjects.map((s, i) => `<tr><td><span class="badge badge-cyan">${s}</span></td><td>${t.classes[i] || t.classes[0]}</td><td>${i % 2 === 0 ? 'Theory' : 'Lab'}</td><td>${4 + i}</td><td>${35 + Math.floor(Math.random() * 20)}</td><td><span class="badge badge-green">${(75 + Math.random() * 15).toFixed(0)}%</span></td></tr>`).join('')}
      </tbody>
    </table></div></div>`;

  document.getElementById('teacherTimetableContent').innerHTML = buildTeacherTimetable(t);

  // Leave record with full history
  const tLeaveHist = leaveHistory.filter(l => l.teacher === t.name);
  document.getElementById('teacherLeavesContent').innerHTML = `
    <div class="mini-stats">
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-orange)">${t.leavesUsed}</div><div class="mini-stat-lbl">Used This Year</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-green)">${12 - t.leavesUsed}</div><div class="mini-stat-lbl">Available</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-cyan)">12</div><div class="mini-stat-lbl">Total Allowed</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:${pendingLeaves.find(p => p.teacher === t.name) ? 'var(--accent-gold)' : 'var(--text-muted)'}">${pendingLeaves.filter(p => p.teacher === t.name).length}</div><div class="mini-stat-lbl">Pending</div></div>
    </div>
    <div class="card"><div class="card-title">⏳ Pending Requests</div>
    ${pendingLeaves.filter(p => p.teacher === t.name).length ? `<div class="table-wrap"><table><thead><tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Action</th></tr></thead><tbody>
    ${pendingLeaves.filter(p => p.teacher === t.name).map(l => `<tr><td>${l.type}</td><td>${l.from}</td><td>${l.to}</td><td>${l.days}</td><td>${l.reason}</td><td style="display:flex;gap:4px;"><button class="btn btn-success btn-xs" onclick="approveLeave('${l.teacher}')">✓ Approve</button><button class="btn btn-danger btn-xs" onclick="rejectLeave('${l.teacher}')">✗ Reject</button></td></tr>`).join('')}
    </tbody></table></div>`: '<div style="color:var(--text-muted);padding:12px;">No pending requests</div>'}
    </div>
    <div class="card"><div class="card-title">📋 Leave History</div>
    ${tLeaveHist.length ? `<div class="table-wrap"><table><thead><tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th></tr></thead><tbody>
    ${tLeaveHist.map(l => `<tr><td>${l.type}</td><td>${l.from}</td><td>${l.to}</td><td>${l.days}</td><td><span class="badge ${l.status === 'Approved' ? 'badge-green' : 'badge-red'}">${l.status}</span></td></tr>`).join('')}
    </tbody></table></div>`: '<div style="color:var(--text-muted);padding:12px;">No leave history on record</div>'}
    </div>`;

  document.getElementById('teacherPerfContent').innerHTML = `
    <div class="mini-stats">
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-cyan)">${(8 + Math.random()).toFixed(1)}</div><div class="mini-stat-lbl">Avg Student CGPA</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-green)">${88 + Math.floor(Math.random() * 8)}%</div><div class="mini-stat-lbl">Pass Rate</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-gold)">${(4.2 + Math.random() * .6).toFixed(1)}/5</div><div class="mini-stat-lbl">Student Rating</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-purple)">${t.classes.length}</div><div class="mini-stat-lbl">Classes Handled</div></div>
    </div>
    <div class="card"><div class="card-title">📊 Class Performance under ${t.name}</div>
    <div class="table-wrap"><table>
      <thead><tr><th>Class</th><th>Subject</th><th>Avg Marks</th><th>Pass %</th><th>Grade Dist.</th></tr></thead>
      <tbody>${t.classes.map((cls, i) => { const avg = (65 + Math.random() * 20).toFixed(0); const pass = (80 + Math.random() * 15).toFixed(0); return `<tr><td>${cls}</td><td>${t.subjects[i] || t.subjects[0]}</td><td>${avg}/100</td><td>${pass}%</td><td><span class="badge badge-green">O: 8</span> <span class="badge badge-cyan">A: 15</span> <span class="badge badge-orange">B: 12</span></td></tr>`; }).join('')}
      </tbody>
    </table></div></div>`;

  if (!teacherChats[id]) teacherChats[id] = [];
  renderTeacherChat(id);
}

function buildTeacherTimetable(t) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const periods = ['8–9', '9–10', '10–11', '11:30–12:30', '1:30–2:30', '2:30–3:30'];
  const ttData = timetables['CSE-3A'] || [];
  let html = '<div class="card"><div class="card-title">🗓️ Weekly Timetable</div>';
  html += '<div style="overflow-x:auto;"><table style="width:100%;"><thead><tr><th>Period</th>';
  days.forEach(d => html += `<th>${d}</th>`);
  html += '</tr></thead><tbody>';
  periods.forEach((p, pi) => {
    html += `<tr><td style="color:var(--text-muted);white-space:nowrap;font-size:11px;">${p}</td>`;
    days.forEach((d, di) => {
      const cell = ttData[di]?.[pi] || '—Free—';
      const isSubj = t.subjects.some(s => cell.includes(s));
      const isBreak = cell.includes('Break');
      const isFree = cell.includes('Free');
      const cls = isBreak ? 'tt-break' : isFree ? 'tt-free' : isSubj ? 'tt-subject' : 'tt-free';
      html += `<td><div class="tt-cell ${cls}" style="font-size:11px;">${cell.replace('\n', '<br>')}</div></td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table></div></div>';
  return html;
}

function renderTeacherChat(id) {
  const el = document.getElementById('teacherChatMsgs');
  if (!el) return;
  el.innerHTML = teacherChats[id].length ? teacherChats[id].map(m => `<div class="msg-bubble ${m.sent ? 'sent' : 'recv'}">${m.text}<div class="msg-meta">${m.time}</div></div>`).join('') : '<div style="text-align:center;color:var(--text-muted);padding:30px;">No messages yet.</div>';
  el.scrollTop = el.scrollHeight;
}

function quickTeacherMsg() {
  const inp = document.getElementById('teacherChatInput');
  const txt = inp.value.trim();
  if (!txt || !currentTeacherId) return;
  teacherChats[currentTeacherId] = teacherChats[currentTeacherId] || [];
  teacherChats[currentTeacherId].push({ sent: true, text: txt, time: 'Just now' });
  inp.value = '';
  renderTeacherChat(currentTeacherId);
  showToast('✅ Message sent to teacher!');
}

function msgTeacher(id) {
  openTeacherDetail(id);
  setTimeout(() => { document.querySelectorAll('#page-teacherdetail .tab')[5].click(); }, 200);
}

// ===== CLASSES =====
let createdClasses = [
  { name: 'CSE-3A', year: '3rd Year', teacher: 'Dr. Priya Verma', students: 42, att: 91, cgpa: 8.4, color: 'var(--accent-cyan)', subjects: ['DSA', 'OS', 'DBMS', 'CN', 'SE'] },
  { name: 'CSE-3B', year: '3rd Year', teacher: 'Mr. Arun Kumar', students: 38, att: 81, cgpa: 7.9, color: 'var(--accent-gold)', subjects: ['DBMS', 'AI', 'OS', 'SE'] },
  { name: 'CSE-2A', year: '2nd Year', teacher: 'Ms. Neha Singh', students: 45, att: 84, cgpa: 7.6, color: 'var(--accent-purple)', subjects: ['Maths', 'Physics', 'DSA', 'Python'] },
  { name: 'MCA-1', year: '1st Year', teacher: 'Prof. R.K. Das', students: 30, att: 88, cgpa: 8.5, color: 'var(--accent-green)', subjects: ['Python', 'Stats', 'DBMS', 'AI'] },
  { name: 'CSE-4A', year: '4th Year', teacher: 'Dr. Anita Joshi', students: 40, att: 86, cgpa: 8.1, color: 'var(--accent-orange)', subjects: ['AI', 'ML', 'Project'] },
];

function initClasses() {
  const grid = document.getElementById('classCardsGrid');
  if (!grid) return;
  grid.innerHTML = createdClasses.map(c => `
    <div class="card" style="border-color:${c.color}22;margin-bottom:0;cursor:pointer;" onmouseover="this.style.borderColor='${c.color}'" onmouseout="this.style.borderColor='${c.color}22'">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
        <div style="width:44px;height:44px;border-radius:12px;background:${c.color}22;border:1px solid ${c.color}44;display:flex;align-items:center;justify-content:center;font-family:'Rajdhani',sans-serif;font-size:13px;font-weight:700;color:${c.color};">${c.name}</div>
        <div><div style="font-family:'Rajdhani',sans-serif;font-size:17px;font-weight:700;">${c.name}</div><div style="font-size:12px;color:var(--text-secondary);">${c.year} · ${c.students} students</div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
        <div style="background:var(--bg-secondary);border-radius:8px;padding:10px;text-align:center;"><div style="font-family:'Rajdhani',sans-serif;font-size:20px;font-weight:700;color:${c.color}">${c.cgpa}</div><div style="font-size:10px;color:var(--text-secondary)">Avg CGPA</div></div>
        <div style="background:var(--bg-secondary);border-radius:8px;padding:10px;text-align:center;"><div style="font-family:'Rajdhani',sans-serif;font-size:20px;font-weight:700;color:${c.att >= 85 ? 'var(--accent-green)' : 'var(--accent-orange)'}">${c.att}%</div><div style="font-size:10px;color:var(--text-secondary)">Attendance</div></div>
      </div>
      <div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px;">Class Teacher: <span style="color:var(--text-primary)">${c.teacher}</span></div>
      <div style="margin-bottom:10px;display:flex;flex-wrap:wrap;gap:4px;">${(c.subjects || []).map(s => `<span class="badge badge-cyan" style="font-size:9px;">${s}</span>`).join('')}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button class="btn btn-outline btn-xs" onclick="filterStudents('${c.name}');navigate('students',null);setActiveNav('students')">👩‍🎓 Students</button>
        <button class="btn btn-outline btn-xs" onclick="loadTimetable('${c.name}');navigate('timetable',null);setActiveNav('timetable')">🗓️ Timetable</button>
        <button class="btn btn-outline btn-xs" onclick="openModal('newMsgModal')">💬 Msg Group</button>
        <button class="btn btn-danger btn-xs" onclick="deleteClass('${c.name}')">🗑</button>
      </div>
    </div>`).join('');
}

function autoGenerateClassKey() {
  const dept = document.getElementById('newClassDept').value.trim();
  const year = document.getElementById('newClassYear').value;
  const section = document.getElementById('newClassSection').value;
  if (!dept || !year) { document.getElementById('newClassKey').value = ''; return; }
  const deptKey = dept.split(' ').map(w => w[0].toUpperCase()).join('').slice(0, 3);
  let key = `${deptKey}-${year}${section}`;
  document.getElementById('newClassKey').value = key;
}

function addSubjectToNew() {
  const inp = document.getElementById('newSubjectInput');
  const val = inp.value.trim();
  if (!val || newClassSubjects.includes(val)) return;
  newClassSubjects.push(val);
  renderNewSubjectTags();
  inp.value = '';
}

function quickAddSubject(sub) {
  if (!newClassSubjects.includes(sub)) { newClassSubjects.push(sub); renderNewSubjectTags(); }
}

function renderNewSubjectTags() {
  const el = document.getElementById('newSubjectTags');
  el.innerHTML = newClassSubjects.length ? newClassSubjects.map(s => `<span class="subject-tag">${s} <span class="remove" onclick="removeSubject('${s}')">×</span></span>`).join('') : '<span style="color:var(--text-muted);font-size:11px;padding:4px;">No subjects added yet</span>';
}

function removeSubject(s) { newClassSubjects = newClassSubjects.filter(x => x !== s); renderNewSubjectTags(); }

function createNewClass() {
  const dept = document.getElementById('newClassDept').value.trim();
  const year = document.getElementById('newClassYear').value;
  const key = document.getElementById('newClassKey').value.trim();
  const teacher = document.getElementById('newClassTeacher').value;
  const strength = parseInt(document.getElementById('newClassStrength').value) || 45;
  if (!dept || !year || !key) { showToast('⚠️ Department and Year are required!'); return; }
  const yearMap = { '1': '1st Year', '2': '2nd Year', '3': '3rd Year', '4': '4th Year' };
  const colors = ['var(--accent-cyan)', 'var(--accent-gold)', 'var(--accent-purple)', 'var(--accent-green)', 'var(--accent-orange)', 'var(--accent-red)'];
  createdClasses.push({ name: key, year: yearMap[year], teacher, students: strength, att: 85, cgpa: 7.5, color: colors[createdClasses.length % colors.length], subjects: [...newClassSubjects] });
  newClassSubjects = [];
  renderNewSubjectTags();
  document.getElementById('newClassDept').value = '';
  document.getElementById('newClassYear').value = '';
  document.getElementById('newClassSection').value = '';
  document.getElementById('newClassKey').value = '';
  closeModal('createClassModal');
  initClasses();
  showToast(`✅ Class ${key} created successfully!`);
}

function deleteClass(name) {
  createdClasses = createdClasses.filter(c => c.name !== name);
  initClasses();
  showToast(`🗑 Class ${name} deleted`);
}

// ===== RESULTS =====
function initResults() {
  const rc = document.getElementById('resultsCompChart');
  if (rc && !rc._chart) rc._chart = new Chart(rc.getContext('2d'), {
    type: 'bar', data: {
      labels: ['CSE-3A', 'CSE-3B', 'CSE-2A', 'MCA-1'], datasets: [
        { label: 'Mid-Term Avg', data: [76, 71, 74, 82], backgroundColor: 'rgba(0,212,255,.3)', borderColor: '#00d4ff', borderWidth: 2, borderRadius: 6 },
        { label: 'End-Term Avg', data: [80, 74, 78, 85], backgroundColor: 'rgba(240,165,0,.3)', borderColor: '#f0a500', borderWidth: 2, borderRadius: 6 },
        { label: 'Pass %', data: [95, 90, 92, 97], backgroundColor: 'rgba(57,211,83,.2)', borderColor: '#39d353', borderWidth: 2, borderRadius: 6 },
      ]
    }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#8b949e' } } }, scales: { y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } }, x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } } } }
  });
  const rr = document.getElementById('resultRecordsBody');
  if (rr) rr.innerHTML = [
    { cls: 'CSE-3A', sub: 'DSA', exam: 'Mid-Term', tot: 42, pass: 96, avg: 78 },
    { cls: 'CSE-3B', sub: 'OS', exam: 'Mid-Term', tot: 38, pass: 89, avg: 71 },
    { cls: 'CSE-2A', sub: 'DBMS', exam: 'End-Term', tot: 45, pass: 93, avg: 74 },
    { cls: 'MCA-1', sub: 'Python', exam: 'Quiz', tot: 30, pass: 97, avg: 85 },
    { cls: 'CSE-3A', sub: 'CN', exam: 'End-Term', tot: 42, pass: 91, avg: 80 },
    { cls: 'CSE-3B', sub: 'SE', exam: 'Assignment', tot: 38, pass: 100, avg: 88 },
  ].map(r => `<tr><td>${r.cls}</td><td>${r.sub}</td><td><span class="badge badge-purple">${r.exam}</span></td><td>${r.tot}</td><td>${r.pass}%</td><td>${r.avg}/100</td><td><span class="badge badge-green">Published</span></td><td><button class="btn btn-outline btn-xs" onclick="showToast('📋 Viewing ${r.sub} results')">View</button></td></tr>`).join('');
  populateResultClassDropdowns();
  renderManualResultsList();
}

// ===== ATTENDANCE =====
function initAttendance() {
  const c1 = document.getElementById('attByClassChart');
  if (c1 && !c1._chart) c1._chart = new Chart(c1.getContext('2d'), { type: 'bar', data: { labels: ['CSE-3A', 'CSE-3B', 'CSE-2A', 'MCA-1', 'CSE-4A'], datasets: [{ label: 'Attendance %', data: [91, 81, 84, 88, 86], backgroundColor: ['rgba(57,211,83,.4)', 'rgba(255,71,87,.4)', 'rgba(0,212,255,.4)', 'rgba(57,211,83,.4)', 'rgba(0,212,255,.4)'], borderColor: ['#39d353', '#ff4757', '#00d4ff', '#39d353', '#00d4ff'], borderWidth: 2, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 60, max: 100, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } }, x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } } } } });
  const c2 = document.getElementById('attMonthlyChart');
  if (c2 && !c2._chart) c2._chart = new Chart(c2.getContext('2d'), { type: 'line', data: { labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], datasets: [{ label: 'Avg Attendance', data: [88, 85, 82, 86, 84, 79, 87, 89, 85], borderColor: '#00d4ff', backgroundColor: 'rgba(0,212,255,.1)', tension: .4, fill: true, pointRadius: 4, pointBackgroundColor: '#00d4ff' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 70, max: 100, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } }, x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } } } } });
  const lb = document.getElementById('lowAttBody');
  if (lb) lb.innerHTML = students.filter(s => s.att < 80).map(s => `<tr><td style="color:var(--text-muted)">${s.id}</td><td><a href="#" onclick="openStudentDetail('${s.id}')" style="color:var(--accent-cyan);text-decoration:none;">${s.name}</a></td><td>${s.class}</td><td><span class="badge ${s.att < 75 ? 'badge-red' : 'badge-orange'}">${s.att}%</span></td><td>Class Teacher</td><td style="display:flex;gap:5px;"><button class="btn btn-outline btn-xs" onclick="msgStudent('${s.id}')">📨 Alert</button><button class="btn btn-outline btn-xs" onclick="openStudentDetail('${s.id}')">👁 View</button></td></tr>`).join('');
  populateAttClassDropdown(); // ✅ YE LINE ADD KI
}

// ===== FEE =====
function initFee() {
  const fc = document.getElementById('feeChart');
  if (fc && !fc._chart) fc._chart = new Chart(fc.getContext('2d'), {
    type: 'bar', data: {
      labels: ['CSE-3A', 'CSE-3B', 'CSE-2A', 'MCA-1', 'CSE-4A'], datasets: [
        { label: 'Collected (₹L)', data: [33.6, 30.4, 33.75, 27, 32], backgroundColor: 'rgba(57,211,83,.35)', borderColor: '#39d353', borderWidth: 2, borderRadius: 6 },
        { label: 'Pending (₹L)', data: [0.8, 2.4, 0, 0, 1.2], backgroundColor: 'rgba(255,71,87,.35)', borderColor: '#ff4757', borderWidth: 2, borderRadius: 6 },
      ]
    }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#8b949e' } } }, scales: { y: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } }, x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } } } }
  });
  renderFeeTable(students);
}

function renderFeeTable(data) {
  const ft = document.getElementById('feeTableBody');
  if (ft) ft.innerHTML = data.map(s => {
    const bal = s.fee.total - s.fee.paid;
    return `<tr><td style="color:var(--text-muted)">${s.id}</td>
    <td><a href="#" onclick="openStudentDetail('${s.id}');setTimeout(()=>document.querySelectorAll('#page-studentdetail .tab')[3].click(),300)" style="color:var(--accent-cyan);text-decoration:none;">${s.name}</a></td>
    <td>${s.class}</td><td>₹${s.fee.total.toLocaleString()}</td>
    <td style="color:var(--accent-green)">₹${s.fee.paid.toLocaleString()}</td>
    <td style="color:${bal > 0 ? 'var(--accent-red)' : 'var(--accent-green)'}">₹${bal.toLocaleString()}</td>
    <td style="color:var(--text-muted);font-size:12px;">10 Jan 2026</td>
    <td><span class="badge ${bal === 0 ? 'badge-green' : bal > s.fee.total / 2 ? 'badge-red' : 'badge-orange'}">${bal === 0 ? 'Paid' : bal > s.fee.total / 2 ? 'Defaulter' : 'Partial'}</span></td>
    <td><button class="btn btn-outline btn-xs" onclick="openStudentDetail('${s.id}');setTimeout(()=>document.querySelectorAll('#page-studentdetail .tab')[3].click(),300)">📋 Details</button></td></tr>`;
  }).join('');
}

function searchFee(q) {
  renderFeeTable(students.filter(s => s.name.toLowerCase().includes(q.toLowerCase()) || s.id.includes(q)));
}

// ===== TIMETABLE =====
function loadTimetable(cls) {
  const el = document.getElementById('timetableContent');
  if (!el) return;
  const tt = timetables[cls] || timetables['CSE-3A'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['P1  8:00–9:00', 'P2  9:00–10:00', 'P3  10:00–11:00', 'Break 11:00–11:30', 'P4  11:30–12:30', 'P5  1:30–2:30', 'P6  2:30–3:30'];
  let html = `<div style="font-family:'Rajdhani',sans-serif;font-size:17px;font-weight:700;margin-bottom:14px;">🗓️ ${cls} — Weekly Timetable</div>`;
  html += '<div style="overflow-x:auto;"><table style="width:100%;"><thead><tr><th style="min-width:110px;"></th>';
  days.forEach(d => html += `<th style="text-align:center;min-width:120px;">${d}</th>`);
  html += '</tr></thead><tbody>';
  periods.forEach((p, pi) => {
    const isBreak = p.includes('Break');
    html += `<tr><td style="color:var(--text-muted);font-size:11px;white-space:nowrap;padding:6px 12px;">${p}</td>`;
    if (isBreak) {
      html += `<td colspan="${days.length}" style="text-align:center;"><div class="tt-cell tt-break">☕ Break</div></td>`;
    } else {
      const adjustedPi = pi > 3 ? pi - 1 : pi;
      days.forEach((d, di) => {
        const cell = tt[di]?.[adjustedPi] || '—Free—';
        const isLab = cell.includes('Lab');
        const isFree = cell.includes('Free') || cell === '—Free—';
        const cellCls = isFree ? 'tt-free' : isLab ? 'tt-lab' : 'tt-subject';
        html += `<td><div class="tt-cell ${cellCls}" style="font-size:11px;line-height:1.5;">${cell.replace('\n', '<br>')}</div></td>`;
      });
    }
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  el.innerHTML = html;
  const tlb = document.getElementById('teacherLoadBody');
  if (tlb) tlb.innerHTML = teachers.slice(0, 4).map(t => `<tr><td>${t.name}</td><td>${t.subjects.join(', ')}</td><td>${t.classes.join(', ')}</td><td>${20 + Math.floor(Math.random() * 8)} hrs</td><td><span class="badge badge-green">Normal</span></td></tr>`).join('');
  buildEditTTBody();
}

function buildEditTTBody() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['P1 8:00-9:00', 'P2 9:00-10:00', 'P3 10:00-11:00', 'Break', 'P4 11:30-12:30', 'P5 1:30-2:30', 'P6 2:30-3:30'];
  const cls = document.getElementById('ttClassSelect')?.value || 'CSE-3A';
  const tt = timetables[cls] || [];
  const el = document.getElementById('editTTBody');
  if (!el) return;
  el.innerHTML = periods.map((p, pi) => {
    if (p === 'Break') return `<tr style="background:rgba(240,165,0,.05);"><td colspan="6" style="text-align:center;color:var(--accent-gold);padding:8px;font-size:12px;">☕ Break — 11:00 to 11:30</td></tr>`;
    const adjustedPi = pi > 3 ? pi - 1 : pi;
    return `<tr><td style="color:var(--text-muted);font-size:11px;white-space:nowrap;">${p}</td>
    ${days.map((d, di) => `<td><input class="form-input" style="font-size:11px;padding:5px 8px;" value="${(tt[di]?.[adjustedPi] || '—Free—').replace('\n', ' | ')}" onchange="updateTT(${di},${adjustedPi},this.value,'${cls}')"></td>`).join('')}
    </tr>`;
  }).join('');
}

function updateTT(di, pi, val, cls) {
  if (!timetables[cls]) timetables[cls] = Array(5).fill(null).map(() => Array(6).fill('—Free—'));
  timetables[cls][di][pi] = val.replace(' | ', '\n');
}

function saveTimetable() {
  const cls = document.getElementById('editTTClass')?.value || 'CSE-3A';
  closeModal('editTTModal');
  loadTimetable(cls);
  showToast('✅ Timetable saved for ' + cls + '!');
}

// ===== MESSAGES =====
function initMessages() {
  const inbox = document.getElementById('adminInboxList');
  if (!inbox) return;
  inbox.innerHTML = adminConvs.map((c, i) => `
    <div onclick="openAdminConv(${i})" style="display:flex;align-items:center;gap:12px;padding:11px;border-radius:10px;cursor:pointer;border:1px solid var(--border);margin-bottom:8px;transition:.2s;" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background=''">
      <div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--accent-gold),var(--accent-orange));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:#000;">${c.name[0]}</div>
      <div style="flex:1;"><div style="font-size:13px;font-weight:600;">${c.name}</div><div style="font-size:11px;color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:140px;">${c.last}</div></div>
      <div style="text-align:right;"><div style="font-size:10px;color:var(--text-muted);">${c.time}</div><span class="badge badge-${c.role === 'Teacher' ? 'gold' : c.role === 'Group' ? 'purple' : 'cyan'}" style="margin-top:4px;">${c.role}</span></div>
    </div>`).join('');
}

function openAdminConv(i) {
  currentAdminConv = i;
  const c = adminConvs[i];
  document.getElementById('adminChatTitle').textContent = '💬 ' + c.name + ' (' + c.role + ')';
  const el = document.getElementById('adminChatMsgs');
  el.innerHTML = c.msgs.map(m => `<div class="msg-bubble ${m.sent ? 'sent' : 'recv'}">${m.text}<div class="msg-meta">${m.time}</div></div>`).join('');
  el.scrollTop = el.scrollHeight;
}

function sendAdminMsg() {
  const inp = document.getElementById('adminChatInput');
  const txt = inp.value.trim();
  if (!txt || currentAdminConv === null) { showToast('⚠️ Select a conversation first'); return; }
  adminConvs[currentAdminConv].msgs.push({ sent: true, text: txt, time: 'Just now' });
  adminConvs[currentAdminConv].last = txt;
  openAdminConv(currentAdminConv);
  inp.value = '';
  showToast('✅ Message sent!');
}

function sendNewMsg() {
  const recipient = document.getElementById('msgRecipient').value;
  const subject = document.getElementById('msgSubject').value.trim();
  const body = document.getElementById('msgBody').value.trim();
  if (recipient === 'Select recipient...' || !body) { showToast('⚠️ Select recipient and write a message!'); return; }
  adminConvs.unshift({ name: recipient.split(' (')[0], role: recipient.includes('Group') ? 'Group' : recipient.includes('Teacher') ? 'Teacher' : 'Student', last: body.substring(0, 40) + '...', time: 'Just now', msgs: [{ sent: true, text: body, time: 'Just now' }] });
  closeModal('newMsgModal');
  document.getElementById('msgRecipient').value = 'Select recipient...';
  document.getElementById('msgSubject').value = '';
  document.getElementById('msgBody').value = '';
  initMessages();
  showToast('✅ Message sent to ' + recipient.split(' (')[0] + '!');
}

// ===== LEAVES =====
function initLeaves() {
  renderPendingLeaves();
  renderLeaveHistory(allLeaveHistory);
}

function renderPendingLeaves() {
  const plb = document.getElementById('pendingLeavesBody');
  if (plb) plb.innerHTML = pendingLeaves.map((l, i) => `<tr>
    <td><a href="#" onclick="openTeacherDetailByName('${l.teacher}')" style="color:var(--accent-cyan);text-decoration:none;">${l.teacher}</a></td>
    <td><span class="badge badge-orange">${l.type}</span></td>
    <td>${l.from}</td><td>${l.to}</td><td>${l.days}</td>
    <td style="color:var(--text-secondary)">${l.reason}</td>
    <td style="display:flex;gap:5px;">
      <button class="btn btn-success btn-xs" onclick="approveLeaveIdx(${i})">✓ Approve</button>
      <button class="btn btn-danger btn-xs" onclick="rejectLeaveIdx(${i})">✗ Reject</button>
    </td>
  </tr>`).join('');
  document.getElementById('pendingLeaveCount').textContent = pendingLeaves.length;
}

function renderLeaveHistory(data) {
  const lhb = document.getElementById('leaveHistoryBody');
  if (lhb) lhb.innerHTML = data.map(l => `<tr>
    <td><a href="#" onclick="openTeacherDetailByName('${l.teacher}')" style="color:var(--accent-cyan);text-decoration:none;">${l.teacher}</a></td>
    <td>${l.type}</td><td>${l.from}</td><td>${l.to}</td><td>${l.days}</td>
    <td><span class="badge ${l.status === 'Approved' ? 'badge-green' : 'badge-red'}">${l.status}</span></td>
    <td>${l.approvedBy}</td>
    <td><button class="btn btn-outline btn-xs" onclick="showToast('Leave record viewed')">View</button></td>
  </tr>`).join('');
}

function filterLeaveHistory(name) {
  renderLeaveHistory(name ? leaveHistory.filter(l => l.teacher === name) : leaveHistory);
}

function approveLeaveIdx(i) {
  const l = pendingLeaves[i];
  leaveHistory.unshift({ ...l, status: 'Approved', approvedBy: 'Prof. R.K. Sharma' });
  pendingLeaves.splice(i, 1);
  renderPendingLeaves();
  renderLeaveHistory(leaveHistory);
  showToast('✅ Leave approved for ' + l.teacher);
}

function rejectLeaveIdx(i) {
  const l = pendingLeaves[i];
  leaveHistory.unshift({ ...l, status: 'Rejected', approvedBy: 'Prof. R.K. Sharma' });
  pendingLeaves.splice(i, 1);
  renderPendingLeaves();
  renderLeaveHistory(leaveHistory);
  showToast('❌ Leave rejected for ' + l.teacher);
}

function approveLeave(name) {
  const i = pendingLeaves.findIndex(l => l.teacher === name);
  if (i > -1) approveLeaveIdx(i);
}
function rejectLeave(name) {
  const i = pendingLeaves.findIndex(l => l.teacher === name);
  if (i > -1) rejectLeaveIdx(i);
}

function openTeacherDetailByName(name) {
  const t = teachers.find(x => x.name === name);
  if (t) openTeacherDetail(t.id);
}

// ===== NOTICES =====
function toggleAudience(el, val) {
  document.querySelectorAll('.audience-chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedAudience = val;
}

function initNotices() { renderNotices(); }

function renderNotices(filter = '') {
  const el = document.getElementById('noticesList');
  if (!el) return;
  const filtered = filter ? notices.filter(n => n.target === filter || n.target === 'All') : notices;
  el.innerHTML = filtered.length ? filtered.map((n, i) => `
    <div style="padding:13px;border:1px solid var(--border);border-radius:10px;margin-bottom:10px;border-left:3px solid ${n.priority === 'Urgent' ? 'var(--accent-red)' : n.priority === 'Important' ? 'var(--accent-gold)' : 'var(--border)'}">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
        <div style="font-size:13px;font-weight:700;">${n.title}</div>
        <span class="badge ${n.priority === 'Urgent' ? 'badge-red' : n.priority === 'Important' ? 'badge-gold' : 'badge-cyan'}">${n.priority}</span>
      </div>
      <div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;">${n.content}</div>
      <div style="font-size:11px;color:var(--text-muted);">${n.date} · 👥 ${n.target}</div>
      <button class="btn btn-danger btn-xs" onclick="deleteNotice(${notices.indexOf(n)})" style="margin-top:8px;">🗑 Delete</button>
    </div>`).join('') : '<div style="color:var(--text-muted);padding:20px;text-align:center;">No notices found</div>';
}

function filterNotices(val) { renderNotices(val); }

function postNotice() {
  const t = document.getElementById('noticeTitle').value.trim();
  const c = document.getElementById('noticeContent').value.trim();
  const priority = document.getElementById('noticePriority').value;
  if (!t || !c) { showToast('⚠️ Fill in all fields!'); return; }
  notices.unshift({ title: t, content: c, date: 'Today', target: selectedAudience, priority });
  document.getElementById('noticeTitle').value = '';
  document.getElementById('noticeContent').value = '';
  renderNotices();
  showToast('✅ Notice posted to: ' + selectedAudience);
}

function deleteNotice(i) { notices.splice(i, 1); renderNotices(); showToast('🗑 Notice deleted.'); }

// ===== SETTINGS =====
function saveSettings() {
  const dept = document.getElementById('settingDept').value;
  const hod = document.getElementById('settingHod').value;
  document.getElementById('sidebarProfileName').textContent = hod;
  showToast('✅ Settings saved successfully!');
}

// ===== UTILS =====
function updateAnalytics(cls) { showToast('📊 Filtering analytics for: ' + cls); }
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function showToast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 3000); }
function exportData() { showToast('⬇️ Exporting data as CSV...'); }
function doLogout() { if (confirm('Are you sure you want to logout?')) showToast('👋 Logged out! Redirecting...'); }

document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', function (e) { if (e.target === this) this.classList.remove('open'); }));

// INIT
window.onload = () => {
  initDashboard();
  initStudents();
  initTeachers();
  // Set today's date as default for event
  document.getElementById('evtDate').value = new Date().toISOString().split('T')[0];
};
// ── HELPER: get subjects for a class ──────────────────────
function getClassSubjects(className) {
  const cls = createdClasses.find(c => c.name === className);
  return cls ? cls.subjects : [];
}

function populateSubjectDropdown(selectId, className) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  const subs = getClassSubjects(className);
  sel.innerHTML = subs.length
    ? subs.map(s => `<option value="${s}">${s}</option>`).join('')
    : '<option value="">— No subjects found —</option>';
}

function getClassStudents(className) {
  return students.filter(s => s.class === className);
}

function populateManualResultStudents(className) {
  const tbody = document.getElementById('manualResultStudentRows');
  if (!tbody) return;
  const classStudents = getClassStudents(className);
  if (!classStudents.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:20px;">No students found for ${className}</td></tr>`;
    return;
  }
  tbody.innerHTML = classStudents.map(s => `
    <tr>
      <td style="color:var(--text-muted);font-size:12px;">${s.id}</td>
      <td style="font-weight:600;">${s.name}</td>
      <td><input type="number" class="form-input" id="marks_${s.id}" placeholder="0"
           min="0" max="100" style="width:90px;padding:5px 8px;font-size:12px;"
           oninput="validateMarks(this)"></td>
      <td id="grade_${s.id}" style="color:var(--text-muted);font-size:13px;">—</td>
    </tr>`).join('');
}

function validateMarks(input) {
  const max = parseInt(document.getElementById('manualMaxMarks')?.value) || 100;
  let val = parseInt(input.value);
  if (isNaN(val)) { input.value = ''; return; }
  if (val < 0) input.value = 0;
  if (val > max) input.value = max;
  const id = input.id.replace('marks_', '');
  const gradeEl = document.getElementById('grade_' + id);
  if (!gradeEl) return;
  const pct = (parseInt(input.value) / max) * 100;
  if (isNaN(pct)) { gradeEl.textContent = '—'; return; }
  const grade = pct >= 90 ? 'O' : pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B+' : pct >= 50 ? 'B' : pct >= 40 ? 'C' : 'F';
  const color = pct >= 60 ? 'var(--accent-green)' : pct >= 40 ? 'var(--accent-orange)' : 'var(--accent-red)';
  gradeEl.innerHTML = `<span style="color:${color};font-weight:700;">${grade}</span>`;
}

let manualResults = [];

function submitManualResult() {
  const cls = document.getElementById('manualResultClass')?.value;
  const sub = document.getElementById('manualResultSubject')?.value;
  const exam = document.getElementById('manualResultExam')?.value;
  const max = parseInt(document.getElementById('manualMaxMarks')?.value) || 100;
  if (!cls || !sub) { showToast('⚠️ Select class and subject first!'); return; }
  const classStudents = getClassStudents(cls);
  if (!classStudents.length) { showToast('⚠️ No students in this class!'); return; }
  const entries = classStudents.map(s => {
    const marksEl = document.getElementById('marks_' + s.id);
    const marks = marksEl ? parseInt(marksEl.value) : null;
    if (marks === null || isNaN(marks)) return null;
    const pct = (marks / max) * 100;
    const grade = pct >= 90 ? 'O' : pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B+' : pct >= 50 ? 'B' : pct >= 40 ? 'C' : 'F';
    return { id: s.id, name: s.name, marks, max, pct: pct.toFixed(1), grade, pass: pct >= 40 };
  }).filter(Boolean);
  if (!entries.length) { showToast('⚠️ Enter marks for at least one student!'); return; }
  const pass = entries.filter(e => e.pass).length;
  const avg = (entries.reduce((a, b) => a + b.marks, 0) / entries.length).toFixed(1);
  const highest = Math.max(...entries.map(e => e.marks));
  const lowest = Math.min(...entries.map(e => e.marks));
  manualResults.unshift({ cls, sub, exam, max, entries, pass, total: entries.length, avg, highest, lowest, date: new Date().toLocaleDateString('en-IN') });
  renderManualResultsList();
  showToast(`✅ Result submitted! ${pass}/${entries.length} passed · Avg: ${avg}/${max}`);
  document.getElementById('manualResultFormSection').style.display = 'none';
  document.getElementById('manualResultListSection').style.display = 'block';
  document.getElementById('manualTabForm').classList.remove('active');
  document.getElementById('manualTabList').classList.add('active');
}

function renderManualResultsList() {
  const container = document.getElementById('manualResultsList');
  if (!container) return;
  if (!manualResults.length) {
    container.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:40px;">No results submitted yet. Use the Entry Form tab to add results.</div>`;
    return;
  }
  container.innerHTML = manualResults.map((r, idx) => {
    const passRate = ((r.pass / r.total) * 100).toFixed(0);
    const barColor = passRate >= 75 ? 'var(--accent-green)' : passRate >= 50 ? 'var(--accent-orange)' : 'var(--accent-red)';
    return `
    <div class="card" style="margin-bottom:14px;border-left:3px solid ${barColor};">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:12px;">
        <div>
          <div style="font-size:15px;font-weight:700;">${r.sub} — ${r.cls} <span class="badge badge-purple" style="font-size:10px;">${r.exam}</span></div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:3px;">Max Marks: ${r.max} · Submitted: ${r.date}</div>
        </div>
        <div style="display:flex;gap:16px;text-align:center;">
          <div><div style="font-size:18px;font-weight:700;color:var(--accent-cyan)">${r.avg}</div><div style="font-size:10px;color:var(--text-muted)">Avg</div></div>
          <div><div style="font-size:18px;font-weight:700;color:var(--accent-green)">${r.highest}</div><div style="font-size:10px;color:var(--text-muted)">Highest</div></div>
          <div><div style="font-size:18px;font-weight:700;color:var(--accent-red)">${r.lowest}</div><div style="font-size:10px;color:var(--text-muted)">Lowest</div></div>
          <div><div style="font-size:18px;font-weight:700;color:${barColor}">${passRate}%</div><div style="font-size:10px;color:var(--text-muted)">Pass Rate</div></div>
        </div>
        <button class="btn btn-danger btn-xs" onclick="deleteManualResult(${idx})">🗑 Delete</button>
      </div>
      <div style="margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px;"><span>Pass Rate</span><span>${r.pass}/${r.total} passed</span></div>
        <div class="prog-bar"><div class="prog-fill" style="width:${passRate}%;background:${barColor};"></div></div>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>Roll No</th><th>Name</th><th>Marks</th><th>%</th><th>Grade</th><th>Status</th></tr></thead>
        <tbody>${r.entries.map(e => {
      const gc = e.pct >= 60 ? 'badge-green' : e.pct >= 40 ? 'badge-orange' : 'badge-red';
      return `<tr>
            <td style="color:var(--text-muted);font-size:12px;">${e.id}</td>
            <td style="font-weight:600;">${e.name}</td>
            <td><strong>${e.marks}</strong>/${r.max}</td>
            <td>${e.pct}%</td>
            <td><span class="badge ${gc}">${e.grade}</span></td>
            <td><span class="badge ${e.pass ? 'badge-green' : 'badge-red'}">${e.pass ? 'Pass' : 'Fail'}</span></td>
          </tr>`;
    }).join('')}</tbody>
      </table></div>
    </div>`;
  }).join('');
}

function deleteManualResult(idx) {
  manualResults.splice(idx, 1);
  renderManualResultsList();
  showToast('🗑 Result record deleted');
}

function switchManualTab(tab) {
  document.getElementById('manualTabForm').classList.toggle('active', tab === 'form');
  document.getElementById('manualTabList').classList.toggle('active', tab === 'list');
  document.getElementById('manualResultFormSection').style.display = tab === 'form' ? 'block' : 'none';
  document.getElementById('manualResultListSection').style.display = tab === 'list' ? 'block' : 'none';
  if (tab === 'list') renderManualResultsList();
}

function populateResultClassDropdowns() {
  const opts = createdClasses.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
  const upClass = document.getElementById('up-class');
  if (upClass) { upClass.innerHTML = opts; onUploadClassChange(); }
  const manualClass = document.getElementById('manualResultClass');
  if (manualClass) { manualClass.innerHTML = opts; onManualClassChange(); }
}

function onUploadClassChange() {
  const cls = document.getElementById('up-class')?.value;
  if (cls) populateSubjectDropdown('up-subject', cls);
}

function onManualClassChange() {
  const cls = document.getElementById('manualResultClass')?.value;
  if (!cls) return;
  populateSubjectDropdown('manualResultSubject', cls);
  populateManualResultStudents(cls);
}

function populateAttClassDropdown() {
  const sel = document.getElementById('attMarkClass');
  if (!sel) return;
  sel.innerHTML = createdClasses.map(c => `<option value="${c.name}">${c.name} — ${c.year}</option>`).join('');
  onAttClassChange();
}

function onAttClassChange() {
  const cls = document.getElementById('attMarkClass')?.value;
  if (!cls) return;
  populateSubjectDropdown('attMarkSubject', cls);
  populateAttStudentRows(cls);
}

function populateAttStudentRows(className) {
  const tbody = document.getElementById('attMarkStudentRows');
  if (!tbody) return;
  const classStudents = getClassStudents(className);
  if (!classStudents.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:20px;">No students found for ${className}</td></tr>`;
    return;
  }
  tbody.innerHTML = classStudents.map(s => `
    <tr>
      <td style="color:var(--text-muted);font-size:12px;">${s.id}</td>
      <td style="font-weight:600;">${s.name}</td>
      <td style="text-align:center;">
        <div style="display:flex;gap:8px;justify-content:center;">
          <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:12px;">
            <input type="radio" name="att_${s.id}" value="P" checked style="accent-color:var(--accent-green);"> <span style="color:var(--accent-green);">P</span>
          </label>
          <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:12px;">
            <input type="radio" name="att_${s.id}" value="A" style="accent-color:var(--accent-red);"> <span style="color:var(--accent-red);">A</span>
          </label>
          <label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:12px;">
            <input type="radio" name="att_${s.id}" value="L" style="accent-color:var(--accent-orange);"> <span style="color:var(--accent-orange);">L</span>
          </label>
        </div>
      </td>
      <td><input class="form-input" placeholder="Optional note..." style="font-size:11px;padding:4px 8px;width:140px;"></td>
    </tr>`).join('');
}

function markAllPresent() {
  document.querySelectorAll('#attMarkStudentRows input[type=radio][value=P]').forEach(r => r.checked = true);
}
// ===== ADD / REMOVE TEACHER =====

function addNewTeacher() {
  const name = document.getElementById('newTeacherName').value.trim();
  const id = document.getElementById('newTeacherId').value.trim();
  const dept = document.getElementById('newTeacherDept').value;
  const exp = document.getElementById('newTeacherExp').value.trim() || '0 yrs';
  const email = document.getElementById('newTeacherEmail').value.trim();
  const phone = document.getElementById('newTeacherPhone').value.trim();
  const subRaw = document.getElementById('newTeacherSubjects').value.trim();
  const status = document.getElementById('newTeacherStatus').value;
  const qual = document.getElementById('newTeacherQual').value.trim();

  // Validation
  if (!name) { showToast('⚠️ Full Name is required!'); return; }
  if (!id) { showToast('⚠️ Employee ID is required!'); return; }
  if (!email) { showToast('⚠️ Email is required!'); return; }

  // Duplicate ID check
  if (teachers.find(t => t.id === id)) {
    showToast('⚠️ A teacher with this Employee ID already exists!');
    return;
  }

  // Collect checked classes
  const checkedClasses = [...document.querySelectorAll('#newTeacherClassChips input[type=checkbox]:checked')]
    .map(cb => cb.value);

  // Parse subjects
  const subjects = subRaw ? subRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

  // Build teacher object
  const newTeacher = {
    id,
    name,
    dept,
    subjects,
    classes: checkedClasses,
    leavesUsed: 0,
    status,
    exp,
    email,
    phone: phone || 'N/A',
    qual: qual || 'N/A',
  };

  teachers.push(newTeacher);

  // Reset form
  ['newTeacherName', 'newTeacherId', 'newTeacherEmail', 'newTeacherPhone',
    'newTeacherSubjects', 'newTeacherExp', 'newTeacherQual'].forEach(fid => {
      const el = document.getElementById(fid);
      if (el) el.value = '';
    });
  document.querySelectorAll('#newTeacherClassChips input[type=checkbox]')
    .forEach(cb => cb.checked = false);

  closeModal('addTeacherModal');
  initTeachers();
  showToast(`✅ Teacher "${name}" added successfully!`);
}

// ── Remove teacher ──────────────────────────────────────
let teacherToRemoveId = null;

function openRemoveTeacher(id) {
  const t = teachers.find(x => x.id === id);
  if (!t) return;
  teacherToRemoveId = id;
  document.getElementById('removeTeacherConfirmName').textContent =
    `Remove "${t.name}" (${t.id}) from the system?`;
  openModal('removeTeacherModal');
}

function confirmRemoveTeacher() {
  if (!teacherToRemoveId) return;
  const idx = teachers.findIndex(t => t.id === teacherToRemoveId);
  const name = idx > -1 ? teachers[idx].name : '';
  if (idx > -1) teachers.splice(idx, 1);
  teacherToRemoveId = null;
  closeModal('removeTeacherModal');
  initTeachers();
  showToast(`🗑️ Teacher "${name}" removed successfully.`);
}

function submitAttendance() {
  const cls = document.getElementById('attMarkClass')?.value;
  const sub = document.getElementById('attMarkSubject')?.value;
  const date = document.getElementById('attMarkDate')?.value;
  if (!cls || !sub || !date) { showToast('⚠️ Select class, subject and date!'); return; }
  const classStudents = getClassStudents(cls);
  let present = 0, absent = 0, leave = 0;
  classStudents.forEach(s => {
    const sel = document.querySelector(`input[name="att_${s.id}"]:checked`);
    const val = sel ? sel.value : 'P';
    if (val === 'P') present++;
    else if (val === 'A') absent++;
    else leave++;
  });
  showToast(`✅ Attendance saved! ${cls} · ${sub} · ${date} — P:${present} A:${absent} L:${leave}`);
}