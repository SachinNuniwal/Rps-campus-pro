
// ===== DATA =====
const students = [
    { id: '2201001', name: 'Aarav Singh', class: 'CSE-3A', cgpa: 8.9, att: 92, fee: { total: 80000, paid: 80000 }, gender: 'M' },
    { id: '2201002', name: 'Priya Mehta', class: 'CSE-3A', cgpa: 7.8, att: 85, fee: { total: 80000, paid: 60000 }, gender: 'F' },
    { id: '2201003', name: 'Rahul Sharma', class: 'CSE-3A', cgpa: 9.1, att: 95, fee: { total: 80000, paid: 80000 }, gender: 'M' },
    { id: '2201004', name: 'Sneha Gupta', class: 'CSE-3B', cgpa: 7.2, att: 78, fee: { total: 80000, paid: 40000 }, gender: 'F' },
    { id: '2201005', name: 'Arjun Rao', class: 'CSE-3B', cgpa: 5.8, att: 62, fee: { total: 80000, paid: 20000 }, gender: 'M' },
    { id: '2201006', name: 'Kavya Nair', class: 'CSE-3A', cgpa: 8.4, att: 68, fee: { total: 80000, paid: 80000 }, gender: 'F' },
    { id: '2201007', name: 'Vikram Tiwari', class: 'CSE-2A', cgpa: 7.6, att: 80, fee: { total: 75000, paid: 75000 }, gender: 'M' },
    { id: '2201008', name: 'Ananya Sharma', class: 'MCA-1', cgpa: 8.8, att: 90, fee: { total: 90000, paid: 90000 }, gender: 'F' },
    { id: '2201009', name: 'Rohan Verma', class: 'CSE-2A', cgpa: 6.5, att: 73, fee: { total: 75000, paid: 50000 }, gender: 'M' },
    { id: '2201010', name: 'Mohit Batra', class: 'CSE-3B', cgpa: 7.0, att: 73, fee: { total: 80000, paid: 80000 }, gender: 'M' },
];

const teachers = [
    { id: 'TCH-4421', name: 'Dr. Priya Verma', dept: 'CSE', subjects: ['DSA', 'OS'], classes: ['CSE-3A', 'CSE-3B'], leavesUsed: 3, status: 'Active', exp: '12 yrs', email: 'priya@college.edu' },
    { id: 'TCH-3812', name: 'Mr. Arun Kumar', dept: 'CSE', subjects: ['DBMS', 'CN'], classes: ['CSE-2A', 'CSE-3A'], leavesUsed: 1, status: 'Active', exp: '8 yrs', email: 'arun@college.edu' },
    { id: 'TCH-4102', name: 'Ms. Neha Singh', dept: 'CSE', subjects: ['SE', 'Python'], classes: ['MCA-1', 'CSE-2A'], leavesUsed: 5, status: 'Active', exp: '6 yrs', email: 'neha@college.edu' },
    { id: 'TCH-3560', name: 'Prof. R.K. Das', dept: 'Maths', subjects: ['Maths', 'Stats'], classes: ['CSE-2A', 'MCA-1'], leavesUsed: 2, status: 'Active', exp: '15 yrs', email: 'rkdas@college.edu' },
    { id: 'TCH-4890', name: 'Dr. Anita Joshi', dept: 'CSE', subjects: ['AI', 'ML'], classes: ['CSE-3B', 'MCA-1'], leavesUsed: 0, status: 'On Leave', exp: '10 yrs', email: 'anita@college.edu' },
];

const timetables = {
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
};

const pendingLeaves = [
    { teacher: 'Mr. Arun Kumar', type: 'Medical', from: '5 Apr', to: '7 Apr', days: 3, reason: 'Fever & rest' },
    { teacher: 'Ms. Neha Singh', type: 'Personal', from: '10 Apr', to: '10 Apr', days: 1, reason: 'Family event' },
    { teacher: 'Prof. R.K. Das', type: 'Conference', from: '15 Apr', to: '17 Apr', days: 3, reason: 'IEEE Conference' },
    { teacher: 'Dr. Anita Joshi', type: 'Emergency', from: '3 Apr', to: '4 Apr', days: 2, reason: 'Family emergency' },
    { teacher: 'Dr. Priya Verma', type: 'Medical', from: '20 Apr', to: '21 Apr', days: 2, reason: 'Doctor appointment' },
];

