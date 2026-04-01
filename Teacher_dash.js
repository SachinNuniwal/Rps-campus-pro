
// =========== NAVIGATION ===========
function navigate(page, el) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    if (el) el.classList.add('active');
    const titles = { dashboard: 'Dashboard', result: 'Upload Results', attendance: 'Attendance', group: 'My Groups', messages: 'Messages', leaves: 'Leave Management', subjects: 'Subject Performance', profile: 'My Profile' };
    const subs = { dashboard: 'Welcome back, Dr. Priya Verma 👋', result: 'Upload and manage student results', attendance: 'Mark and track attendance', group: 'Manage class and lab groups', messages: 'Personal messages', leaves: 'Apply for leave', subjects: 'Analytics per subject', profile: 'Your profile' };
    document.getElementById('topbar-title').textContent = titles[page] || page;
    document.getElementById('topbar-sub').textContent = subs[page] || '';
    if (page === 'attendance') buildAttTable();
    if (page === 'messages') buildConvList();
    if (page === 'subjects') updateSubjPage();
}

// =========== CHARTS ===========
const subjectData = {
    'CSE-3A': { labels: ['DSA', 'OS', 'DBMS', 'CN', 'SE'], data: [78, 72, 85, 68, 81] },
    'CSE-3B': { labels: ['DSA', 'OS', 'DBMS', 'CN', 'SE'], data: [71, 80, 74, 77, 66] },
    'CSE-2A': { labels: ['Python', 'Maths', 'EVS', 'C++', 'Physics'], data: [82, 65, 90, 75, 70] },
    'MCA-1': { labels: ['DBMS', 'SE', 'Python', 'AI', 'Stats'], data: [88, 76, 92, 71, 84] }
};

let subjectChart, attDonutChart, cgpaLineChart, subjectBarChart;

