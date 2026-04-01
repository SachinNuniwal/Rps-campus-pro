
/* ── Login / Logout ── */
function doLogin() {
    document.getElementById('login-page').classList.add('hidden');
    setTimeout(() => {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('dashboard-page').style.display = 'flex';
        document.getElementById('dashboard-page').classList.add('active');
        initCharts();
        buildAttGrid();
        buildChatList();
        buildChatMessages();
    }, 600);
}
function doLogout() {
    document.getElementById('dashboard-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'block';
    document.getElementById('login-page').classList.remove('hidden');
}

/* ── Page Navigation ── */
const titles = { dashboard: 'Dashboard', result: 'Exam Results', attendance: 'Attendance', mygroup: 'My Groups', chat: 'Messages', fee: 'Fee Details', brochure: 'College Brochure', achievement: 'Achievements', settings: 'Settings' };
const subs = { dashboard: 'Welcome back, Rahul 👋', result: 'Your academic performance', attendance: 'Track your classes', mygroup: 'Your academic groups', chat: 'Stay connected', fee: 'Fee & payment status', brochure: 'Official publications', achievement: 'Your milestones', settings: 'Manage preferences' };
function showPage(id, el) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('page-' + id).classList.add('active');
    el.classList.add('active');
    document.getElementById('header-title').textContent = titles[id] || id;
    document.getElementById('header-sub').textContent = subs[id] || '';
    if (window.innerWidth <= 900) document.getElementById('sidebar').classList.remove('open');
}

/* ── Refresh ── */
function refreshData() {
    const btn = document.querySelector('.refresh-btn i');
    btn.style.transition = 'transform 0.6s';
    btn.style.transform = 'rotate(360deg)';
    setTimeout(() => btn.style.transform = '', 700);
}