const notices = [
    { title: 'Mid-Term Exam Schedule Released', date: '1 Apr 2026', target: 'All', priority: 'Important' },
    { title: 'Faculty Meeting — 5th April, 3PM', date: '31 Mar 2026', target: 'Teachers', priority: 'Urgent' },
    { title: 'Last date for fee submission: 15 April', date: '30 Mar 2026', target: 'Students', priority: 'Important' },
    { title: 'Holiday on 14th April — Dr. Ambedkar Jayanti', date: '28 Mar 2026', target: 'All', priority: 'Normal' },
];

const adminConvs = [
    { name: 'Dr. Priya Verma', role: 'Teacher', last: 'Noted, will submit by Friday', time: '10:30 AM', msgs: [{ sent: false, text: 'Please submit the mid-term marks by this week.', time: 'Yesterday' }, { sent: true, text: 'Noted, will submit by Friday', time: '10:30 AM' }] },
    { name: 'Dept. Principal', role: 'Admin', last: 'Meeting confirmed for 3PM', time: '9:00 AM', msgs: [{ sent: false, text: 'Faculty meeting today at 3PM, please confirm.', time: '9:00 AM' }, { sent: true, text: 'Meeting confirmed for 3PM', time: '9:15 AM' }] },
    { name: 'Aarav Singh', role: 'Student', last: 'Thank you sir!', time: 'Yesterday', msgs: [{ sent: false, text: 'Thank you sir for the scholarship guidance!', time: 'Yesterday' }] },
];

let currentAdminConv = null;
let currentStudentId = null;
let currentTeacherId = null;
let studentChats = {};
let teacherChats = {};
let allStudents = [...students];

// ===== NAVIGATION =====
function navigate(page, el) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const p = document.getElementById('page-' + page);
    if (p) p.classList.add('active');
    if (el) el.classList.add('active');
    const titles = { dashboard: 'Admin Dashboard', analytics: 'Analytics', students: 'Students', teachers: 'Teachers', classes: 'Classes & Groups', results: 'Results Overview', attendance: 'Attendance Reports', fee: 'Fee Management', timetable: 'Timetable', messages: 'Messages', leaves: 'Leave Approvals', notices: 'Notices', settings: 'Settings', studentdetail: 'Student Profile', teacherdetail: 'Teacher Profile' };
    const subs = { dashboard: 'Welcome back, Prof. R.K. Sharma 👋 — Thursday, 2 April 2026' };
    document.getElementById('topbar-title').textContent = titles[page] || page;
    document.getElementById('topbar-sub').textContent = subs[page] || '';
    // Init page data
    const inits = { dashboard: initDashboard, analytics: initAnalytics, students: initStudents, teachers: initTeachers, classes: initClasses, results: initResults, attendance: initAttendance, fee: initFee, timetable: () => loadTimetable('CSE-3A'), messages: initMessages, leaves: initLeaves, notices: initNotices };
    if (inits[page]) setTimeout(inits[page], 50);
}

// ===== TABS =====
function switchTab2(group, name, el) {
    const page = document.getElementById('page-' + group.replace('sd', 'studentdetail').replace('td', 'teacherdetail'));
    if (!page) return;
    page.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    page.querySelectorAll('.tab-pane').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    const pane = document.getElementById(group + '-' + name);
    if (pane) pane.classList.add('active');
}