function initDashboardCharts() {
    // Subject Performance Radar
    const sctx = document.getElementById('subjectChart').getContext('2d');
    const sd = subjectData['CSE-3A'];
    subjectChart = new Chart(sctx, {
        type: 'bar',
        data: { labels: sd.labels, datasets: [{ label: 'Avg Marks', data: sd.data, backgroundColor: 'rgba(0,212,255,.25)', borderColor: '#00d4ff', borderWidth: 2, borderRadius: 6 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } }, x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } } } }
    });
    buildSubjectPerfTable('CSE-3A');

    // Attendance Donut
    const actx = document.getElementById('attDonut').getContext('2d');
    attDonutChart = new Chart(actx, {
        type: 'doughnut',
        data: { labels: ['Present', 'Absent', 'Medical'], datasets: [{ data: [87, 9, 4], backgroundColor: ['rgba(0,212,255,.7)', 'rgba(255,71,87,.7)', 'rgba(255,123,41,.7)'], borderColor: ['#00d4ff', '#ff4757', '#ff7b29'], borderWidth: 2 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#8b949e', font: { size: 12 } } } } }
    });

    // CGPA Line
    const lctx = document.getElementById('cgpaLine').getContext('2d');
    cgpaLineChart = new Chart(lctx, {
        type: 'line',
        data: { labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'], datasets: [{ label: 'Avg CGPA', data: [7.8, 8.1, 8.6, 8.9, 8.4], borderColor: '#00d4ff', backgroundColor: 'rgba(0,212,255,.1)', tension: .4, pointRadius: 5, pointBackgroundColor: '#00d4ff', fill: true }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 7, max: 10, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } }, x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } } } }
    });
}

function updateSubjectChart() {
    const cls = document.querySelector('input[name="cls"]:checked').value;
    const sd = subjectData[cls];
    subjectChart.data.labels = sd.labels;
    subjectChart.data.datasets[0].data = sd.data;
    subjectChart.update();
    buildSubjectPerfTable(cls);
}

function buildSubjectPerfTable(cls) {
    const sd = subjectData[cls];
    const tbody = document.getElementById('subjectPerfTable');
    let html = '<div style="padding:4px 0;">';
    sd.labels.forEach((l, i) => {
        const pct = sd.data[i];
        const color = pct >= 80 ? 'var(--accent-green)' : pct >= 65 ? 'var(--accent-cyan)' : 'var(--accent-red)';
        html += `<div style="margin-bottom:14px;"><div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600;"><span>${l}</span><span style="color:${color}">${pct}/100</span></div><div class="subj-bar"><div class="subj-bar-fill" style="width:${pct}%;background:${color};"></div></div></div>`;
    });
    html += '</div>';
    tbody.innerHTML = html;
}

function initSubjectBarChart(cls) {
    const sd = subjectData[cls || 'CSE-3A'];
    const ctx = document.getElementById('subjectBarChart').getContext('2d');
    if (subjectBarChart) subjectBarChart.destroy();
    subjectBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sd.labels, datasets: [
                { label: 'Avg Marks', data: sd.data, backgroundColor: 'rgba(0,212,255,.3)', borderColor: '#00d4ff', borderWidth: 2, borderRadius: 8 },
                { label: 'Pass %', data: sd.data.map(v => Math.min(100, v + Math.floor(Math.random() * 10))), backgroundColor: 'rgba(57,211,83,.2)', borderColor: '#39d353', borderWidth: 2, borderRadius: 8 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#8b949e' } } }, scales: { y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } }, x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } } } }
    });
}

function updateSubjPage() {
    const cls = document.querySelector('input[name="scls"]:checked').value;
    document.getElementById('subjPageTitle').textContent = cls;
    initSubjectBarChart(cls);
    buildSubjSummary(cls);
}

function buildSubjSummary(cls) {
    const sd = subjectData[cls];
    const tbody = document.getElementById('subjSummaryBody');
    let html = '';
    sd.labels.forEach((l, i) => {
        const avg = sd.data[i];
        const high = Math.min(100, avg + Math.floor(Math.random() * 15) + 5);
        const low = Math.max(0, avg - Math.floor(Math.random() * 25) - 5);
        const pass = Math.min(100, avg + Math.floor(Math.random() * 10));
        const trend = avg >= 75 ? '📈 Rising' : '📉 Dip';
        const badge = avg >= 80 ? 'badge-green' : avg >= 65 ? 'badge-cyan' : 'badge-red';
        html += `<tr><td>${l}</td><td><span class="badge ${badge}">${avg}</span></td><td>${high}</td><td>${low}</td><td>${pass}%</td><td>${trend}</td></tr>`;
    });
    tbody.innerHTML = html;
}

// =========== ATTENDANCE TABLE ===========
const students = ['Aarav Singh', 'Priya Mehta', 'Rahul Sharma', 'Sneha Gupta', 'Arjun Rao', 'Kavya Nair', 'Vikram Tiwari', 'Ananya Sharma', 'Rohan Verma', 'Mohit Batra'];

function buildAttTable() {
    const tbody = document.getElementById('attTableBody');
    const lbody = document.getElementById('labAttBody');
    let html = '', lhtml = '';
    students.forEach((s, i) => {
        const id = `att_${i}`;
        html += `<tr><td>220100${i + 1}</td><td>${s}</td>
      <td><input type="radio" name="${id}" value="present" onclick="updateStatus(${i},'present')" checked></td>
      <td><input type="radio" name="${id}" value="absent" onclick="updateStatus(${i},'absent')"></td>
      <td><input type="radio" name="${id}" value="medical" onclick="updateStatus(${i},'medical')"></td>
      <td><span class="badge badge-green" id="status_${i}">Present</span></td></tr>`;
        lhtml += `<tr><td>220100${i + 1}</td><td>${s}</td><td>${i % 2 === 0 ? 'Batch A' : 'Batch B'}</td>
      <td><input type="radio" name="lab_${i}" value="present" checked></td>
      <td><input type="radio" name="lab_${i}" value="absent"></td>
      <td><span class="badge badge-green">Present</span></td></tr>`;
    });
    if (tbody) tbody.innerHTML = html;
    if (lbody) lbody.innerHTML = lhtml;
    buildHeatmap();
}

function updateStatus(i, val) {
    const el = document.getElementById('status_' + i);
    if (!el) return;
    const map = { present: ['badge-green', 'Present'], absent: ['badge-red', 'Absent'], medical: ['badge-orange', 'Medical'] };
    el.className = 'badge ' + map[val][0];
    el.textContent = map[val][1];
}

function markAll(type) {
    students.forEach((_, i) => {
        const r = document.querySelector(`input[name="att_${i}"][value="${type}"]`);
        if (r) { r.checked = true; updateStatus(i, type); }
    });
}

function buildHeatmap() {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const grid = document.getElementById('attHeatmap');
    if (!grid) return;
    let html = days.map(d => `<div class="att-day header">${d}</div>`).join('');
    for (let i = 0; i < 35; i++) {
        const r = Math.random();
        const cls = i < 2 ? 'empty' : r > .85 ? 'absent' : r > .75 ? 'medical' : 'present';
        const label = i < 2 ? '' : (i - 1);
        html += `<div class="att-day ${cls}" title="Day ${label}">${label}</div>`;
    }
    grid.innerHTML = html;
}

// =========== TABS ===========
function switchTab(group, name, el) {
    document.querySelectorAll(`#page-${group === 'att' ? 'attendance' : group} .tab`).forEach(t => t.classList.remove('active'));
    document.querySelectorAll(`#page-${group === 'att' ? 'attendance' : group} .tab-pane`).forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    document.getElementById(group + '-' + name).classList.add('active');
    if (name === 'class' || name === 'lab') buildAttTable();
}

// =========== GROUP CHAT ===========
const groupMessages = {
    'CSE-3A General': [{ from: 'Dr. Priya Verma', text: 'Please submit your assignments by Friday.', time: '9:12 AM', sent: true }, { from: 'Aarav Singh', text: 'Understood ma\'am, will submit.', time: '9:20 AM', sent: false }],
    'CSE-3B Lab Group': [{ from: 'Dr. Priya Verma', text: 'Submit DSA lab files by this Friday.', time: 'Yesterday', sent: true }],
    'MCA-1 Batch': [{ from: 'Dr. Priya Verma', text: 'I will be on leave on 5th April. Self-study chapters 6-8.', time: '2 days ago', sent: true }]
};
let currentGroup = null;

function openGroupChat(name) {
    currentGroup = name;
    const area = document.getElementById('groupChatArea');
    area.style.display = 'block';
    document.getElementById('groupChatTitle').textContent = '💬 ' + name;
    renderGroupMsgs(name);
    area.scrollIntoView({ behavior: 'smooth' });
}

function renderGroupMsgs(name) {
    const msgs = groupMessages[name] || [];
    const el = document.getElementById('groupMsgs');
    el.innerHTML = msgs.map(m => `
    <div class="msg-bubble ${m.sent ? 'sent' : 'recv'}">
      ${!m.sent ? `<div style="font-size:11px;color:var(--accent-cyan);margin-bottom:4px;">${m.from}</div>` : ''}
      ${m.text}
      <div class="msg-meta">${m.time}</div>
    </div>`).join('');
    el.scrollTop = el.scrollHeight;
}

function sendGroupMessage() {
    const inp = document.getElementById('groupInput');
    const txt = inp.value.trim();
    if (!txt || !currentGroup) return;
    if (!groupMessages[currentGroup]) groupMessages[currentGroup] = [];
    groupMessages[currentGroup].push({ from: 'Dr. Priya Verma', text: txt, time: 'Just now', sent: true });
    renderGroupMsgs(currentGroup);
    inp.value = '';
    showToast('✅ Message sent to ' + currentGroup);
}

function sendGroupMsg(name) {
    document.getElementById('broadcastTitle').textContent = '📢 Broadcast to ' + name;
    document.getElementById('broadcastModal').dataset.group = name;
    openModal('broadcastModal');
}

function sendBroadcast() {
    const msg = document.getElementById('broadcastMsg').value.trim();
    const grp = document.getElementById('broadcastModal').dataset.group;
    if (!msg) return;
    if (!groupMessages[grp]) groupMessages[grp] = [];
    groupMessages[grp].push({ from: 'Dr. Priya Verma', text: '📢 ' + msg, time: 'Just now', sent: true });
    closeModal('broadcastModal');
    document.getElementById('broadcastMsg').value = '';
    showToast('✅ Broadcast sent to ' + grp);
}

// =========== MESSAGES ===========
const convData = [
    { name: 'Aarav Singh', last: 'Thank you ma\'am!', time: '10:30 AM', unread: 0 },
    { name: 'Department HOD', last: 'Meeting at 3 PM today', time: '9:15 AM', unread: 2 },
    { name: 'Priya Mehta', last: 'Can I get an extension?', time: 'Yesterday', unread: 1 },
];
const personalMsgData = {};
let currentConv = null;

function buildConvList() {
    const el = document.getElementById('convList');
    el.innerHTML = convData.map((c, i) => `
    <div onclick="openConv(${i})" style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:10px;cursor:pointer;border:1px solid var(--border);margin-bottom:8px;transition:.2s;" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background=''">
      <div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--accent-cyan),var(--accent-teal));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;">${c.name[0]}</div>
      <div style="flex:1;"><div style="font-size:13px;font-weight:600;">${c.name}</div><div style="font-size:11px;color:var(--text-secondary);">${c.last}</div></div>
      <div style="text-align:right;"><div style="font-size:10px;color:var(--text-muted);">${c.time}</div>${c.unread ? `<span class="badge badge-cyan" style="margin-top:4px;">${c.unread}</span>` : ''}</div>
    </div>`).join('');
}

function openConv(i) {
    currentConv = i;
    const c = convData[i];
    document.getElementById('msgChatTitle').innerHTML = `<span class="ci">💬</span> ${c.name}`;
    if (!personalMsgData[i]) personalMsgData[i] = [{ sent: false, text: c.last, time: c.time }];
    renderPersonalMsgs(i);
}

function renderPersonalMsgs(i) {
    const el = document.getElementById('personalMsgs');
    el.innerHTML = (personalMsgData[i] || []).map(m => `<div class="msg-bubble ${m.sent ? 'sent' : 'recv'}">${m.text}<div class="msg-meta">${m.time}</div></div>`).join('');
    el.scrollTop = el.scrollHeight;
}

function sendPersonalMsg() {
    const inp = document.getElementById('personalInput');
    const txt = inp.value.trim();
    if (!txt || currentConv === null) return;
    if (!personalMsgData[currentConv]) personalMsgData[currentConv] = [];
    personalMsgData[currentConv].push({ sent: true, text: txt, time: 'Just now' });
    renderPersonalMsgs(currentConv);
    inp.value = '';
}

// =========== LEAVE ===========
function submitLeave() {
    const reason = document.getElementById('leaveReason').value.trim();
    const notify = document.getElementById('notifyGroups').checked;
    const groupMsg = document.getElementById('leaveGroupMsg').value.trim();
    if (!reason) { showToast('⚠️ Please enter a reason for leave.'); return; }
    if (notify) {
        const msg = groupMsg || `Dear students, I will be on leave. Please continue with self-study material as assigned.`;
        Object.keys(groupMessages).forEach(g => {
            groupMessages[g].push({ from: 'Dr. Priya Verma', text: '🌿 Leave Notice: ' + msg, time: 'Just now', sent: true });
        });
        showToast('✅ Leave applied & message sent to all groups!');
    } else {
        showToast('✅ Leave application submitted!');
    }
    document.getElementById('leaveReason').value = '';
    document.getElementById('leaveGroupMsg').value = '';
}

// =========== RESULT ===========
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const el = document.getElementById('uploadedFiles');
    el.innerHTML = `<div class="file-item"><div class="file-icon">📄</div><div class="file-meta"><div class="file-name">${file.name}</div><div class="file-size">${(file.size / 1024).toFixed(1)} KB · Ready to upload</div></div><span class="badge badge-green">Ready</span></div>`;
}

function submitResult() {
    showToast('✅ Results uploaded and published to students!');
}

function saveManualResult() {
    showToast('✅ Manual results saved!');
}

function addResultRow() {
    const tbody = document.getElementById('manualResultBody');
    const n = tbody.rows.length + 1;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>22010${String(n).padStart(2, '0')}</td><td><input class="form-input" style="width:120px;padding:4px 8px;" placeholder="Student Name"></td><td><input class="form-input" style="width:70px;padding:4px 8px;" type="number" value="0" onchange="calcGrade(this)"></td><td><span class="badge badge-red">F</span></td>`;
    tbody.appendChild(tr);
}

function calcGrade(inp) {
    const v = parseInt(inp.value);
    const badge = inp.closest('tr').querySelector('.badge');
    if (v >= 90) { badge.className = 'badge badge-green'; badge.textContent = 'O'; }
    else if (v >= 80) { badge.className = 'badge badge-green'; badge.textContent = 'A+'; }
    else if (v >= 70) { badge.className = 'badge badge-cyan'; badge.textContent = 'A'; }
    else if (v >= 60) { badge.className = 'badge badge-cyan'; badge.textContent = 'B+'; }
    else if (v >= 50) { badge.className = 'badge badge-orange'; badge.textContent = 'B'; }
    else if (v >= 40) { badge.className = 'badge badge-orange'; badge.textContent = 'C'; }
    else { badge.className = 'badge badge-red'; badge.textContent = 'F'; }
}

// =========== UTILS ===========
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function showToast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 3000); }
function refreshPage() { showToast('🔄 Dashboard refreshed!'); }
function toggleNotif() { showToast('🔔 3 new notifications!'); }
function sendAlert() { showToast('📨 Attendance alert sent to student!'); }
function createGroup() { const n = document.getElementById('newGroupName').value.trim(); if (n) { groupMessages[n] = []; closeModal('createGroupModal'); showToast('✅ Group "' + n + '" created!'); } else showToast('⚠️ Enter a group name.'); }
document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', function (e) { if (e.target === this) this.classList.remove('open'); }));

// INIT
window.onload = () => {
    initDashboardCharts();
    buildAttTable();
    buildConvList();
};