/* ── Charts ── */
let chartsInit = false;
function initCharts() {
    if (chartsInit) return; chartsInit = true;
    const cOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'DM Sans' } } } } };
    const gridCol = 'rgba(255,255,255,0.06)';

    // Attendance donut
    new Chart(document.getElementById('attChart'), { type: 'doughnut', data: { labels: ['Present', 'Absent', 'Medical'], datasets: [{ data: [82, 13, 5], backgroundColor: ['#4481eb', '#f87171', '#f59e0b'], borderWidth: 0, hoverOffset: 6 }] }, options: { ...cOpts, cutout: '72%' } });

    // Result line
    new Chart(document.getElementById('resultChart'), { type: 'line', data: { labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'], datasets: [{ label: 'CGPA', data: [7.8, 8.1, 8.6, 8.9, 8.4], borderColor: '#04befe', backgroundColor: 'rgba(4,190,254,0.1)', tension: 0.4, fill: true, pointBackgroundColor: '#04befe', pointRadius: 5 }] }, options: { ...cOpts, scales: { x: { grid: { color: gridCol }, ticks: { color: '#94a3b8' } }, y: { min: 7, max: 10, grid: { color: gridCol }, ticks: { color: '#94a3b8' } } } } });

    // Growth bar
    new Chart(document.getElementById('growthChart'), { type: 'bar', data: { labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'], datasets: [{ label: 'Score', data: [72, 78, 75, 82, 88, 84, 90], backgroundColor: 'rgba(68,129,235,0.7)', borderRadius: 8, hoverBackgroundColor: '#4481eb' }] }, options: { ...cOpts, scales: { x: { grid: { color: gridCol }, ticks: { color: '#94a3b8' } }, y: { grid: { color: gridCol }, ticks: { color: '#94a3b8' } } } } });

    // Subject chart
    new Chart(document.getElementById('subjectChart'), { type: 'bar', data: { labels: ['Data Structures', 'OS', 'DBMS', 'Networks', 'Soft. Engg.'], datasets: [{ label: 'Marks', data: [96, 85, 89, 79, 84], backgroundColor: ['#4481eb', '#04befe', '#22c55e', '#f59e0b', '#a78bfa'], borderRadius: 8 }] }, options: { ...cOpts, scales: { x: { grid: { color: gridCol }, ticks: { color: '#94a3b8' } }, y: { min: 60, max: 100, grid: { color: gridCol }, ticks: { color: '#94a3b8' } } } } });

    // Attendance trend
    new Chart(document.getElementById('attTrendChart'), { type: 'line', data: { labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'], datasets: [{ label: 'Attendance %', data: [90, 88, 85, 80, 78, 82, 84], borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', tension: 0.4, fill: true, pointBackgroundColor: '#22c55e', pointRadius: 4 }] }, options: { ...cOpts, scales: { x: { grid: { color: gridCol }, ticks: { color: '#94a3b8' } }, y: { min: 60, max: 100, grid: { color: gridCol }, ticks: { color: '#94a3b8' } } } } });
}

/* ── Attendance Grid ── */
function buildAttGrid() {
    const subjects = [
        { name: 'Data Structures & Algo', total: 60, present: 52 },
        { name: 'Operating Systems', total: 58, present: 44 },
        { name: 'Database Management', total: 55, present: 50 },
        { name: 'Computer Networks', total: 60, present: 46 },
        { name: 'Software Engineering', total: 50, present: 42 },
        { name: 'Machine Learning', total: 45, present: 38 },
    ];
    const g = document.getElementById('attGrid');
    g.innerHTML = subjects.map(s => {
        const pct = Math.round(s.present / s.total * 100);
        const danger = pct < 75;
        return `<div class="att-card">
        <div class="att-subject">${s.name}</div>
        <div class="att-percent" style="color:${danger ? '#f87171' : '#22c55e'}">${pct}%</div>
        <div class="att-bar-wrap"><div class="att-bar${danger ? ' danger' : ''}" style="width:${pct}%"></div></div>
        <div class="att-classes">${s.present}/${s.total} classes attended ${danger ? '⚠️ Low' : ''}</div>
      </div>`;
    }).join('');
}

/* ── Chat ── */
const chatPeople = [
    { init: 'PK', name: 'Prof. Pankaj Kumar', msg: 'Assignment due tomorrow' },
    { init: 'AN', name: 'Ankit Nair', msg: 'Bhai notes share kar' },
    { init: 'SC', name: 'Study Circle', msg: 'Test at 8pm tonight' },
    { init: 'DR', name: 'Dr. Rekha Gupta', msg: 'Lab report submit karo' },
    { init: 'RV', name: 'Rohan Verma', msg: 'Project meeting?' },
];
function buildChatList() {
    document.getElementById('chatList').innerHTML = chatPeople.map((p, i) => `
      <div class="chat-list-item${i === 0 ? ' active' : ''}" onclick="selectChat(this,'${p.name}','${p.init}')">
        <div class="chat-av">${p.init}</div>
        <div><div class="chat-name">${p.name}</div><div class="chat-preview">${p.msg}</div></div>
      </div>`).join('');
}
function selectChat(el, name, init) {
    document.querySelectorAll('.chat-list-item').forEach(x => x.classList.remove('active'));
    el.classList.add('active');
    document.querySelector('.chat-header-w .chat-av').textContent = init;
    document.querySelector('.chat-header-w .chat-name').textContent = name;
}
const msgs = [
    { mine: false, text: 'Rahul, assignment submit karna mat bhoolna. Deadline kal 11:59 PM hai.', time: '10:30 AM' },
    { mine: true, text: 'Ji sir, almost complete ho gaya hai. Kal subah tak submit kar dunga.', time: '10:35 AM' },
    { mine: false, text: 'Theek hai. Koi doubt ho toh office hours mein aana.', time: '10:36 AM' },
    { mine: true, text: 'Sure sir, thank you!', time: '10:40 AM' },
];
function buildChatMessages() {
    document.getElementById('chatMessages').innerHTML = msgs.map(m => `
      <div class="msg ${m.mine ? 'mine' : 'theirs'}">
        <div class="msg-bubble">${m.text}</div>
        <div class="msg-time">${m.time}</div>
      </div>`).join('');
}
function sendMsg() {
    const inp = document.getElementById('chatInput');
    if (!inp.value.trim()) return;
    const box = document.getElementById('chatMessages');
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    box.innerHTML += `<div class="msg mine"><div class="msg-bubble">${inp.value}</div><div class="msg-time">${now}</div></div>`;
    inp.value = '';
    box.scrollTop = box.scrollHeight;
}