// ===== DASHBOARD =====
function initDashboard() {
    // Pending leaves
    const pl = document.getElementById('pendingLeavesList');
    if (pl) pl.innerHTML = pendingLeaves.slice(0, 3).map(l => `
    <div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);">
      <div style="width:32px;height:32px;border-radius:8px;background:rgba(255,123,41,.15);display:flex;align-items:center;justify-content:center;font-size:15px;">🌿</div>
      <div style="flex:1;"><div style="font-size:13px;font-weight:600;">${l.teacher}</div><div style="font-size:11px;color:var(--text-secondary);">${l.type} · ${l.from}–${l.to}</div></div>
      <div style="display:flex;gap:5px;"><button class="btn btn-success btn-xs" onclick="approveLeave('${l.teacher}')">✓</button><button class="btn btn-danger btn-xs" onclick="rejectLeave('${l.teacher}')">✗</button></div>
    </div>`).join('');
    // Low att
    const la = document.getElementById('lowAttList');
    if (la) la.innerHTML = students.filter(s => s.att < 75).slice(0, 3).map(s => `
    <div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);">
      <div style="width:32px;height:32px;border-radius:8px;background:rgba(255,71,87,.1);display:flex;align-items:center;justify-content:center;font-size:15px;">⚠️</div>
      <div style="flex:1;"><div style="font-size:13px;font-weight:600;">${s.name}</div><div style="font-size:11px;color:var(--text-secondary);">${s.class}</div></div>
      <span class="badge badge-red">${s.att}%</span>
    </div>`).join('');
    // Fee defaulters
    const fd = document.getElementById('feeDefaultersList');
    if (fd) fd.innerHTML = students.filter(s => s.fee.paid < s.fee.total).slice(0, 3).map(s => `
    <div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);">
      <div style="width:32px;height:32px;border-radius:8px;background:rgba(240,165,0,.1);display:flex;align-items:center;justify-content:center;font-size:15px;">💰</div>
      <div style="flex:1;"><div style="font-size:13px;font-weight:600;">${s.name}</div><div style="font-size:11px;color:var(--text-secondary);">Due: ₹${(s.fee.total - s.fee.paid).toLocaleString()}</div></div>
      <span class="badge badge-orange">${s.class}</span>
    </div>`).join('');
    // Activity log
    const al = document.getElementById('activityLog');
    if (al) al.innerHTML = [
        { a: 'Result uploaded: DSA Mid-Term', p: 'Dr. Priya Verma', t: 'Teacher', time: '10 min ago' },
        { a: 'Attendance marked: CSE-3B', p: 'Mr. Arun Kumar', t: 'Teacher', time: '30 min ago' },
        { a: 'Leave applied: Medical', p: 'Dr. Anita Joshi', t: 'Teacher', time: '1 hr ago' },
        { a: 'Fee paid: ₹40,000', p: 'Arjun Rao (2201005)', t: 'Student', time: '2 hr ago' },
        { a: 'New message sent to CSE-3A', p: 'Ms. Neha Singh', t: 'Teacher', time: '3 hr ago' },
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
function initStudents() {
    renderStudentTable(allStudents);
}

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

function filterStudents(cls) {
    allStudents = cls ? students.filter(s => s.class === cls) : [...students];
    renderStudentTable(allStudents);
}

function searchStudents(q) {
    const filtered = students.filter(s => s.name.toLowerCase().includes(q.toLowerCase()) || s.id.includes(q) || s.class.toLowerCase().includes(q.toLowerCase()));
    renderStudentTable(filtered);
}

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
    <div style="margin-left:auto;display:flex;gap:8px;">
      <button class="btn btn-cyan btn-sm" onclick="msgStudent('${s.id}')">💬 Message</button>
      <button class="btn btn-outline btn-sm" onclick="exportData()">⬇️ Export</button>
    </div>`;

    // Overview
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
          <tr><td style="color:var(--text-muted)">Programme</td><td>B.Tech CSE</td></tr>
          <tr><td style="color:var(--text-muted)">Phone</td><td>+91 9876XXXXXX</td></tr>
          <tr><td style="color:var(--text-muted)">Email</td><td>${s.id}@college.edu</td></tr>
          <tr><td style="color:var(--text-muted)">Address</td><td>Delhi, India</td></tr>
        </tbody></table>
      </div>
      <div class="card"><div class="card-title">📊 Academic Snapshot</div>
        ${['DSA', 'OS', 'DBMS', 'CN', 'SE'].map((sub, i) => { const v = 60 + Math.floor(Math.random() * 35); return `<div style="margin-bottom:10px;"><div style="display:flex;justify-content:space-between;font-size:13px;"><span>${sub}</span><span style="color:var(--accent-cyan)">${v}/100</span></div><div class="prog-bar"><div class="prog-fill" style="width:${v}%;background:${v >= 75 ? 'var(--accent-green)' : v >= 50 ? 'var(--accent-cyan)' : 'var(--accent-red)'}"></div></div></div>`; }).join('')}
      </div>
    </div>`;

    // Result
    document.getElementById('studentResultContent').innerHTML = `
    <div class="card"><div class="card-title">📊 Semester-wise Results</div>
    <div class="table-wrap"><table>
      <thead><tr><th>Semester</th><th>DSA</th><th>OS</th><th>DBMS</th><th>CN</th><th>SE</th><th>SGPA</th><th>Grade</th></tr></thead>
      <tbody>${[1, 2, 3, 4, 5].map(sem => { const sgpa = (7 + Math.random() * 2.5).toFixed(1); return `<tr><td>Sem ${sem}</td>${['--', '--', '--', '--', '--'].map(() => `<td>${55 + Math.floor(Math.random() * 40)}</td>`).join('')}<td><span class="badge badge-cyan">${sgpa}</span></td><td>${sgpa >= 9 ? 'O' : sgpa >= 8 ? 'A+' : sgpa >= 7 ? 'A' : 'B+'}</td></tr>`; }).join('')}
      </tbody>
    </table></div></div>`;

    // Attendance
    document.getElementById('studentAttContent').innerHTML = `
    <div class="mini-stats">
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-green)">${s.att}%</div><div class="mini-stat-lbl">Overall Att.</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-cyan)">${Math.round(s.att * 0.95)}%</div><div class="mini-stat-lbl">Class Att.</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-purple)">${Math.round(s.att * 0.85)}%</div><div class="mini-stat-lbl">Lab Att.</div></div>
    </div>
    <div class="card"><div class="card-title">📅 Subject-wise Attendance</div>
    <div class="table-wrap"><table>
      <thead><tr><th>Subject</th><th>Total Classes</th><th>Attended</th><th>Attendance %</th><th>Status</th></tr></thead>
      <tbody>${['DSA', 'OS', 'DBMS', 'CN', 'SE'].map(sub => { const tot = 40; const att = Math.floor(tot * s.att / 100 + Math.random() * 4 - 2); const pct = Math.round(att / tot * 100); return `<tr><td>${sub}</td><td>${tot}</td><td>${att}</td><td>${pct}%</td><td><span class="badge ${pct >= 75 ? 'badge-green' : 'badge-red'}">${pct >= 75 ? 'OK' : 'Low'}</span></td></tr>`; }).join('')}
      </tbody>
    </table></div></div>`;

    // Fee
    const bal = s.fee.total - s.fee.paid;
    const pct = Math.round(s.fee.paid / s.fee.total * 100);
    document.getElementById('studentFeeContent').innerHTML = `
    <div class="mini-stats">
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--text-primary)">₹${s.fee.total.toLocaleString()}</div><div class="mini-stat-lbl">Total Fee</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-green)">₹${s.fee.paid.toLocaleString()}</div><div class="mini-stat-lbl">Paid</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:${bal > 0 ? 'var(--accent-red)' : 'var(--accent-green)'}">₹${bal.toLocaleString()}</div><div class="mini-stat-lbl">Balance</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-gold)">${pct}%</div><div class="mini-stat-lbl">% Paid</div></div>
    </div>
    <div class="card">
      <div class="card-title">💰 Fee Progress</div>
      <div class="fee-progress"><div class="fee-fill" style="width:${pct}%"></div></div>
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-secondary);margin-top:6px;"><span>Paid: ₹${s.fee.paid.toLocaleString()}</span><span>Balance: ₹${bal.toLocaleString()}</span></div>
      <div class="card-title" style="margin-top:16px;">📋 Payment History</div>
      <div class="table-wrap"><table>
        <thead><tr><th>Date</th><th>Amount</th><th>Mode</th><th>Transaction ID</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>10 Jan 2026</td><td>₹${Math.round(s.fee.paid / 2).toLocaleString()}</td><td>Online</td><td>TXN-9981234</td><td><span class="badge badge-green">Success</span></td></tr>
          ${s.fee.paid > s.fee.total / 2 ? `<tr><td>5 Mar 2026</td><td>₹${Math.round(s.fee.paid / 2).toLocaleString()}</td><td>Cash</td><td>CASH-00412</td><td><span class="badge badge-green">Success</span></td></tr>` : ''}
          ${bal > 0 ? `<tr><td>—</td><td>₹${bal.toLocaleString()}</td><td>—</td><td>—</td><td><span class="badge badge-red">Pending</span></td></tr>` : ''}
        </tbody>
      </table></div>
    </div>`;

    // Init chat
    if (!studentChats[id]) studentChats[id] = [];
    renderStudentChat(id);
}

function renderStudentChat(id) {
    const el = document.getElementById('studentChatMsgs');
    if (!el) return;
    el.innerHTML = studentChats[id].length ? studentChats[id].map(m => `<div class="msg-bubble ${m.sent ? 'sent' : 'recv'}">${m.text}<div class="msg-meta">${m.time}</div></div>`).join('') : '<div style="text-align:center;color:var(--text-muted);padding:30px;">No messages yet. Start a conversation.</div>';
    el.scrollTop = el.scrollHeight;
}

function sendStudentMsg() {
    const txt = document.getElementById('studentMsgInput').value.trim();
    if (!txt || !currentStudentId) return;
    studentChats[currentStudentId] = studentChats[currentStudentId] || [];
    studentChats[currentStudentId].push({ sent: true, text: txt, time: 'Just now' });
    document.getElementById('studentMsgInput').value = '';
    renderStudentChat(currentStudentId);
    showToast('✅ Message sent to student!');
}

function quickStudentMsg() {
    const inp = document.getElementById('studentChatInput');
    const txt = inp.value.trim();
    if (!txt || !currentStudentId) return;
    studentChats[currentStudentId] = studentChats[currentStudentId] || [];
    studentChats[currentStudentId].push({ sent: true, text: txt, time: 'Just now' });
    inp.value = '';
    renderStudentChat(currentStudentId);
}

function msgStudent(id) {
    openStudentDetail(id);
    setTimeout(() => { document.querySelectorAll('#page-studentdetail .tab')[4].click(); }, 100);
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
    <div style="margin-left:auto;display:flex;gap:8px;">
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
      <div class="card"><div class="card-title">📊 Teaching Load Overview</div>
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

    document.getElementById('teacherLeavesContent').innerHTML = `
    <div class="mini-stats">
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-orange)">${t.leavesUsed}</div><div class="mini-stat-lbl">Used</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-green)">${12 - t.leavesUsed}</div><div class="mini-stat-lbl">Available</div></div>
    </div>
    <div class="card"><div class="card-title">📋 Leave History</div>
    <div class="table-wrap"><table>
      <thead><tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th></tr></thead>
      <tbody>
        ${t.leavesUsed > 0 ? `<tr><td>Medical Leave</td><td>15 Jan 2026</td><td>17 Jan 2026</td><td>3</td><td><span class="badge badge-green">Approved</span></td></tr>` : ''}
        ${t.leavesUsed > 1 ? `<tr><td>Personal Leave</td><td>10 Feb 2026</td><td>10 Feb 2026</td><td>1</td><td><span class="badge badge-green">Approved</span></td></tr>` : ''}
        <tr><td colspan="5" style="color:var(--text-muted);text-align:center;padding:12px;">— End of records —</td></tr>
      </tbody>
    </table></div></div>`;

    document.getElementById('teacherPerfContent').innerHTML = `
    <div class="mini-stats">
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-cyan)">${(8 + Math.random()).toFixed(1)}</div><div class="mini-stat-lbl">Avg Student CGPA</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-green)">${88 + Math.floor(Math.random() * 8)}%</div><div class="mini-stat-lbl">Pass Rate</div></div>
      <div class="mini-stat"><div class="mini-stat-val" style="color:var(--accent-gold)">${(4.2 + Math.random() * .6).toFixed(1)}/5</div><div class="mini-stat-lbl">Student Rating</div></div>
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

function sendTeacherMsg() {
    const txt = document.getElementById('teacherMsgInput').value.trim();
    if (!txt || !currentTeacherId) return;
    teacherChats[currentTeacherId] = teacherChats[currentTeacherId] || [];
    teacherChats[currentTeacherId].push({ sent: true, text: txt, time: 'Just now' });
    document.getElementById('teacherMsgInput').value = '';
    renderTeacherChat(currentTeacherId);
    showToast('✅ Message sent to teacher!');
}

function quickTeacherMsg() {
    const inp = document.getElementById('teacherChatInput');
    const txt = inp.value.trim();
    if (!txt || !currentTeacherId) return;
    teacherChats[currentTeacherId] = teacherChats[currentTeacherId] || [];
    teacherChats[currentTeacherId].push({ sent: true, text: txt, time: 'Just now' });
    inp.value = '';
    renderTeacherChat(currentTeacherId);
}

function msgTeacher(id) {
    openTeacherDetail(id);
    setTimeout(() => { document.querySelectorAll('#page-teacherdetail .tab')[5].click(); }, 100);
}

// ===== CLASSES =====
function initClasses() {
    const grid = document.getElementById('classCardsGrid');
    if (!grid) return;
    const classes = [
        { name: 'CSE-3A', year: '3rd Year', teacher: 'Dr. Priya Verma', students: 42, att: 91, cgpa: 8.4, color: 'var(--accent-cyan)' },
        { name: 'CSE-3B', year: '3rd Year', teacher: 'Mr. Arun Kumar', students: 38, att: 81, cgpa: 7.9, color: 'var(--accent-gold)' },
        { name: 'CSE-2A', year: '2nd Year', teacher: 'Ms. Neha Singh', students: 45, att: 84, cgpa: 7.6, color: 'var(--accent-purple)' },
        { name: 'MCA-1', year: '1st Year', teacher: 'Prof. R.K. Das', students: 30, att: 88, cgpa: 8.5, color: 'var(--accent-green)' },
        { name: 'CSE-4A', year: '4th Year', teacher: 'Dr. Anita Joshi', students: 40, att: 86, cgpa: 8.1, color: 'var(--accent-orange)' },
    ];
    grid.innerHTML = classes.map(c => `
    <div class="card" style="border-color:${c.color}22;margin-bottom:0;cursor:pointer;" onmouseover="this.style.borderColor='${c.color}'" onmouseout="this.style.borderColor='${c.color}22'">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
        <div style="width:44px;height:44px;border-radius:12px;background:${c.color}22;border:1px solid ${c.color}44;display:flex;align-items:center;justify-content:center;font-family:'Rajdhani',sans-serif;font-size:15px;font-weight:700;color:${c.color};">${c.name}</div>
        <div><div style="font-family:'Rajdhani',sans-serif;font-size:17px;font-weight:700;">${c.name}</div><div style="font-size:12px;color:var(--text-secondary);">${c.year} · ${c.students} students</div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">
        <div style="background:var(--bg-secondary);border-radius:8px;padding:10px;text-align:center;"><div style="font-family:'Rajdhani',sans-serif;font-size:20px;font-weight:700;color:${c.color}">${c.cgpa}</div><div style="font-size:10px;color:var(--text-secondary)">Avg CGPA</div></div>
        <div style="background:var(--bg-secondary);border-radius:8px;padding:10px;text-align:center;"><div style="font-family:'Rajdhani',sans-serif;font-size:20px;font-weight:700;color:${c.att >= 85 ? 'var(--accent-green)' : 'var(--accent-orange)'}">${c.att}%</div><div style="font-size:10px;color:var(--text-secondary)">Attendance</div></div>
      </div>
      <div style="font-size:12px;color:var(--text-secondary);margin-bottom:12px;">Class Teacher: <span style="color:var(--text-primary)">${c.teacher}</span></div>
      <div style="display:flex;gap:6px;">
        <button class="btn btn-outline btn-xs" onclick="filterStudents('${c.name}');navigate('students',null)">👩‍🎓 Students</button>
        <button class="btn btn-outline btn-xs" onclick="loadTimetable('${c.name}');navigate('timetable',null)">🗓️ Timetable</button>
        <button class="btn btn-outline btn-xs" onclick="openModal('newMsgModal')">💬 Msg Group</button>
      </div>
    </div>`).join('');
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
        { cls: 'CSE-3A', sub: 'DSA', exam: 'Mid-Term', tot: 42, pass: 96, avg: 78 }, { cls: 'CSE-3B', sub: 'OS', exam: 'Mid-Term', tot: 38, pass: 89, avg: 71 },
        { cls: 'CSE-2A', sub: 'DBMS', exam: 'End-Term', tot: 45, pass: 93, avg: 74 }, { cls: 'MCA-1', sub: 'Python', exam: 'Quiz', tot: 30, pass: 97, avg: 85 },
        { cls: 'CSE-3A', sub: 'CN', exam: 'End-Term', tot: 42, pass: 91, avg: 80 }, { cls: 'CSE-3B', sub: 'SE', exam: 'Assignment', tot: 38, pass: 100, avg: 88 },
    ].map(r => `<tr><td>${r.cls}</td><td>${r.sub}</td><td><span class="badge badge-purple">${r.exam}</span></td><td>${r.tot}</td><td>${r.pass}%</td><td>${r.avg}/100</td><td><span class="badge badge-green">Published</span></td><td><button class="btn btn-outline btn-xs" onclick="showToast('Viewing '+r.sub+' results')">View</button></td></tr>`).join('');
}

// ===== ATTENDANCE =====
function initAttendance() {
    const c1 = document.getElementById('attByClassChart');
    if (c1 && !c1._chart) c1._chart = new Chart(c1.getContext('2d'), { type: 'bar', data: { labels: ['CSE-3A', 'CSE-3B', 'CSE-2A', 'MCA-1', 'CSE-4A'], datasets: [{ label: 'Attendance %', data: [91, 81, 84, 88, 86], backgroundColor: ['rgba(57,211,83,.4)', 'rgba(255,71,87,.4)', 'rgba(0,212,255,.4)', 'rgba(57,211,83,.4)', 'rgba(0,212,255,.4)'], borderColor: ['#39d353', '#ff4757', '#00d4ff', '#39d353', '#00d4ff'], borderWidth: 2, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 60, max: 100, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } }, x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } } } } });
    const c2 = document.getElementById('attMonthlyChart');
    if (c2 && !c2._chart) c2._chart = new Chart(c2.getContext('2d'), { type: 'line', data: { labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], datasets: [{ label: 'Avg Attendance', data: [88, 85, 82, 86, 84, 79, 87, 89, 85], borderColor: '#00d4ff', backgroundColor: 'rgba(0,212,255,.1)', tension: .4, fill: true, pointRadius: 4, pointBackgroundColor: '#00d4ff' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 70, max: 100, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } }, x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } } } } });
    const lb = document.getElementById('lowAttBody');
    if (lb) lb.innerHTML = students.filter(s => s.att < 80).map(s => `<tr><td style="color:var(--text-muted)">${s.id}</td><td><a href="#" onclick="openStudentDetail('${s.id}')" style="color:var(--accent-cyan);text-decoration:none;">${s.name}</a></td><td>${s.class}</td><td><span class="badge ${s.att < 75 ? 'badge-red' : 'badge-orange'}">${s.att}%</span></td><td>Class Teacher</td><td style="display:flex;gap:5px;"><button class="btn btn-outline btn-xs" onclick="msgStudent('${s.id}')">📨 Alert</button></td></tr>`).join('');
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
    const ft = document.getElementById('feeTableBody');
    if (ft) ft.innerHTML = students.map(s => {
        const bal = s.fee.total - s.fee.paid;
        const pct = Math.round(s.fee.paid / s.fee.total * 100);
        return `<tr><td style="color:var(--text-muted)">${s.id}</td>
    <td><a href="#" onclick="openStudentDetail('${s.id}')" style="color:var(--accent-cyan);text-decoration:none;">${s.name}</a></td>
    <td>${s.class}</td><td>₹${s.fee.total.toLocaleString()}</td>
    <td style="color:var(--accent-green)">₹${s.fee.paid.toLocaleString()}</td>
    <td style="color:${bal > 0 ? 'var(--accent-red)' : 'var(--accent-green)'}">₹${bal.toLocaleString()}</td>
    <td style="color:var(--text-muted);font-size:12px;">10 Jan 2026</td>
    <td><span class="badge ${bal === 0 ? 'badge-green' : bal > s.fee.total / 2 ? 'badge-red' : 'badge-orange'}">${bal === 0 ? 'Paid' : bal > s.fee.total / 2 ? 'Defaulter' : 'Partial'}</span></td>
    <td><button class="btn btn-outline btn-xs" onclick="openModal('addFeeModal')">Record</button></td></tr>`;
    }).join('');
}

// ===== TIMETABLE =====
function loadTimetable(cls) {
    const el = document.getElementById('timetableContent');
    if (!el) return;
    const tt = timetables[cls] || timetables['CSE-3A'];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const periods = ['P1 8:00–9:00', 'P2 9:00–10:00', 'P3 10:00–11:00', 'Break 11:00–11:30', 'P4 11:30–12:30', 'P5 1:30–2:30', 'P6 2:30–3:30'];
    let html = `<div style="font-family:'Rajdhani',sans-serif;font-size:17px;font-weight:700;margin-bottom:14px;">🗓️ ${cls} — Weekly Timetable</div>`;
    html += '<div style="overflow-x:auto;"><table style="width:100%;"><thead><tr><th style="min-width:120px;"></th>';
    days.forEach(d => html += `<th style="text-align:center;min-width:130px;">${d}</th>`);
    html += '</tr></thead><tbody>';
    periods.forEach((p, pi) => {
        const isBreak = p.includes('Break');
        html += `<tr><td style="color:var(--text-muted);font-size:11px;white-space:nowrap;padding:6px 12px;">${p}</td>`;
        if (isBreak) {
            html += `<td colspan="${days.length}" style="text-align:center;"><div class="tt-cell tt-break" style="text-align:center;">☕ Break</div></td>`;
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
}

// ===== MESSAGES =====
function initMessages() {
    const inbox = document.getElementById('adminInboxList');
    if (!inbox) return;
    inbox.innerHTML = adminConvs.map((c, i) => `
    <div onclick="openAdminConv(${i})" style="display:flex;align-items:center;gap:12px;padding:11px;border-radius:10px;cursor:pointer;border:1px solid var(--border);margin-bottom:8px;transition:.2s;" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background=''">
      <div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--accent-gold),var(--accent-orange));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:#000;">${c.name[0]}</div>
      <div style="flex:1;"><div style="font-size:13px;font-weight:600;">${c.name}</div><div style="font-size:11px;color:var(--text-secondary);">${c.last}</div></div>
      <div style="text-align:right;"><div style="font-size:10px;color:var(--text-muted);">${c.time}</div><span class="badge badge-${c.role === 'Teacher' ? 'gold' : c.role === 'Admin' ? 'cyan' : 'purple'}" style="margin-top:4px;">${c.role}</span></div>
    </div>`).join('');
}

function openAdminConv(i) {
    currentAdminConv = i;
    const c = adminConvs[i];
    document.getElementById('adminChatTitle').textContent = '💬 ' + c.name;
    const el = document.getElementById('adminChatMsgs');
    el.innerHTML = c.msgs.map(m => `<div class="msg-bubble ${m.sent ? 'sent' : 'recv'}">${m.text}<div class="msg-meta">${m.time}</div></div>`).join('');
    el.scrollTop = el.scrollHeight;
}

function sendAdminMsg() {
    const inp = document.getElementById('adminChatInput');
    const txt = inp.value.trim();
    if (!txt || currentAdminConv === null) return;
    adminConvs[currentAdminConv].msgs.push({ sent: true, text: txt, time: 'Just now' });
    openAdminConv(currentAdminConv);
    inp.value = '';
}

// ===== LEAVES =====
function initLeaves() {
    const plb = document.getElementById('pendingLeavesBody');
    if (plb) plb.innerHTML = pendingLeaves.map((l, i) => `<tr>
    <td>${l.teacher}</td><td><span class="badge badge-orange">${l.type}</span></td>
    <td>${l.from}</td><td>${l.to}</td><td>${l.days}</td>
    <td style="color:var(--text-secondary)">${l.reason}</td>
    <td style="display:flex;gap:5px;">
      <button class="btn btn-success btn-xs" onclick="approveLeave('${l.teacher}')">✓ Approve</button>
      <button class="btn btn-danger btn-xs" onclick="rejectLeave('${l.teacher}')">✗ Reject</button>
    </td>
  </tr>`).join('');
    const lhb = document.getElementById('leaveHistoryBody');
    if (lhb) lhb.innerHTML = [
        { t: 'Dr. Priya Verma', type: 'Medical', from: '15 Jan', to: '17 Jan', days: 3, status: 'Approved' },
        { t: 'Mr. Arun Kumar', type: 'Personal', from: '5 Feb', to: '5 Feb', days: 1, status: 'Approved' },
        { t: 'Ms. Neha Singh', type: 'Conference', from: '20 Mar', to: '22 Mar', days: 3, status: 'Approved' },
        { t: 'Dr. Anita Joshi', type: 'Emergency', from: '28 Feb', to: '1 Mar', days: 2, status: 'Rejected' },
    ].map(l => `<tr><td>${l.t}</td><td>${l.type}</td><td>${l.from}</td><td>${l.to}</td><td>${l.days}</td><td><span class="badge ${l.status === 'Approved' ? 'badge-green' : 'badge-red'}">${l.status}</span></td><td>Prof. R.K. Sharma</td></tr>`).join('');
}

function approveLeave(name) { showToast('✅ Leave approved for ' + name); }
function rejectLeave(name) { showToast('❌ Leave rejected for ' + name); }

// ===== NOTICES =====
function initNotices() {
    renderNotices();
}

function renderNotices() {
    const el = document.getElementById('noticesList');
    if (!el) return;
    el.innerHTML = notices.map((n, i) => `
    <div style="padding:13px;border:1px solid var(--border);border-radius:10px;margin-bottom:10px;border-left:3px solid ${n.priority === 'Urgent' ? 'var(--accent-red)' : n.priority === 'Important' ? 'var(--accent-gold)' : 'var(--border)'}">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
        <div style="font-size:13px;font-weight:700;">${n.title}</div>
        <span class="badge ${n.priority === 'Urgent' ? 'badge-red' : n.priority === 'Important' ? 'badge-gold' : 'badge-cyan'}">${n.priority}</span>
      </div>
      <div style="font-size:11px;color:var(--text-secondary);">${n.date} · Target: ${n.target}</div>
      <button class="btn btn-danger btn-xs" onclick="deleteNotice(${i})" style="margin-top:8px;">🗑 Delete</button>
    </div>`).join('');
}

function postNotice() {
    const t = document.getElementById('noticeTitle').value.trim();
    const c = document.getElementById('noticeContent').value.trim();
    if (!t || !c) { showToast('⚠️ Fill in all fields!'); return; }
    notices.unshift({ title: t, date: 'Today', target: document.getElementById('noticeTarget').value, priority: 'Normal' });
    document.getElementById('noticeTitle').value = '';
    document.getElementById('noticeContent').value = '';
    renderNotices();
    showToast('✅ Notice posted to all!');
}

function deleteNotice(i) { notices.splice(i, 1); renderNotices(); showToast('🗑 Notice deleted.'); }

// ===== ANALYTICS FILTER =====
function updateAnalytics(cls) { showToast('📊 Filtering for ' + cls); }

// ===== UTILS =====
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function showToast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 3000); }
function exportData() { showToast('⬇️ Exporting data as CSV...'); }
document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', function (e) { if (e.target === this) this.classList.remove('open'); }));

// INIT
window.onload = () => {
    initDashboard();
    initStudents();
    initTeachers();
};
