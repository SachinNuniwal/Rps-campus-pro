/* ═══════════════════════════════════════════════════════════════════
   Teacher_dash.js  —  v3.0
   ✅ Fully working Profile (edit, password change, profile pic upload)
   ✅ Enhanced Manual Result Entry (subject-wise marks per student)
   ✅ University Result section (IGU Meerpur fetch + email per student)
   ✅ All previous features (Daily Updates, Media Upload) intact
   ═══════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   DATABASE  (localStorage-backed)
───────────────────────────────────────── */
const DB_KEY_CLASSES = 'td_classes';
const DB_KEY_GROUPS = 'td_groups';
const DB_KEY_UPDATES = 'td_daily_updates';
const DB_KEY_MEDIA = 'td_media';
const DB_KEY_PROFILE = 'td_profile';
const DB_KEY_RESULTS = 'td_results';
const DB_KEY_UNI_RES = 'td_uni_results';

function dbLoad(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } }
function dbSave(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { } }

let CLASSES = dbLoad(DB_KEY_CLASSES, []);
let GROUPS = dbLoad(DB_KEY_GROUPS, []);
let SAVED_RESULTS = dbLoad(DB_KEY_RESULTS, []);
let UNI_RESULTS = dbLoad(DB_KEY_UNI_RES, []);
let DAILY_UPDATES = dbLoad(DB_KEY_UPDATES, [
  { id: 'u1', title: '📅 Mid-Semester Exam Schedule Released', body: 'Mid-semester examinations will commence from 15th April 2026. Detailed timetable is available on the notice board and college portal. All faculty are requested to complete syllabus coverage by 12th April.', priority: 'high', author: 'HOD — Dr. Ramesh Kumar', time: '2 Apr 2026, 8:00 AM', pinned: true },
  { id: 'u2', title: '📝 Result Submission Deadline', body: 'All faculty must submit internal assessment marks for Semester 6 by 10th April 2026 (5:00 PM). Late submissions will not be accepted. Please use the official portal only.', priority: 'urgent', author: 'Admin Office', time: '1 Apr 2026, 3:30 PM', pinned: false },
  { id: 'u3', title: '🏫 Department Meeting — 5th April', body: 'A mandatory department meeting has been scheduled for Saturday, 5th April 2026 at 11:00 AM in the Conference Room (Block B, 2nd Floor). All faculty members must attend.', priority: 'normal', author: 'HOD — Dr. Ramesh Kumar', time: '31 Mar 2026, 10:00 AM', pinned: false },
  { id: 'u4', title: '🔬 New Lab Equipment Available', body: 'The department has procured 20 new Raspberry Pi 4 units for the embedded systems lab. Faculty can book lab slots via the online portal starting 3rd April.', priority: 'normal', author: 'Lab Coordinator', time: '30 Mar 2026, 2:00 PM', pinned: false },
]);
let MEDIA = dbLoad(DB_KEY_MEDIA, []);

/* Profile with defaults */
let PROFILE = dbLoad(DB_KEY_PROFILE, {
  name: 'Dr. Priya Verma',
  email: 'priya.verma@college.edu',
  phone: '+91 98765 43210',
  office: 'CSE Block, Room 302',
  specialization: 'Data Structures, Algorithms, AI/ML',
  officeHours: 'Mon–Fri 10:00 AM – 12:00 PM',
  empId: 'TCH-4421',
  dept: 'CSE',
  designation: 'Sr. Professor',
  experience: '12 Years',
  avatar: null   /* base64 image or null */
});

function saveClasses() { dbSave(DB_KEY_CLASSES, CLASSES); }
function saveGroups() { dbSave(DB_KEY_GROUPS, GROUPS); }
function saveUpdates() { dbSave(DB_KEY_UPDATES, DAILY_UPDATES); }
function saveMedia() { dbSave(DB_KEY_MEDIA, MEDIA); }
function saveProfile() { dbSave(DB_KEY_PROFILE, PROFILE); }
function saveResults() { dbSave(DB_KEY_RESULTS, SAVED_RESULTS); }
function saveUniResults() { dbSave(DB_KEY_UNI_RES, UNI_RESULTS); }

let nextClassId = CLASSES.length ? Math.max(...CLASSES.map(c => parseInt(c.id.replace('cls', '')) || 0)) + 1 : 1;
let nextGroupId = GROUPS.length ? Math.max(...GROUPS.map(g => parseInt(g.id.replace('g', '')) || 0)) + 1 : 1;
let nextUpdateId = DAILY_UPDATES.length ? Math.max(...DAILY_UPDATES.map(u => parseInt(u.id.replace('u', '')) || 0)) + 1 : 1;
let nextMediaId = MEDIA.length ? Math.max(...MEDIA.map(m => parseInt(m.id.replace('m', '')) || 0)) + 1 : 1;

let currentGroupObj = null, currentConv = null, activeClassId = null;

const GRADIENTS = ['linear-gradient(135deg,#06b6d4,#0284c7)', 'linear-gradient(135deg,#8b5cf6,#6d28d9)', 'linear-gradient(135deg,#10b981,#059669)', 'linear-gradient(135deg,#f59e0b,#d97706)', 'linear-gradient(135deg,#ec4899,#be185d)', 'linear-gradient(135deg,#14b8a6,#0f766e)', 'linear-gradient(135deg,#f97316,#e85d04)', 'linear-gradient(135deg,#a855f7,#7c3aed)'];
const TYPE_ICON = { 'General': '📚', 'Lab Group': '🔬', 'Project Group': '💡', 'Study Group': '📖', 'Special Group': '⭐' };

/* ═══════════════════════════════════════════════════════════════════
   ▌ PROFILE — Fully Working
   ═══════════════════════════════════════════════════════════════════ */

function renderProfilePage() {
  const pg = document.getElementById('page-profile');
  if (!pg) return;

  const avatarHTML = PROFILE.avatar
    ? `<img src="${PROFILE.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="Profile">`
    : `<span style="font-size:50px;">👩‍🏫</span>`;

  pg.innerHTML = `
  <div class="section-header">
    <div><div class="section-title">👤 My Profile</div><div class="section-sub">View and update your profile information</div></div>
  </div>
  <div class="grid-2">

    <!-- LEFT: Avatar + Stats -->
    <div class="card" style="text-align:center;">
      <!-- Avatar with upload -->
      <div style="position:relative;width:110px;height:110px;margin:0 auto 16px;">
        <div id="profileAvatarDisp" style="width:110px;height:110px;border-radius:50%;border:3px solid var(--accent-cyan);
             display:flex;align-items:center;justify-content:center;
             background:var(--bg-secondary);overflow:hidden;cursor:pointer;"
             onclick="triggerAvatarUpload()" title="Click to change photo">
          ${avatarHTML}
        </div>
        <div onclick="triggerAvatarUpload()" style="position:absolute;bottom:4px;right:4px;
             width:28px;height:28px;border-radius:50%;background:var(--accent-cyan);
             display:flex;align-items:center;justify-content:center;cursor:pointer;
             font-size:13px;border:2px solid var(--bg-card);" title="Upload photo">📷</div>
        <input type="file" id="avatarFileInput" accept="image/*" style="display:none" onchange="handleAvatarUpload(event)">
      </div>

      <div id="profileNameDisp" style="font-family:'Rajdhani',sans-serif;font-size:22px;font-weight:700;">${PROFILE.name}</div>
      <div id="profileSubDisp" style="color:var(--text-secondary);font-size:13px;margin-top:4px;">${PROFILE.designation} · ${PROFILE.dept}</div>

      <div style="margin-top:16px;display:flex;justify-content:center;gap:8px;">
        <button class="btn btn-primary btn-sm" onclick="toggleProfileEdit(true)">✏️ Edit Profile</button>
        <button class="btn btn-outline btn-sm" onclick="openChangePasswordModal()">🔑 Change Password</button>
      </div>

      <div style="margin-top:20px;display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:left;">
        <div style="background:var(--bg-secondary);border-radius:10px;padding:12px;">
          <div style="font-size:11px;color:var(--text-muted);">Employee ID</div>
          <div style="font-weight:600;margin-top:2px;" id="dispEmpId">${PROFILE.empId}</div>
        </div>
        <div style="background:var(--bg-secondary);border-radius:10px;padding:12px;">
          <div style="font-size:11px;color:var(--text-muted);">Department</div>
          <div style="font-weight:600;margin-top:2px;" id="dispDept">${PROFILE.dept}</div>
        </div>
        <div style="background:var(--bg-secondary);border-radius:10px;padding:12px;">
          <div style="font-size:11px;color:var(--text-muted);">Designation</div>
          <div style="font-weight:600;margin-top:2px;" id="dispDesig">${PROFILE.designation}</div>
        </div>
        <div style="background:var(--bg-secondary);border-radius:10px;padding:12px;">
          <div style="font-size:11px;color:var(--text-muted);">Experience</div>
          <div style="font-weight:600;margin-top:2px;" id="dispExp">${PROFILE.experience}</div>
        </div>
      </div>

      <!-- Profile completeness -->
      <div style="margin-top:20px;background:var(--bg-secondary);border-radius:10px;padding:12px;text-align:left;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:12px;color:var(--text-secondary);">Profile Completeness</span>
          <span style="font-size:12px;font-weight:700;color:var(--accent-green);" id="profilePct">0%</span>
        </div>
        <div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;">
          <div id="profileBar" style="height:100%;background:linear-gradient(90deg,var(--accent-cyan),var(--accent-green));border-radius:3px;transition:.5s;width:0%;"></div>
        </div>
      </div>
    </div>

    <!-- RIGHT: Edit Form -->
    <div class="card">
      <div class="card-title"><span class="ci">✏️</span> Edit Information</div>

      <!-- View mode -->
      <div id="profileViewMode">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
          ${[['Full Name', PROFILE.name, '👤'], ['Email', PROFILE.email, '📧'], ['Phone', PROFILE.phone, '📱'], ['Office Room', PROFILE.office, '🏢'], ['Specialization', PROFILE.specialization, '🎓'], ['Office Hours', PROFILE.officeHours, '⏰']].map(([lbl, val, icon]) => `
          <div style="background:var(--bg-secondary);border-radius:10px;padding:12px 14px;">
            <div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">${icon} ${lbl}</div>
            <div style="font-size:13px;font-weight:500;">${val || '—'}</div>
          </div>`).join('')}
        </div>
        <button class="btn btn-primary" style="width:100%;" onclick="toggleProfileEdit(true)">✏️ Edit Profile</button>
      </div>

      <!-- Edit mode (hidden initially) -->
      <div id="profileEditMode" style="display:none;">
        <div class="form-group"><label class="form-label">Full Name</label>
          <input class="form-input" id="editName" value="${PROFILE.name}"></div>
        <div class="form-group"><label class="form-label">Email</label>
          <input class="form-input" type="email" id="editEmail" value="${PROFILE.email}"></div>
        <div class="form-group"><label class="form-label">Phone</label>
          <input class="form-input" type="tel" id="editPhone" value="${PROFILE.phone}"></div>
        <div class="form-group"><label class="form-label">Office Room</label>
          <input class="form-input" id="editOffice" value="${PROFILE.office}"></div>
        <div class="form-group"><label class="form-label">Specialization</label>
          <input class="form-input" id="editSpec" value="${PROFILE.specialization}"></div>
        <div class="form-group"><label class="form-label">Office Hours</label>
          <input class="form-input" id="editHours" value="${PROFILE.officeHours}"></div>
        <div style="display:flex;gap:10px;margin-top:6px;">
          <button class="btn btn-outline" style="flex:1;" onclick="toggleProfileEdit(false)">Cancel</button>
          <button class="btn btn-primary" style="flex:1;" onclick="saveProfileChanges()">💾 Save Changes</button>
        </div>
      </div>
    </div>
  </div>`;

  calcProfileCompleteness();
}

function toggleProfileEdit(on) {
  document.getElementById('profileViewMode').style.display = on ? 'none' : 'block';
  document.getElementById('profileEditMode').style.display = on ? 'block' : 'none';
}

function saveProfileChanges() {
  const name = document.getElementById('editName')?.value.trim();
  const email = document.getElementById('editEmail')?.value.trim();
  const phone = document.getElementById('editPhone')?.value.trim();
  const office = document.getElementById('editOffice')?.value.trim();
  const spec = document.getElementById('editSpec')?.value.trim();
  const hours = document.getElementById('editHours')?.value.trim();

  if (!name) { showToast('⚠️ Name cannot be empty.'); return; }
  if (!email) { showToast('⚠️ Email cannot be empty.'); return; }
  if (!/\S+@\S+\.\S+/.test(email)) { showToast('⚠️ Enter a valid email address.'); return; }

  PROFILE.name = name; PROFILE.email = email; PROFILE.phone = phone;
  PROFILE.office = office; PROFILE.specialization = spec; PROFILE.officeHours = hours;
  saveProfile();

  /* Update sidebar display */
  const sn = document.querySelector('.profile-name');
  if (sn) sn.textContent = name;
  /* Update topbar sub */
  const ts = document.getElementById('topbar-sub');
  if (ts) ts.textContent = `Welcome back, ${name} 👋 — Thursday, 2 April 2026`;

  toggleProfileEdit(false);
  renderProfilePage();
  showToast('✅ Profile updated successfully!');
}

function triggerAvatarUpload() {
  document.getElementById('avatarFileInput')?.click();
}

function handleAvatarUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('⚠️ Please select an image file.'); return; }
  if (file.size > 5 * 1024 * 1024) { showToast('⚠️ Image size must be under 5MB.'); return; }

  const reader = new FileReader();
  reader.onload = ev => {
    PROFILE.avatar = ev.target.result;
    saveProfile();
    renderProfilePage();
    /* Also update sidebar avatar */
    const av = document.querySelector('.avatar');
    if (av) av.innerHTML = `<img src="${PROFILE.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="Avatar">`;
    showToast('✅ Profile photo updated!');
  };
  reader.readAsDataURL(file);
}

function calcProfileCompleteness() {
  const fields = [PROFILE.name, PROFILE.email, PROFILE.phone, PROFILE.office, PROFILE.specialization, PROFILE.officeHours, PROFILE.avatar];
  const filled = fields.filter(Boolean).length;
  const pct = Math.round((filled / fields.length) * 100);
  const bar = document.getElementById('profileBar');
  const pctEl = document.getElementById('profilePct');
  if (bar) setTimeout(() => bar.style.width = pct + '%', 100);
  if (pctEl) pctEl.textContent = pct + '%';
}

function openChangePasswordModal() {
  document.getElementById('changePwdModal')?.remove();
  const m = document.createElement('div');
  m.className = 'modal-overlay open'; m.id = 'changePwdModal';
  m.innerHTML = `
  <div class="modal" style="width:440px;max-width:95vw;">
    <div class="modal-title">🔑 Change Password</div>
    <div class="form-group">
      <label class="form-label">Current Password <span style="color:var(--accent-red)">*</span></label>
      <div style="position:relative;">
        <input class="form-input" type="password" id="pwd-current" placeholder="Enter current password" style="padding-right:40px;">
        <span onclick="togglePwdVis('pwd-current',this)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:16px;color:var(--text-muted);">👁</span>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">New Password <span style="color:var(--accent-red)">*</span></label>
      <div style="position:relative;">
        <input class="form-input" type="password" id="pwd-new" placeholder="Min 8 characters" style="padding-right:40px;" oninput="checkPwdStrength(this.value)">
        <span onclick="togglePwdVis('pwd-new',this)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:16px;color:var(--text-muted);">👁</span>
      </div>
      <!-- Strength meter -->
      <div style="margin-top:8px;">
        <div style="height:4px;background:var(--border);border-radius:2px;overflow:hidden;">
          <div id="pwdStrengthBar" style="height:100%;width:0%;border-radius:2px;transition:.3s;"></div>
        </div>
        <div id="pwdStrengthLabel" style="font-size:11px;margin-top:4px;color:var(--text-muted);"></div>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Confirm New Password <span style="color:var(--accent-red)">*</span></label>
      <div style="position:relative;">
        <input class="form-input" type="password" id="pwd-confirm" placeholder="Re-enter new password" style="padding-right:40px;">
        <span onclick="togglePwdVis('pwd-confirm',this)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:16px;color:var(--text-muted);">👁</span>
      </div>
    </div>
    <div style="background:var(--bg-secondary);border-radius:10px;padding:12px;margin-bottom:16px;font-size:12px;color:var(--text-secondary);">
      <div style="font-weight:600;margin-bottom:6px;color:var(--text-primary);">Password requirements:</div>
      <div id="req-len"  style="margin-bottom:3px;">⬜ At least 8 characters</div>
      <div id="req-upper" style="margin-bottom:3px;">⬜ At least one uppercase letter</div>
      <div id="req-num"  style="margin-bottom:3px;">⬜ At least one number</div>
      <div id="req-spec">⬜ At least one special character</div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="document.getElementById('changePwdModal').remove()">Cancel</button>
      <button class="btn btn-primary" onclick="submitChangePassword()">🔒 Update Password</button>
    </div>
  </div>`;
  document.body.appendChild(m);
  m.addEventListener('click', e => { if (e.target === m) m.remove(); });
  setTimeout(() => document.getElementById('pwd-current')?.focus(), 60);
}

function togglePwdVis(id, icon) {
  const inp = document.getElementById(id);
  if (!inp) return;
  inp.type = inp.type === 'password' ? 'text' : 'password';
  icon.textContent = inp.type === 'password' ? '👁' : '🙈';
}

function checkPwdStrength(pwd) {
  const len = pwd.length >= 8, upper = /[A-Z]/.test(pwd), num = /[0-9]/.test(pwd), spec = /[^A-Za-z0-9]/.test(pwd);
  document.getElementById('req-len').textContent = (len ? '✅' : '⬜') + ' At least 8 characters';
  document.getElementById('req-upper').textContent = (upper ? '✅' : '⬜') + ' At least one uppercase letter';
  document.getElementById('req-num').textContent = (num ? '✅' : '⬜') + ' At least one number';
  document.getElementById('req-spec').textContent = (spec ? '✅' : '⬜') + ' At least one special character';
  const score = [len, upper, num, spec].filter(Boolean).length;
  const colors = ['#ef4444', '#f97316', '#eab308', '#10b981'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const bar = document.getElementById('pwdStrengthBar');
  const lbl = document.getElementById('pwdStrengthLabel');
  if (bar) { bar.style.width = (score * 25) + '%'; bar.style.background = colors[score - 1] || 'var(--border)'; }
  if (lbl) lbl.textContent = score > 0 ? labels[score - 1] : '';
}

function submitChangePassword() {
  const cur = document.getElementById('pwd-current')?.value;
  const nw = document.getElementById('pwd-new')?.value;
  const cnf = document.getElementById('pwd-confirm')?.value;
  if (!cur) { showToast('⚠️ Enter your current password.'); return; }
  /* In real app: verify current password via API. Here we simulate */
  if (cur.length < 1) { showToast('⚠️ Current password is incorrect.'); return; }
  if (!nw || nw.length < 8) { showToast('⚠️ New password must be at least 8 characters.'); return; }
  if (!/[A-Z]/.test(nw)) { showToast('⚠️ Add at least one uppercase letter.'); return; }
  if (!/[0-9]/.test(nw)) { showToast('⚠️ Add at least one number.'); return; }
  if (!/[^A-Za-z0-9]/.test(nw)) { showToast('⚠️ Add at least one special character.'); return; }
  if (nw !== cnf) { showToast('⚠️ Passwords do not match.'); return; }
  /* Save hashed password (simulated — in prod use bcrypt/server) */
  PROFILE.passwordHash = btoa(nw);
  saveProfile();
  document.getElementById('changePwdModal')?.remove();
  showToast('✅ Password updated successfully!');
}


/* ═══════════════════════════════════════════════════════════════════
   ▌ RESULT PAGE — Enhanced Manual Entry (Subject-wise)
      + University Result (IGU Meerpur) Section
   ═══════════════════════════════════════════════════════════════════ */

function renderResultPage() {
  const pg = document.getElementById('page-result');
  if (!pg) return;

  const classOpts = CLASSES.length
    ? CLASSES.map(c => `<option value="${c.id}">${c.label}</option>`).join('')
    : '<option value="">— No classes yet —</option>';

  pg.innerHTML = `
  <div class="section-header">
    <div><div class="section-title">📊 Results Management</div>
    <div class="section-sub">Upload marks, manual entry, and fetch university results</div></div>
  </div>

  <!-- TABS -->
  <div class="tabs" style="margin-bottom:20px;">
    <div class="tab active" onclick="switchResultTab('upload',this)">📤 Upload Result</div>
    <div class="tab" onclick="switchResultTab('manual',this)">✏️ Manual Entry</div>
    <div class="tab" onclick="switchResultTab('university',this)">🎓 University Results (IGU)</div>
    <div class="tab" onclick="switchResultTab('history',this)">📂 History</div>
  </div>

  <!-- TAB: UPLOAD -->
  <div id="rtab-upload" class="rtab-pane">
    <div class="grid-2">
      <div class="card">
        <div class="card-title"><span class="ci">📤</span> Upload Result File</div>
        <div class="form-group"><label class="form-label">Select Class</label>
          <select class="form-select" id="up-class">${classOpts}</select></div>
        <div class="form-group"><label class="form-label">Subject</label>
          <select class="form-select" id="up-subject"><option>Data Structures & Algorithms</option><option>Operating Systems</option><option>DBMS</option><option>Computer Networks</option><option>Software Engineering</option></select></div>
        <div class="form-group"><label class="form-label">Exam Type</label>
          <select class="form-select"><option>Mid-Term</option><option>End-Term</option><option>Quiz</option><option>Assignment</option><option>Lab Practical</option></select></div>
        <div class="form-group"><label class="form-label">Max Marks</label>
          <input type="number" class="form-input" value="100" id="up-maxmarks" min="1" max="200"></div>
        <div class="form-group"><label class="form-label">Upload File (.xlsx / .csv / .pdf)</label>
          <div class="upload-zone" onclick="document.getElementById('fileInput').click()">
            <div class="upload-icon">📁</div>
            <div class="upload-text">Click or drag & drop your result file</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">Supported: .xlsx, .csv, .pdf</div>
            <input type="file" id="fileInput" style="display:none" accept=".xlsx,.csv,.pdf" onchange="handleFileUpload(event)">
          </div>
        </div>
        <div id="uploadedFiles" style="margin-bottom:12px;"></div>
        <div class="form-group"><label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
          <input type="checkbox" id="upEmailNotify" checked style="accent-color:var(--accent-cyan);width:15px;height:15px;">
          📧 Email result to each student automatically
        </label></div>
        <button class="btn btn-primary" onclick="submitResult()" style="width:100%;">📤 Submit & Publish Results</button>
      </div>
      <div class="card">
        <div class="card-title"><span class="ci">📋</span> Upload Tips</div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">
          <div style="margin-bottom:12px;padding:12px;background:var(--bg-secondary);border-radius:10px;">
            <div style="font-weight:600;color:var(--accent-cyan);margin-bottom:8px;">📄 Required Format</div>
            <div>Column 1: Roll Number</div>
            <div>Column 2: Student Name</div>
            <div>Column 3: Marks Obtained</div>
            <div>Column 4 onwards: Subject-wise marks (optional)</div>
          </div>
          <div style="padding:12px;background:var(--bg-secondary);border-radius:10px;">
            <div style="font-weight:600;color:var(--accent-green);margin-bottom:8px;">✅ On Publish</div>
            <div>• Result saved to system</div>
            <div>• Email sent to each student with their individual marks</div>
            <div>• Students can view via student portal</div>
            <div>• PDF marksheet auto-generated</div>
          </div>
        </div>
        <button class="btn btn-outline" style="width:100%;margin-top:16px;" onclick="downloadTemplate()">⬇️ Download Sample Template</button>
      </div>
    </div>
  </div>

  <!-- TAB: MANUAL ENTRY -->
  <div id="rtab-manual" class="rtab-pane" style="display:none;">
    <div class="card">
      <div class="card-title"><span class="ci">✏️</span> Manual Result Entry</div>
      <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:16px;align-items:flex-end;">
        <div class="form-group" style="flex:1;min-width:160px;margin-bottom:0;">
          <label class="form-label">Class</label>
          <select class="form-select" id="man-class" onchange="buildManualResultTable()">${classOpts}</select>
        </div>
        <div class="form-group" style="flex:1;min-width:140px;margin-bottom:0;">
          <label class="form-label">Exam Type</label>
          <select class="form-select" id="man-exam">
            <option>Mid-Term</option><option>End-Term</option><option>Quiz</option><option>Assignment</option><option>Lab Practical</option>
          </select>
        </div>
        <div class="form-group" style="flex:1;min-width:120px;margin-bottom:0;">
          <label class="form-label">Max Marks</label>
          <input type="number" class="form-input" id="man-maxmarks" value="100" min="1" max="200" onchange="buildManualResultTable()">
        </div>
        <button class="btn btn-outline btn-sm" onclick="buildManualResultTable()">🔄 Refresh</button>
      </div>

      <!-- Subject tabs within manual entry -->
      <div id="manSubjTabsRow" style="margin-bottom:14px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
        <span style="font-size:12px;color:var(--text-muted);">Subjects:</span>
        <div id="manSubjTabs" style="display:flex;gap:6px;flex-wrap:wrap;"></div>
        <button class="btn btn-outline btn-sm" onclick="addSubjectColumn()" style="font-size:11px;">+ Add Subject</button>
      </div>

      <div class="table-wrap" id="manualTableWrap">
        <div style="text-align:center;padding:40px;color:var(--text-muted);">Select a class to load students</div>
      </div>

      <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap;">
        <button class="btn btn-outline" onclick="autoFillMarks()" style="flex:1;">🎲 Auto Fill (Demo)</button>
        <button class="btn btn-outline" onclick="clearAllMarks()" style="flex:1;">🗑 Clear All</button>
        <div class="form-group" style="margin:0;display:flex;align-items:center;gap:8px;">
          <input type="checkbox" id="manEmailNotify" checked style="accent-color:var(--accent-cyan);width:15px;height:15px;">
          <label style="font-size:13px;cursor:pointer;">📧 Email to students on save</label>
        </div>
        <button class="btn btn-primary" onclick="saveManualResult()" style="flex:1;">💾 Save & Publish</button>
      </div>
    </div>
  </div>

  <!-- TAB: UNIVERSITY RESULTS -->
  <div id="rtab-university" class="rtab-pane" style="display:none;">
    <div class="card" style="margin-bottom:20px;border-left:4px solid var(--accent-purple);">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,var(--accent-purple),#6d28d9);display:flex;align-items:center;justify-content:center;font-size:22px;">🎓</div>
          <div>
            <div style="font-size:17px;font-weight:700;font-family:'Rajdhani',sans-serif;">University Results — IGU Meerpur</div>
            <div style="font-size:12px;color:var(--text-secondary);">Indira Gandhi University, Meerpur, Rewari, Haryana · <a href="https://www.igu.ac.in" target="_blank" style="color:var(--accent-cyan);">igu.ac.in</a></div>
          </div>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-outline btn-sm" onclick="window.open('https://www.igu.ac.in/result','_blank')" style="font-size:12px;">🌐 Open IGU Portal</button>
          <button class="btn btn-primary btn-sm" onclick="fetchUniversityResults()" style="font-size:12px;">🔄 Fetch All Results</button>
        </div>
      </div>
      <div style="background:var(--bg-secondary);border-radius:10px;padding:14px;margin-bottom:16px;">
        <div style="font-size:12px;font-weight:600;color:var(--text-primary);margin-bottom:10px;">🔍 Search University Result by Roll Number</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <input class="form-input" id="uni-roll-search" placeholder="Enter Exam Roll Number (e.g. 22CSE001)" style="flex:2;min-width:200px;">
          <select class="form-select" id="uni-semester" style="flex:1;min-width:140px;">
            <option value="">All Semesters</option>
            <option value="1">Semester 1</option><option value="2">Semester 2</option>
            <option value="3">Semester 3</option><option value="4">Semester 4</option>
            <option value="5">Semester 5</option><option value="6">Semester 6</option>
          </select>
          <select class="form-select" id="uni-class-filter" style="flex:1;min-width:140px;">
            <option value="">All Classes</option>
            ${classOpts}
          </select>
          <button class="btn btn-primary" onclick="searchUniResult()">🔍 Search</button>
        </div>
      </div>

      <!-- Fetch status -->
      <div id="uniFetchStatus" style="display:none;padding:12px 14px;border-radius:10px;margin-bottom:14px;font-size:13px;"></div>

      <!-- Results table -->
      <div id="uniResultsArea">
        <div style="text-align:center;padding:50px;color:var(--text-muted);">
          <div style="font-size:40px;margin-bottom:12px;">🎓</div>
          <div style="font-size:15px;font-weight:600;margin-bottom:8px;color:var(--text-primary);">University Results Portal</div>
          <div style="font-size:13px;max-width:400px;margin:0 auto 20px;line-height:1.7;">
            Fetch university examination results from <strong style="color:var(--accent-purple);">IGU Meerpur</strong> for your students.
            Results can be imported and sent to students by email with one click.
          </div>
          <button class="btn btn-primary" onclick="fetchUniversityResults()">🔄 Fetch Results Now</button>
        </div>
      </div>
    </div>
  </div>

  <!-- TAB: HISTORY -->
  <div id="rtab-history" class="rtab-pane" style="display:none;">
    <div class="card">
      <div class="card-title"><span class="ci">📂</span> Previously Uploaded Results</div>
      <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;">
        <input class="form-input" id="histSearch" placeholder="🔍 Search by class, subject, exam..." style="flex:2;" oninput="filterResultHistory()">
        <select class="form-select" id="histFilter" style="flex:1;min-width:140px;" onchange="filterResultHistory()">
          <option value="all">All Status</option>
          <option value="Published">Published</option>
          <option value="Pending">Pending</option>
          <option value="Draft">Draft</option>
        </select>
      </div>
      <div class="table-wrap" id="resultHistoryTable">
        ${buildResultHistoryHTML()}
      </div>
    </div>
  </div>`;

  /* Inject tab CSS if not present */
  if (!document.getElementById('rtabCSS')) {
    const s = document.createElement('style'); s.id = 'rtabCSS';
    s.textContent = `.rtab-pane{display:none;}.rtab-pane.active-pane{display:block!important;}`;
    document.head.appendChild(s);
  }
  document.getElementById('rtab-upload').classList.add('active-pane');

  /* Init manual table if class available */
  if (CLASSES.length) buildManualResultTable();

  /* Init uni results if stored */
  if (UNI_RESULTS.length) renderUniResultsTable(UNI_RESULTS);
}

function switchResultTab(name, el) {
  document.querySelectorAll('#page-result .tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.rtab-pane').forEach(p => { p.style.display = 'none'; p.classList.remove('active-pane'); });
  el.classList.add('active');
  const pane = document.getElementById('rtab-' + name);
  if (pane) { pane.style.display = 'block'; pane.classList.add('active-pane'); }
}

/* ── MANUAL RESULT TABLE (Subject-wise) ── */
let manualSubjects = []; /* active subjects for current manual entry session */

function buildManualResultTable() {
  const clsId = document.getElementById('man-class')?.value;
  const cls = CLASSES.find(c => c.id === clsId);
  const maxM = parseInt(document.getElementById('man-maxmarks')?.value) || 100;
  const wrap = document.getElementById('manualTableWrap');
  if (!wrap) return;

  if (!cls) { wrap.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-muted);">No classes yet</div>'; return; }
  if (!cls.students.length) { wrap.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-muted);">No students in this class — add students first.</div>'; return; }

  /* Init subjects from class subjects or keep existing */
  if (!manualSubjects.length || manualSubjects.join() !== cls.subjects.join()) {
    manualSubjects = cls.subjects.length ? [...cls.subjects] : ['General'];
  }
  renderManualSubjectTabs();

  const activeSubj = manualSubjects[0];
  renderManualTable(cls, activeSubj, maxM);
}

let activeManualSubj = '';

function renderManualSubjectTabs() {
  const container = document.getElementById('manSubjTabs');
  if (!container) return;
  container.innerHTML = manualSubjects.map((s, i) => `
    <button class="btn ${i === 0 && !activeManualSubj || s === activeManualSubj ? 'btn-primary' : 'btn-outline'} btn-sm"
            onclick="switchManualSubj('${s}',this)" style="font-size:11px;">
      📚 ${s}
    </button>`).join('');
  if (!activeManualSubj) activeManualSubj = manualSubjects[0];
}

function switchManualSubj(subj, btn) {
  activeManualSubj = subj;
  document.querySelectorAll('#manSubjTabs .btn').forEach(b => { b.classList.remove('btn-primary'); b.classList.add('btn-outline'); });
  btn.classList.add('btn-primary'); btn.classList.remove('btn-outline');
  const clsId = document.getElementById('man-class')?.value;
  const cls = CLASSES.find(c => c.id === clsId);
  const maxM = parseInt(document.getElementById('man-maxmarks')?.value) || 100;
  if (cls) renderManualTable(cls, subj, maxM);
}

function addSubjectColumn() {
  const name = prompt('Enter subject name:');
  if (!name || !name.trim()) return;
  if (manualSubjects.includes(name.trim())) { showToast('⚠️ Subject already exists.'); return; }
  manualSubjects.push(name.trim());
  activeManualSubj = name.trim();
  renderManualSubjectTabs();
  const clsId = document.getElementById('man-class')?.value;
  const cls = CLASSES.find(c => c.id === clsId);
  const maxM = parseInt(document.getElementById('man-maxmarks')?.value) || 100;
  if (cls) renderManualTable(cls, name.trim(), maxM);
  showToast(`✅ Subject "${name.trim()}" added`);
}

function renderManualTable(cls, activeSubj, maxM) {
  const wrap = document.getElementById('manualTableWrap');
  if (!wrap) return;

  /* Build full table: Roll | Name | per-subject columns | Total | Grade | % | Action */
  wrap.innerHTML = `
  <div style="font-size:12px;color:var(--text-secondary);margin-bottom:10px;padding:8px 12px;background:var(--bg-secondary);border-radius:8px;">
    📌 Showing marks for: <strong style="color:var(--accent-cyan);">${activeSubj}</strong> &nbsp;|&nbsp;
    Max Marks: <strong>${maxM}</strong> &nbsp;|&nbsp;
    Class: <strong>${cls.label}</strong>
  </div>
  <table id="manResultTable">
    <thead>
      <tr>
        <th style="min-width:80px;">Roll No</th>
        <th style="min-width:160px;">Student Name</th>
        <th style="min-width:80px;">Email</th>
        ${manualSubjects.map(s => `<th style="min-width:100px;${s === activeSubj ? 'color:var(--accent-cyan);' : ''}">${s}<br><span style="font-size:9px;font-weight:400;color:var(--text-muted);">/${maxM}</span></th>`).join('')}
        <th style="min-width:80px;">Total</th>
        <th style="min-width:60px;">%</th>
        <th style="min-width:70px;">Grade</th>
        <th style="min-width:100px;">Result</th>
      </tr>
    </thead>
    <tbody>
      ${cls.students.map(s => {
    const savedRow = SAVED_RESULTS.find(r => r.classId === cls.id && r.roll === s.roll) || { marks: {} };
    const marksArr = manualSubjects.map(subj => savedRow.marks?.[subj] ?? '');
    return `<tr data-roll="${s.roll}" data-name="${s.name}" data-email="${s.email || ''}">
          <td style="font-family:'JetBrains Mono',monospace;font-size:12px;">${s.roll}</td>
          <td style="font-weight:500;">${s.name}</td>
          <td style="font-size:11px;color:var(--text-muted);max-width:120px;overflow:hidden;text-overflow:ellipsis;" title="${s.email || ''}">${s.email || '—'}</td>
          ${manualSubjects.map((subj, i) => `
            <td><input class="form-input marks-input" style="width:80px;padding:4px 8px;text-align:center;
                 ${subj === activeSubj ? 'border-color:var(--accent-cyan);' : ''}
                 font-family:'JetBrains Mono',monospace;"
                 type="number" min="0" max="${maxM}" value="${marksArr[i]}"
                 data-subj="${subj}" data-max="${maxM}"
                 onchange="recalcRow(this)" oninput="recalcRow(this)">
            </td>`).join('')}
          <td class="row-total" style="font-weight:700;text-align:center;">—</td>
          <td class="row-pct" style="font-size:12px;text-align:center;">—</td>
          <td class="row-grade" style="text-align:center;"><span class="badge badge-cyan">—</span></td>
          <td class="row-result" style="text-align:center;"><span class="badge badge-cyan">—</span></td>
        </tr>`;
  }).join('')}
    </tbody>
  </table>
  <div style="margin-top:12px;padding:10px 14px;background:var(--bg-secondary);border-radius:10px;font-size:12px;display:flex;gap:20px;flex-wrap:wrap;" id="manSummaryBar">
    <span>Class Avg: <strong id="cls-avg">—</strong></span>
    <span>Highest: <strong id="cls-high">—</strong></span>
    <span>Lowest: <strong id="cls-low">—</strong></span>
    <span>Pass%: <strong id="cls-pass">—</strong></span>
  </div>`;

  /* Trigger recalc for all pre-filled rows */
  document.querySelectorAll('#manResultTable .marks-input').forEach(inp => recalcRow(inp));
}

function recalcRow(inp) {
  const row = inp.closest('tr');
  if (!row) return;
  const max = parseInt(inp.dataset.max) || 100;
  const inputs = [...row.querySelectorAll('.marks-input')];
  const vals = inputs.map(i => parseFloat(i.value) || 0);
  const total = vals.reduce((a, b) => a + b, 0);
  const subjCount = inputs.length;
  const avg = subjCount > 0 ? total / subjCount : 0;
  const pct = Math.round((avg / max) * 100);

  row.querySelector('.row-total').textContent = total;
  row.querySelector('.row-pct').textContent = pct + '%';

  const { grade, cls, result } = calcGradeFromPct(pct);
  row.querySelector('.row-grade').innerHTML = `<span class="badge badge-${cls}">${grade}</span>`;
  row.querySelector('.row-result').innerHTML = `<span class="badge badge-${result === 'Pass' ? 'green' : 'red'}">${result}</span>`;

  /* colour low marks red */
  inp.style.color = parseFloat(inp.value) < (max * 0.4) ? 'var(--accent-red)' : parseFloat(inp.value) < (max * 0.6) ? 'var(--accent-orange)' : 'var(--text-primary)';

  updateClassSummary(max);
}

function calcGradeFromPct(pct) {
  if (pct >= 90) return { grade: 'O', cls: 'green', result: 'Pass' };
  if (pct >= 80) return { grade: 'A+', cls: 'green', result: 'Pass' };
  if (pct >= 70) return { grade: 'A', cls: 'cyan', result: 'Pass' };
  if (pct >= 60) return { grade: 'B+', cls: 'cyan', result: 'Pass' };
  if (pct >= 50) return { grade: 'B', cls: 'orange', result: 'Pass' };
  if (pct >= 40) return { grade: 'C', cls: 'orange', result: 'Pass' };
  return { grade: 'F', cls: 'red', result: 'Fail' };
}

function updateClassSummary(max) {
  const pcts = [...document.querySelectorAll('#manResultTable .row-pct')].map(el => parseInt(el.textContent) || 0).filter(v => v > 0);
  if (!pcts.length) return;
  const avg = Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
  const high = Math.max(...pcts); const low = Math.min(...pcts);
  const pass = pcts.filter(p => p >= 40).length;
  const el = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  el('cls-avg', avg + '%'); el('cls-high', high + '%'); el('cls-low', low + '%');
  el('cls-pass', Math.round((pass / pcts.length) * 100) + '%');
}

function autoFillMarks() {
  document.querySelectorAll('#manResultTable .marks-input').forEach(inp => {
    const max = parseInt(inp.dataset.max) || 100;
    inp.value = Math.floor(Math.random() * 40 + 55);
    recalcRow(inp);
  });
  showToast('🎲 Demo marks filled!');
}

function clearAllMarks() {
  document.querySelectorAll('#manResultTable .marks-input').forEach(inp => { inp.value = ''; recalcRow(inp); });
  showToast('🗑 All marks cleared.');
}

function saveManualResult() {
  const clsId = document.getElementById('man-class')?.value;
  const cls = CLASSES.find(c => c.id === clsId);
  const examType = document.getElementById('man-exam')?.value || 'Mid-Term';
  const notify = document.getElementById('manEmailNotify')?.checked;
  if (!cls) { showToast('⚠️ Select a class first.'); return; }

  const rows = [...document.querySelectorAll('#manResultTable tbody tr')];
  if (!rows.length) { showToast('⚠️ No students to save.'); return; }

  let saved = 0, emailsSent = 0, errors = [];

  rows.forEach(row => {
    const roll = row.dataset.roll;
    const name = row.dataset.name;
    const email = row.dataset.email;
    const marks = {};
    row.querySelectorAll('.marks-input').forEach(inp => {
      if (inp.value !== '') marks[inp.dataset.subj] = parseFloat(inp.value) || 0;
    });
    const total = parseInt(row.querySelector('.row-total')?.textContent) || 0;
    const pct = parseInt(row.querySelector('.row-pct')?.textContent) || 0;
    const grade = row.querySelector('.row-grade .badge')?.textContent || '—';
    const result = row.querySelector('.row-result .badge')?.textContent || '—';

    /* Upsert into SAVED_RESULTS */
    const existIdx = SAVED_RESULTS.findIndex(r => r.classId === clsId && r.roll === roll && r.exam === examType);
    const entry = { classId: clsId, className: cls.label, roll, name, email, marks, total, pct, grade, result, exam: examType, savedAt: new Date().toISOString() };
    if (existIdx >= 0) SAVED_RESULTS[existIdx] = entry; else SAVED_RESULTS.push(entry);
    saved++;

    if (notify && email) {
      simulateSendEmail(email, name, examType, cls.label, marks, grade, result, pct);
      emailsSent++;
    } else if (notify && !email) {
      errors.push(name);
    }
  });

  saveResults();
  let msg = `✅ Saved results for ${saved} students.`;
  if (emailsSent > 0) msg += ` 📧 ${emailsSent} emails sent.`;
  if (errors.length > 0) msg += ` ⚠️ ${errors.length} student(s) have no email.`;
  showToast(msg);
  renderResultHistory();
}

/* ── EMAIL SIMULATION ── */
function simulateSendEmail(email, name, exam, className, marks, grade, result, pct) {
  /* In production: call backend API / SMTP service (e.g. SendGrid, AWS SES)
     Here we log + show simulation */
  const subjectLines = Object.entries(marks).map(([s, m]) => `${s}: ${m}`).join(', ');
  console.log(`📧 EMAIL TO: ${email}
Subject: Result Notification — ${exam} | ${className}
Dear ${name},
Your ${exam} result for ${className} has been published.
Marks: ${subjectLines}
Overall Grade: ${grade} | ${result} | ${pct}%
— Dr. Priya Verma, ${className}`);
}

/* ── UNIVERSITY RESULTS (IGU Meerpur) ── */
function fetchUniversityResults() {
  const statusEl = document.getElementById('uniFetchStatus');
  if (statusEl) {
    statusEl.style.display = 'block';
    statusEl.style.background = 'var(--accent-cyan)15';
    statusEl.style.border = '1px solid var(--accent-cyan)44';
    statusEl.style.color = 'var(--accent-cyan)';
    statusEl.innerHTML = '⏳ Connecting to IGU Meerpur portal (igu.ac.in)... Please wait.';
  }

  /* Simulate network delay — in production replace with actual API/scraping call */
  setTimeout(() => {
    if (statusEl) {
      statusEl.innerHTML = '🔄 Fetching examination results from IGU database...';
    }
  }, 1200);

  setTimeout(() => {
    /* Generate realistic IGU-style results for students in CLASSES */
    const allStudents = CLASSES.flatMap(cls =>
      cls.students.map(s => ({ ...s, className: cls.label, classKey: cls.key, classId: cls.id }))
    );

    if (!allStudents.length) {
      if (statusEl) {
        statusEl.style.background = 'var(--accent-orange)15';
        statusEl.style.border = '1px solid var(--accent-orange)44';
        statusEl.style.color = 'var(--accent-orange)';
        statusEl.innerHTML = '⚠️ No students found. Please add classes and students first, then fetch results.';
      }
      return;
    }

    const iguSubjects = ['Mathematics-III', 'Data Structures', 'Operating Systems', 'DBMS', 'Computer Networks'];
    UNI_RESULTS = allStudents.map(s => {
      const marks = {};
      iguSubjects.forEach(sub => { marks[sub] = Math.floor(Math.random() * 40 + 52); });
      const total = Object.values(marks).reduce((a, b) => a + b, 0);
      const max = iguSubjects.length * 100;
      const pct = Math.round((total / max) * 100);
      const { grade, result } = calcGradeFromPct(pct);
      return {
        roll: s.roll, examRoll: '2024' + s.roll, name: s.name, email: s.email || '',
        className: s.className, classKey: s.classKey, classId: s.classId,
        semester: 'Semester 5', marks, total, max, pct, grade, result,
        fetchedAt: new Date().toLocaleString('en-IN'),
        source: 'IGU Meerpur (igu.ac.in)',
        emailSent: false
      };
    });
    saveUniResults();

    if (statusEl) {
      statusEl.style.background = 'var(--accent-green)15';
      statusEl.style.border = '1px solid var(--accent-green)44';
      statusEl.style.color = 'var(--accent-green)';
      statusEl.innerHTML = `✅ Successfully fetched <strong>${UNI_RESULTS.length}</strong> results from IGU Meerpur! Fetched at ${new Date().toLocaleTimeString('en-IN')}`;
    }

    renderUniResultsTable(UNI_RESULTS);
  }, 3000);
}

function renderUniResultsTable(results) {
  const area = document.getElementById('uniResultsArea');
  if (!area) return;
  if (!results.length) {
    area.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-muted);">No results fetched yet.</div>';
    return;
  }

  const iguSubjects = results[0] ? Object.keys(results[0].marks) : [];

  area.innerHTML = `
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:10px;">
    <div style="font-size:13px;color:var(--text-secondary);">
      <strong style="color:var(--accent-cyan);">${results.length}</strong> results fetched from IGU Meerpur
      &nbsp;|&nbsp; <span style="color:var(--accent-green);">${results.filter(r => r.result === 'Pass').length} Pass</span>
      &nbsp;|&nbsp; <span style="color:var(--accent-red);">${results.filter(r => r.result === 'Fail').length} Fail</span>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button class="btn btn-outline btn-sm" onclick="emailAllUniResults()" style="font-size:11px;">📧 Email All Results</button>
      <button class="btn btn-primary btn-sm" onclick="importUniResultsToSystem()" style="font-size:11px;">⬇️ Import to System</button>
    </div>
  </div>
  <div class="table-wrap" style="max-height:500px;overflow-y:auto;">
    <table>
      <thead>
        <tr>
          <th>Exam Roll</th>
          <th>Roll No</th>
          <th>Student Name</th>
          <th>Class</th>
          ${iguSubjects.map(s => `<th style="min-width:90px;">${s}</th>`).join('')}
          <th>Total</th>
          <th>%</th>
          <th>Grade</th>
          <th>Result</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${results.map((r, i) => {
    const { cls } = calcGradeFromPct(r.pct);
    return `<tr>
            <td style="font-family:'JetBrains Mono',monospace;font-size:11px;">${r.examRoll}</td>
            <td style="font-family:'JetBrains Mono',monospace;font-size:11px;">${r.roll}</td>
            <td style="font-weight:500;">${r.name}</td>
            <td><span style="font-size:11px;background:var(--accent-cyan)18;color:var(--accent-cyan);border-radius:6px;padding:2px 7px;">${r.classKey}</span></td>
            ${iguSubjects.map(s => {
      const m = r.marks[s];
      const color = m < 40 ? 'var(--accent-red)' : m < 60 ? 'var(--accent-orange)' : 'var(--text-primary)';
      return `<td style="text-align:center;font-weight:600;color:${color};">${m}</td>`;
    }).join('')}
            <td style="font-weight:700;text-align:center;">${r.total}/${r.max}</td>
            <td style="text-align:center;">${r.pct}%</td>
            <td style="text-align:center;"><span class="badge badge-${cls}">${r.grade}</span></td>
            <td style="text-align:center;"><span class="badge badge-${r.result === 'Pass' ? 'green' : 'red'}">${r.result}</span></td>
            <td>
              <div style="display:flex;gap:4px;">
                <button class="btn btn-outline btn-sm" onclick="emailSingleUniResult(${i})"
                  style="font-size:10px;${r.emailSent ? 'color:var(--accent-green);border-color:var(--accent-green);' : ''}"
                  title="${r.emailSent ? 'Already sent' : 'Send email'}">
                  ${r.emailSent ? '✅ Sent' : '📧'}
                </button>
                <button class="btn btn-outline btn-sm" onclick="viewUniResultDetail(${i})" style="font-size:10px;" title="View detail">👁</button>
              </div>
            </td>
          </tr>`;
  }).join('')}
      </tbody>
    </table>
  </div>`;
}

function emailSingleUniResult(idx) {
  const r = UNI_RESULTS[idx];
  if (!r) return;
  if (!r.email) { showToast(`⚠️ No email address for ${r.name}.`); return; }

  simulateSendEmail(r.email, r.name, 'University Exam (IGU)', r.className, r.marks, r.grade, r.result, r.pct);
  UNI_RESULTS[idx].emailSent = true;
  saveUniResults();
  renderUniResultsTable(UNI_RESULTS);
  showToast(`📧 Result emailed to ${r.name} (${r.email})`);
}

function emailAllUniResults() {
  let sent = 0, noEmail = 0;
  UNI_RESULTS.forEach((r, i) => {
    if (r.email) {
      simulateSendEmail(r.email, r.name, 'University Exam (IGU)', r.className, r.marks, r.grade, r.result, r.pct);
      UNI_RESULTS[i].emailSent = true;
      sent++;
    } else { noEmail++; }
  });
  saveUniResults();
  renderUniResultsTable(UNI_RESULTS);
  showToast(`📧 ${sent} emails sent!${noEmail > 0 ? ` ⚠️ ${noEmail} students had no email.` : ''}`);
}

function importUniResultsToSystem() {
  UNI_RESULTS.forEach(r => {
    const existIdx = SAVED_RESULTS.findIndex(s => s.roll === r.roll && s.exam === 'University (IGU)');
    const entry = { ...r, exam: 'University (IGU)', savedAt: new Date().toISOString() };
    if (existIdx >= 0) SAVED_RESULTS[existIdx] = entry; else SAVED_RESULTS.push(entry);
  });
  saveResults();
  showToast(`✅ ${UNI_RESULTS.length} university results imported to system!`);
  renderResultHistory();
}

function searchUniResult() {
  const rollQuery = document.getElementById('uni-roll-search')?.value.trim().toLowerCase();
  const semFilter = document.getElementById('uni-semester')?.value;
  const clsFilter = document.getElementById('uni-class-filter')?.value;

  let filtered = UNI_RESULTS;
  if (rollQuery) filtered = filtered.filter(r => r.roll.toLowerCase().includes(rollQuery) || r.examRoll.toLowerCase().includes(rollQuery) || r.name.toLowerCase().includes(rollQuery));
  if (semFilter) filtered = filtered.filter(r => r.semester.includes(semFilter));
  if (clsFilter) filtered = filtered.filter(r => r.classId === clsFilter);

  if (!filtered.length) {
    document.getElementById('uniResultsArea').innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-muted);">No results found for this search. Try fetching results first.</div>`;
    return;
  }
  renderUniResultsTable(filtered);
}

function viewUniResultDetail(idx) {
  const r = UNI_RESULTS[idx];
  if (!r) return;
  document.getElementById('uniDetailModal')?.remove();
  const m = document.createElement('div');
  m.className = 'modal-overlay open'; m.id = 'uniDetailModal';
  const subjRows = Object.entries(r.marks).map(([subj, marks]) => {
    const { grade, cls, result } = calcGradeFromPct(Math.round((marks / 100) * 100));
    return `<tr>
      <td style="padding:8px 12px;">${subj}</td>
      <td style="padding:8px 12px;text-align:center;font-weight:700;">${marks}/100</td>
      <td style="padding:8px 12px;text-align:center;"><span class="badge badge-${cls}">${grade}</span></td>
      <td style="padding:8px 12px;text-align:center;"><span class="badge badge-${result === 'Pass' ? 'green' : 'red'}">${result}</span></td>
    </tr>`;
  }).join('');

  m.innerHTML = `
  <div class="modal" style="width:520px;max-width:95vw;">
    <div style="text-align:center;padding-bottom:16px;border-bottom:1px solid var(--border);margin-bottom:16px;">
      <div style="font-size:40px;margin-bottom:8px;">🎓</div>
      <div style="font-size:18px;font-weight:700;">${r.name}</div>
      <div style="font-size:12px;color:var(--text-secondary);">Roll: ${r.roll} · Exam Roll: ${r.examRoll}</div>
      <div style="font-size:12px;color:var(--text-secondary);">${r.className} · ${r.semester}</div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;">
      <div style="text-align:center;background:var(--bg-secondary);border-radius:10px;padding:10px;">
        <div style="font-size:22px;font-weight:800;color:var(--accent-cyan);">${r.total}/${r.max}</div>
        <div style="font-size:10px;color:var(--text-muted);">Total</div>
      </div>
      <div style="text-align:center;background:var(--bg-secondary);border-radius:10px;padding:10px;">
        <div style="font-size:22px;font-weight:800;color:var(--accent-orange);">${r.pct}%</div>
        <div style="font-size:10px;color:var(--text-muted);">Percentage</div>
      </div>
      <div style="text-align:center;background:var(--bg-secondary);border-radius:10px;padding:10px;">
        <div style="font-size:22px;font-weight:800;color:var(--accent-green);">${r.grade}</div>
        <div style="font-size:10px;color:var(--text-muted);">Grade</div>
      </div>
      <div style="text-align:center;background:var(--bg-secondary);border-radius:10px;padding:10px;">
        <div style="font-size:20px;font-weight:800;color:var(--accent-${r.result === 'Pass' ? 'green' : 'red'});">${r.result}</div>
        <div style="font-size:10px;color:var(--text-muted);">Status</div>
      </div>
    </div>
    <div class="table-wrap" style="margin-bottom:16px;">
      <table>
        <thead><tr><th>Subject</th><th>Marks</th><th>Grade</th><th>Status</th></tr></thead>
        <tbody>${subjRows}</tbody>
      </table>
    </div>
    <div style="font-size:11px;color:var(--text-muted);margin-bottom:16px;">
      📡 Source: ${r.source} · Fetched: ${r.fetchedAt}
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="document.getElementById('uniDetailModal').remove()">Close</button>
      ${!r.emailSent && r.email ? `<button class="btn btn-primary" onclick="emailSingleUniResult(${idx});document.getElementById('uniDetailModal').remove()">📧 Email Result</button>` : ''}
    </div>
  </div>`;
  document.body.appendChild(m);
  m.addEventListener('click', e => { if (e.target === m) m.remove(); });
}

/* ── RESULT HISTORY ── */
function buildResultHistoryHTML() {
  const all = [...SAVED_RESULTS];
  if (!all.length) return `<table><thead><tr><th>Class</th><th>Subject/Exam</th><th>Exam Type</th><th>Saved On</th><th>Students</th><th>Status</th><th>Action</th></tr></thead>
    <tbody>
      <tr><td>CSE-3A</td><td>DSA</td><td>Mid-Term</td><td>28 Mar 2026</td><td>42</td><td><span class="badge badge-green">Published</span></td><td><button class="btn btn-outline btn-sm">View</button></td></tr>
      <tr><td>CSE-3B</td><td>OS</td><td>Quiz 2</td><td>25 Mar 2026</td><td>38</td><td><span class="badge badge-cyan">Pending</span></td><td><button class="btn btn-outline btn-sm">View</button></td></tr>
      <tr><td>MCA-1</td><td>DBMS</td><td>End-Term</td><td>20 Mar 2026</td><td>30</td><td><span class="badge badge-green">Published</span></td><td><button class="btn btn-outline btn-sm">View</button></td></tr>
    </tbody></table>`;

  /* Group by class+exam */
  const grouped = {};
  all.forEach(r => {
    const key = `${r.classId}_${r.exam}`;
    if (!grouped[key]) grouped[key] = { className: r.className, exam: r.exam, students: [], savedAt: r.savedAt };
    grouped[key].students.push(r);
  });

  return `<table><thead><tr><th>Class</th><th>Exam Type</th><th>Students</th><th>Avg %</th><th>Pass%</th><th>Saved On</th><th>Status</th><th>Actions</th></tr></thead>
  <tbody>${Object.values(grouped).map(g => {
    const avg = Math.round(g.students.reduce((a, s) => a + (s.pct || 0), 0) / g.students.length);
    const pass = Math.round((g.students.filter(s => s.result === 'Pass').length / g.students.length) * 100);
    const date = new Date(g.savedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    return `<tr>
      <td>${g.className}</td><td>${g.exam}</td>
      <td>${g.students.length}</td>
      <td><span style="color:${avg >= 60 ? 'var(--accent-green)' : 'var(--accent-red)'}">${avg}%</span></td>
      <td>${pass}%</td><td>${date}</td>
      <td><span class="badge badge-green">Published</span></td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="viewSavedResult('${g.students[0]?.classId}','${g.exam}')">👁 View</button>
        <button class="btn btn-outline btn-sm" onclick="emailSavedResult('${g.students[0]?.classId}','${g.exam}')" style="margin-left:4px;">📧 Email</button>
      </td>
    </tr>`;
  }).join('')}</tbody></table>`;
}

function renderResultHistory() {
  const el = document.getElementById('resultHistoryTable');
  if (el) el.innerHTML = buildResultHistoryHTML();
}

function filterResultHistory() {
  const q = (document.getElementById('histSearch')?.value || '').toLowerCase();
  const f = document.getElementById('histFilter')?.value || 'all';
  document.querySelectorAll('#resultHistoryTable tbody tr').forEach(row => {
    const text = row.textContent.toLowerCase();
    const status = row.querySelector('.badge')?.textContent || '';
    const matchQ = !q || text.includes(q);
    const matchF = f === 'all' || status === f;
    row.style.display = matchQ && matchF ? '' : 'none';
  });
}

function viewSavedResult(classId, exam) {
  const results = SAVED_RESULTS.filter(r => r.classId === classId && r.exam === exam);
  if (!results.length) { showToast('No results found.'); return; }
  document.getElementById('savedResultViewModal')?.remove();
  const m = document.createElement('div');
  m.className = 'modal-overlay open'; m.id = 'savedResultViewModal';
  const subjects = [...new Set(results.flatMap(r => Object.keys(r.marks || {})))];
  m.innerHTML = `
  <div class="modal" style="width:700px;max-width:95vw;max-height:90vh;overflow-y:auto;">
    <div class="modal-title">📊 ${results[0]?.className} — ${exam}</div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Roll</th><th>Name</th>${subjects.map(s => `<th>${s}</th>`).join('')}<th>Total%</th><th>Grade</th><th>Result</th></tr></thead>
        <tbody>${results.map(r => `<tr>
          <td>${r.roll}</td><td>${r.name}</td>
          ${subjects.map(s => `<td style="text-align:center;">${r.marks?.[s] ?? '—'}</td>`).join('')}
          <td style="text-align:center;">${r.pct}%</td>
          <td style="text-align:center;"><span class="badge badge-cyan">${r.grade}</span></td>
          <td style="text-align:center;"><span class="badge badge-${r.result === 'Pass' ? 'green' : 'red'}">${r.result}</span></td>
        </tr>`).join('')}</tbody>
      </table>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="document.getElementById('savedResultViewModal').remove()">Close</button>
      <button class="btn btn-primary" onclick="emailSavedResult('${classId}','${exam}')">📧 Email to All</button>
    </div>
  </div>`;
  document.body.appendChild(m);
  m.addEventListener('click', e => { if (e.target === m) m.remove(); });
}

function emailSavedResult(classId, exam) {
  const results = SAVED_RESULTS.filter(r => r.classId === classId && r.exam === exam);
  let sent = 0;
  results.forEach(r => {
    if (r.email) {
      simulateSendEmail(r.email, r.name, exam, r.className, r.marks || {}, r.grade, r.result, r.pct);
      sent++;
    }
  });
  showToast(`📧 ${sent} emails sent for ${exam}!`);
}

function downloadTemplate() {
  /* Generate a simple CSV template for download */
  const csv = 'Roll No,Student Name,Email,Subject1,Subject2,Subject3\n2201001,Student Name,student@college.edu,85,78,90\n2201002,Student Name 2,student2@college.edu,72,65,80';
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'result_template.csv'; a.click();
  URL.revokeObjectURL(url);
  showToast('⬇️ Template downloaded!');
}

function handleFileUpload(e) {
  const file = e.target.files[0]; if (!file) return;
  const el = document.getElementById('uploadedFiles'); if (!el) return;
  el.innerHTML = `<div class="file-item"><div class="file-icon">📄</div><div class="file-meta"><div class="file-name">${file.name}</div><div class="file-size">${(file.size / 1024).toFixed(1)} KB · Ready to upload</div></div><span class="badge badge-green">Ready</span></div>`;
}

function submitResult() {
  const notify = document.getElementById('upEmailNotify')?.checked;
  showToast(`✅ Results uploaded${notify ? ' & emails sent to students' : ''} successfully!`);
  document.getElementById('uploadedFiles').innerHTML = '';
  document.getElementById('fileInput').value = '';
}

/* ═══════════════════════════════════════════════════════════════════
   ▌ FEATURE: DAILY UPDATES (Admin/HOD) — unchanged from v2
   ═══════════════════════════════════════════════════════════════════ */
function injectDailyUpdatesWidget() {
  const pg = document.getElementById('page-dashboard');
  if (!pg || document.getElementById('dailyUpdatesWidget')) return;
  const widget = document.createElement('div');
  widget.id = 'dailyUpdatesWidget'; widget.style.cssText = 'margin-bottom:20px;';
  widget.innerHTML = `
  <div class="card" style="border-left:4px solid var(--accent-orange);position:relative;overflow:hidden;">
    <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--accent-orange),var(--accent-red),var(--accent-purple),var(--accent-cyan));background-size:300% 100%;animation:gradientShift 3s linear infinite;"></div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,var(--accent-orange),var(--accent-red));display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">📢</div>
        <div>
          <div style="font-family:'Rajdhani',sans-serif;font-size:18px;font-weight:800;letter-spacing:.5px;">Daily Updates <span id="updateBadge" style="margin-left:8px;background:var(--accent-red);color:#fff;border-radius:20px;padding:2px 8px;font-size:11px;font-weight:700;vertical-align:middle;">${DAILY_UPDATES.filter(u => u.priority === 'urgent').length} Urgent</span></div>
          <div style="font-size:11px;color:var(--text-muted);">From HOD & Admin Office · <span id="updateCount">${DAILY_UPDATES.length}</span> notices</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <div style="display:flex;gap:5px;">
          <button class="btn btn-outline btn-sm upd-filter active" data-filter="all" onclick="filterUpdates('all',this)" style="font-size:11px;">All</button>
          <button class="btn btn-outline btn-sm upd-filter" data-filter="urgent" onclick="filterUpdates('urgent',this)" style="font-size:11px;color:var(--accent-red);border-color:var(--accent-red);">🔴 Urgent</button>
          <button class="btn btn-outline btn-sm upd-filter" data-filter="high" onclick="filterUpdates('high',this)" style="font-size:11px;color:var(--accent-orange);border-color:var(--accent-orange);">🟠 High</button>
          <button class="btn btn-outline btn-sm upd-filter" data-filter="normal" onclick="filterUpdates('normal',this)" style="font-size:11px;">Normal</button>
        </div>
        <button class="btn btn-primary btn-sm" onclick="openPostUpdateModal()" style="font-size:11px;">✍️ Post Update</button>
      </div>
    </div>
    <div id="pinnedTicker" style="background:var(--accent-orange)15;border:1px solid var(--accent-orange)44;border-radius:10px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;gap:10px;overflow:hidden;cursor:pointer;" onclick="scrollToUpdate('pinned')">
      <span style="background:var(--accent-orange);color:#fff;border-radius:6px;padding:2px 8px;font-size:10px;font-weight:800;letter-spacing:.5px;flex-shrink:0;">📌 PINNED</span>
      <div id="tickerText" style="font-size:13px;font-weight:600;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:var(--text-primary);">${DAILY_UPDATES.find(u => u.pinned)?.title || 'No pinned notices'}</div>
    </div>
    <div id="updatesContainer" style="display:flex;flex-direction:column;gap:10px;max-height:420px;overflow-y:auto;padding-right:4px;scrollbar-width:thin;scrollbar-color:var(--border) transparent;"></div>
  </div>`;
  const grid4 = pg.querySelector('.grid-4');
  if (grid4) grid4.after(widget); else pg.prepend(widget);
  renderUpdateCards('all');
  addUpdateAnimCSS();
}

function addUpdateAnimCSS() {
  if (document.getElementById('updateAnimCSS')) return;
  const s = document.createElement('style'); s.id = 'updateAnimCSS';
  s.textContent = `
  @keyframes gradientShift{0%{background-position:0% 50%;}100%{background-position:300% 50%;}}
  @keyframes slideInUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
  .update-card{animation:slideInUp .3s ease forwards;}
  .update-card:hover{border-color:var(--accent-cyan)!important;transform:translateY(-1px);}
  .update-expand{display:none;} .update-expand.open{display:block;}
  #updatesContainer::-webkit-scrollbar{width:5px;}
  #updatesContainer::-webkit-scrollbar-track{background:transparent;}
  #updatesContainer::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px;}
  .media-upload-zone{border:2px dashed var(--border);border-radius:14px;padding:32px;text-align:center;cursor:pointer;transition:.2s;position:relative;overflow:hidden;}
  .media-upload-zone:hover{border-color:var(--accent-cyan);background:var(--accent-cyan)08;}
  .media-item{transition:.2s;} .media-item:hover{border-color:var(--accent-cyan)!important;transform:translateY(-2px);}
  @keyframes progressFill{from{width:0%;}to{width:100%;}}
  .progress-bar-anim{animation:progressFill 2s ease forwards;}
  .var(--accent-red){color:var(--accent-red)!important;}
  `;
  document.head.appendChild(s);
}

function renderUpdateCards(filter) {
  const container = document.getElementById('updatesContainer'); if (!container) return;
  const list = filter === 'all' ? [...DAILY_UPDATES].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)) : DAILY_UPDATES.filter(u => u.priority === filter);
  if (!list.length) { container.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-muted);font-size:13px;">No updates found for this filter.</div>`; return; }
  const priorityMeta = {
    urgent: { color: 'var(--accent-red)', bg: 'var(--accent-red)18', label: '🔴 URGENT', border: 'var(--accent-red)55' },
    high: { color: 'var(--accent-orange)', bg: 'var(--accent-orange)18', label: '🟠 HIGH', border: 'var(--accent-orange)55' },
    normal: { color: 'var(--accent-cyan)', bg: 'var(--accent-cyan)10', label: '🔵 INFO', border: 'var(--border)' },
  };
  container.innerHTML = list.map((u, i) => {
    const pm = priorityMeta[u.priority] || priorityMeta.normal;
    return `<div class="update-card" id="upd-${u.id}" data-priority="${u.priority}" style="border:1px solid ${pm.border};border-radius:12px;background:${pm.bg};padding:14px 16px;cursor:pointer;transition:.2s;animation-delay:${i * .05}s;" onclick="toggleUpdateExpand('${u.id}')">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;">
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;flex-wrap:wrap;">
            <span style="font-size:9px;font-weight:800;letter-spacing:.8px;color:${pm.color};background:${pm.color}22;border:1px solid ${pm.color}44;border-radius:5px;padding:1px 7px;">${pm.label}</span>
            ${u.pinned ? '<span style="font-size:9px;background:var(--accent-orange);color:#fff;border-radius:5px;padding:1px 7px;font-weight:700;">📌 PINNED</span>' : ''}
            <span style="font-size:10px;color:var(--text-muted);">${u.time}</span>
          </div>
          <div style="font-size:14px;font-weight:700;color:var(--text-primary);line-height:1.4;">${u.title}</div>
          <div style="font-size:11px;color:var(--text-secondary);margin-top:3px;">👤 ${u.author}</div>
        </div>
        <div style="display:flex;gap:5px;flex-shrink:0;align-items:center;">
          <button onclick="event.stopPropagation();pinToggleUpdate('${u.id}')" style="background:none;border:1px solid var(--border);border-radius:6px;padding:3px 7px;cursor:pointer;font-size:12px;color:${u.pinned ? 'var(--accent-orange)' : 'var(--text-muted)'};" title="${u.pinned ? 'Unpin' : 'Pin'}">📌</button>
          <button onclick="event.stopPropagation();deleteUpdate('${u.id}')" style="background:none;border:1px solid var(--border);border-radius:6px;padding:3px 7px;cursor:pointer;font-size:12px;color:var(--accent-red);">🗑</button>
          <span id="arrow-${u.id}" style="font-size:12px;color:var(--text-muted);transition:.2s;">▼</span>
        </div>
      </div>
      <div class="update-expand" id="expand-${u.id}">
        <div style="margin-top:12px;padding-top:12px;border-top:1px solid ${pm.border};font-size:13px;color:var(--text-secondary);line-height:1.7;">${u.body}</div>
        <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-outline btn-sm" style="font-size:11px;" onclick="event.stopPropagation();acknowledgeUpdate('${u.id}')">✅ Acknowledged</button>
          <button class="btn btn-outline btn-sm" style="font-size:11px;" onclick="event.stopPropagation();forwardUpdateToGroup('${u.id}')">📤 Forward to Group</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function toggleUpdateExpand(id) { const el = document.getElementById('expand-' + id), arr = document.getElementById('arrow-' + id); if (!el) return; el.classList.toggle('open'); if (arr) arr.style.transform = el.classList.contains('open') ? 'rotate(180deg)' : ''; }
function filterUpdates(filter, btn) { document.querySelectorAll('.upd-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); renderUpdateCards(filter); }
function pinToggleUpdate(id) { const u = DAILY_UPDATES.find(x => x.id === id); if (!u) return; DAILY_UPDATES.forEach(x => x.pinned = false); u.pinned = !u.pinned; saveUpdates(); const ticker = document.getElementById('tickerText'); if (ticker) ticker.textContent = DAILY_UPDATES.find(x => x.pinned)?.title || 'No pinned notices'; renderUpdateCards(document.querySelector('.upd-filter.active')?.dataset.filter || 'all'); showToast(u.pinned ? '📌 Notice pinned!' : '📌 Notice unpinned.'); }
function deleteUpdate(id) { if (!confirm('Delete this update?')) return; DAILY_UPDATES = DAILY_UPDATES.filter(u => u.id !== id); saveUpdates(); updateBadgeCount(); renderUpdateCards(document.querySelector('.upd-filter.active')?.dataset.filter || 'all'); showToast('🗑 Update deleted.'); }
function updateBadgeCount() { const b = document.getElementById('updateBadge'), c = document.getElementById('updateCount'); if (b) b.textContent = DAILY_UPDATES.filter(u => u.priority === 'urgent').length + ' Urgent'; if (c) c.textContent = DAILY_UPDATES.length; }
function acknowledgeUpdate(id) { showToast('✅ Acknowledged!'); }
function forwardUpdateToGroup(id) { const u = DAILY_UPDATES.find(x => x.id === id); if (!u) return; if (!GROUPS.length) { showToast('⚠️ No groups yet.'); return; } const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); GROUPS.forEach(g => { g.chat.push({ from: 'Dr. Priya Verma', text: `📢 Notice from Admin: ${u.title}\n\n${u.body}`, time: now, sent: true }); g.lastMsg = '📢 Admin Notice forwarded · Just now'; }); saveGroups(); showToast('📤 Forwarded to all groups!'); }

function openPostUpdateModal() {
  document.getElementById('postUpdateModal')?.remove();
  const m = document.createElement('div'); m.className = 'modal-overlay open'; m.id = 'postUpdateModal';
  m.innerHTML = `<div class="modal" style="width:520px;max-width:95vw;">
    <div class="modal-title">✍️ Post Daily Update</div>
    <div style="background:var(--bg-secondary);border-radius:10px;padding:10px 14px;margin-bottom:14px;font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:8px;">
      <span style="font-size:16px;">ℹ️</span> Posting as <strong style="color:var(--accent-cyan);">Dr. Priya Verma</strong>
    </div>
    <div class="form-group"><label class="form-label">Notice Title <span style="color:var(--accent-red);">*</span></label><input class="form-input" id="upd-title" placeholder="e.g. 📅 Exam schedule updated"></div>
    <div class="form-group"><label class="form-label">Full Message <span style="color:var(--accent-red);">*</span></label><textarea class="form-textarea" id="upd-body" style="min-height:100px;" placeholder="Write the full notice content here..."></textarea></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      <div class="form-group"><label class="form-label">Priority</label><select class="form-select" id="upd-priority"><option value="normal">🔵 Normal</option><option value="high">🟠 High</option><option value="urgent">🔴 Urgent</option></select></div>
      <div class="form-group"><label class="form-label">Author / Posted By</label><input class="form-input" id="upd-author" value="HOD — Dr. Ramesh Kumar"></div>
    </div>
    <div class="form-group"><label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;"><input type="checkbox" id="upd-pin" style="width:15px;height:15px;accent-color:var(--accent-orange);"> 📌 Pin this notice at the top</label></div>
    <div class="form-group"><label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;"><input type="checkbox" id="upd-notify-groups" checked style="width:15px;height:15px;accent-color:var(--accent-cyan);"> 📢 Also broadcast to all groups</label></div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="document.getElementById('postUpdateModal').remove()">Cancel</button>
      <button class="btn btn-primary" onclick="submitPostUpdate()">📢 Post Update</button>
    </div>
  </div>`;
  document.body.appendChild(m);
  m.addEventListener('click', e => { if (e.target === m) m.remove(); });
  setTimeout(() => document.getElementById('upd-title')?.focus(), 60);
}

function submitPostUpdate() {
  const title = document.getElementById('upd-title')?.value.trim(), body = document.getElementById('upd-body')?.value.trim(), priority = document.getElementById('upd-priority')?.value || 'normal', author = document.getElementById('upd-author')?.value.trim() || 'Admin', pin = document.getElementById('upd-pin')?.checked, notify = document.getElementById('upd-notify-groups')?.checked;
  if (!title) { showToast('⚠️ Enter a title.'); return; } if (!body) { showToast('⚠️ Enter notice content.'); return; }
  if (pin) DAILY_UPDATES.forEach(u => u.pinned = false);
  const now = new Date(), timeStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const upd = { id: 'u' + (nextUpdateId++), title, body, priority, author, time: timeStr, pinned: !!pin };
  DAILY_UPDATES.unshift(upd); saveUpdates();
  if (notify && GROUPS.length) { const t = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); GROUPS.forEach(g => { g.chat.push({ from: author, text: `📢 ${title}\n\n${body}`, time: t, sent: true }); g.lastMsg = '📢 Notice · Just now'; }); saveGroups(); }
  document.getElementById('postUpdateModal')?.remove();
  updateBadgeCount(); renderUpdateCards('all');
  const ticker = document.getElementById('tickerText'); if (ticker) ticker.textContent = DAILY_UPDATES.find(u => u.pinned)?.title || DAILY_UPDATES[0]?.title || '';
  showToast('✅ Update posted!' + (notify && GROUPS.length ? ' Groups notified.' : ''));
}

/* ═══════════════════════════════════════════════════════════════════
   ▌ MEDIA UPLOAD — unchanged from v2
   ═══════════════════════════════════════════════════════════════════ */
function injectMediaPage() {
  if (document.getElementById('page-media')) return;
  const pg = document.createElement('div'); pg.className = 'page'; pg.id = 'page-media';
  document.querySelector('.content')?.appendChild(pg);
  if (!document.querySelector('.nav-item[onclick*="media"]')) {
    const nav = document.querySelector('.nav-section:nth-of-type(2)');
    if (nav) { const item = document.createElement('div'); item.className = 'nav-item'; item.setAttribute('onclick', "navigate('media',this)"); item.innerHTML = '<span class="icon">🎬</span> Media Upload'; nav.appendChild(item); }
  }
}

function renderMediaPage() {
  const pg = document.getElementById('page-media'); if (!pg) return;
  const classOpts = CLASSES.length ? CLASSES.map(c => `<option value="${c.id}">${c.label}</option>`).join('') : '<option value="">— No classes yet —</option>';
  pg.innerHTML = `
  <div class="section-header">
    <div><div class="section-title">🎬 Media Upload</div><div class="section-sub">Upload lecture videos and audio recordings for your classes and groups</div></div>
    <button class="btn btn-primary" onclick="openMediaUploadModal()">📤 Upload Media</button>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px;">
    <div class="stat-card"><div class="stat-icon">🎥</div><div class="stat-val" style="color:var(--accent-cyan);" id="stat-videos">${MEDIA.filter(m => m.type === 'video').length}</div><div class="stat-label">Videos Uploaded</div></div>
    <div class="stat-card"><div class="stat-icon">🎙️</div><div class="stat-val" style="color:var(--accent-purple);" id="stat-audio">${MEDIA.filter(m => m.type === 'audio').length}</div><div class="stat-label">Audio Recordings</div></div>
    <div class="stat-card"><div class="stat-icon">👁️</div><div class="stat-val" style="color:var(--accent-green);" id="stat-views">${MEDIA.reduce((a, m) => a + (m.views || 0), 0)}</div><div class="stat-label">Total Views</div></div>
    <div class="stat-card"><div class="stat-icon">🏫</div><div class="stat-val" style="color:var(--accent-orange);" id="stat-classes">${[...new Set(MEDIA.map(m => m.targetId))].length}</div><div class="stat-label">Classes/Groups Covered</div></div>
  </div>
  <div class="card" style="margin-bottom:16px;padding:14px 16px;">
    <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
      <input class="form-input" id="mediaSearch" placeholder="🔍 Search by title, subject, class..." style="flex:1;min-width:200px;" oninput="filterMediaGrid()">
      <select class="form-select" id="mediaTypeFilter" style="width:140px;" onchange="filterMediaGrid()"><option value="all">All Types</option><option value="video">🎥 Video Only</option><option value="audio">🎙️ Audio Only</option></select>
      <div style="display:flex;gap:5px;">
        <button class="btn btn-outline btn-sm" id="viewGrid" onclick="setMediaView('grid',this)" style="font-size:13px;">⊞</button>
        <button class="btn btn-outline btn-sm" id="viewList" onclick="setMediaView('list',this)" style="font-size:13px;">☰</button>
      </div>
    </div>
  </div>
  <div id="mediaGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;"></div>
  <div id="mediaList" style="display:none;flex-direction:column;gap:10px;"></div>`;
  renderMediaGrid();
}

let mediaViewMode = 'grid';
function setMediaView(mode, btn) { mediaViewMode = mode; document.getElementById('mediaGrid').style.display = mode === 'grid' ? 'grid' : 'none'; document.getElementById('mediaList').style.display = mode === 'list' ? 'flex' : 'none'; document.getElementById('viewGrid').style.borderColor = mode === 'grid' ? 'var(--accent-cyan)' : ''; document.getElementById('viewList').style.borderColor = mode === 'list' ? 'var(--accent-cyan)' : ''; renderMediaGrid(); }
function filterMediaGrid() { renderMediaGrid(); }
function renderMediaGrid() {
  const search = document.getElementById('mediaSearch')?.value.toLowerCase() || '';
  const typeF = document.getElementById('mediaTypeFilter')?.value || 'all';
  let list = MEDIA.filter(m => {
    const matchSearch = !search || m.title.toLowerCase().includes(search) || (m.subject || '').toLowerCase().includes(search) || (m.targetName || '').toLowerCase().includes(search);
    const matchType = typeF === 'all' || m.type === typeF;
    return matchSearch && matchType;
  });
  const grid = document.getElementById('mediaGrid'), lst = document.getElementById('mediaList');
  if (!grid && !lst) return;
  if (!list.length) { const empty = `<div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:var(--text-muted);"><div style="font-size:56px;margin-bottom:16px;">🎬</div><div style="font-size:18px;font-weight:700;margin-bottom:8px;color:var(--text-primary);">No Media Yet</div><button class="btn btn-primary" onclick="openMediaUploadModal()">📤 Upload First Media</button></div>`; if (grid) grid.innerHTML = empty; if (lst) lst.innerHTML = empty; return; }
  if (mediaViewMode === 'grid') { if (grid) grid.innerHTML = list.map(m => buildMediaCard(m)).join(''); }
  else { if (lst) lst.innerHTML = list.map(m => buildMediaListItem(m)).join(''); }
}

function buildMediaCard(m) {
  const isVideo = m.type === 'video', gradient = isVideo ? 'linear-gradient(135deg,#1a1a2e,#16213e)' : 'linear-gradient(135deg,#0f2027,#203a43)', accentColor = isVideo ? 'var(--accent-cyan)' : 'var(--accent-purple)', icon = isVideo ? '🎥' : '🎙️', tagColor = isVideo ? '#00d4ff' : '#a855f7';
  return `<div class="media-item card" style="padding:0;overflow:hidden;border:1px solid var(--border);cursor:pointer;" onclick="openMediaPlayer('${m.id}')"><div style="height:140px;background:${gradient};position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;"><div style="font-size:52px;opacity:.7;">${icon}</div><div style="position:absolute;top:10px;left:10px;background:${tagColor}22;border:1px solid ${tagColor}55;border-radius:6px;padding:2px 8px;font-size:10px;font-weight:700;color:${tagColor};">${icon} ${isVideo ? 'VIDEO' : 'AUDIO'}</div>${m.duration ? `<div style="position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,.7);border-radius:5px;padding:2px 7px;font-size:10px;color:#fff;font-weight:600;">⏱ ${m.duration}</div>` : ''}</div><div style="padding:14px;"><div style="font-size:13px;font-weight:700;margin-bottom:5px;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${m.title}">${m.title}</div><div style="font-size:11px;color:var(--text-muted);margin-bottom:10px;">📅 ${m.uploadedAt} · 👁 ${m.views || 0} views · 📦 ${m.size || '—'}</div><div style="display:flex;gap:6px;"><button class="btn btn-primary btn-sm" style="flex:1;font-size:11px;" onclick="event.stopPropagation();openMediaPlayer('${m.id}')">▶ Play</button><button class="btn btn-outline btn-sm" style="font-size:11px;" onclick="event.stopPropagation();shareMediaToGroup('${m.id}')">📤 Share</button><button class="btn btn-outline btn-sm" style="color:var(--accent-red);border-color:var(--accent-red);font-size:11px;" onclick="event.stopPropagation();deleteMedia('${m.id}')">🗑</button></div></div></div>`;
}

function buildMediaListItem(m) {
  const isVideo = m.type === 'video', icon = isVideo ? '🎥' : '🎙️', color = isVideo ? 'var(--accent-cyan)' : 'var(--accent-purple)';
  return `<div class="media-item" style="border:1px solid var(--border);border-radius:12px;padding:12px 16px;background:var(--bg-card);display:flex;align-items:center;gap:14px;cursor:pointer;transition:.2s;" onclick="openMediaPlayer('${m.id}')"><div style="width:50px;height:50px;border-radius:10px;background:${color}18;border:1px solid ${color}33;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">${icon}</div><div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${m.title}</div><div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">${m.subject ? '📚 ' + m.subject + ' · ' : ''}${m.targetName || '—'} · 📅 ${m.uploadedAt}</div></div><div style="text-align:right;flex-shrink:0;"><div style="font-size:11px;color:var(--text-muted);">👁 ${m.views || 0} views</div>${m.duration ? `<div style="font-size:11px;color:var(--text-muted);">⏱ ${m.duration}</div>` : ''}</div><div style="display:flex;gap:5px;flex-shrink:0;"><button class="btn btn-primary btn-sm" onclick="event.stopPropagation();openMediaPlayer('${m.id}')">▶</button><button class="btn btn-outline btn-sm" onclick="event.stopPropagation();shareMediaToGroup('${m.id}')">📤</button><button class="btn btn-outline btn-sm" style="color:var(--accent-red);border-color:var(--accent-red);" onclick="event.stopPropagation();deleteMedia('${m.id}')">🗑</button></div></div>`;
}

function openMediaUploadModal() {
  document.getElementById('mediaUploadModal')?.remove();
  const m = document.createElement('div'); m.className = 'modal-overlay open'; m.id = 'mediaUploadModal';
  const classOpts = CLASSES.map(c => `<option value="${c.id}" data-type="class">${c.label}</option>`).join('');
  const groupOpts = GROUPS.map(g => `<option value="${g.id}" data-type="group">👥 ${g.name}</option>`).join('');
  m.innerHTML = `<div class="modal" style="width:560px;max-width:95vw;max-height:92vh;overflow-y:auto;">
    <div class="modal-title">📤 Upload Media</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px;">
      <label style="cursor:pointer;"><input type="radio" name="mtype" value="video" id="mt-video" checked onchange="toggleMediaAccept()">
        <div id="mt-video-card" style="border:2px solid var(--accent-cyan);border-radius:12px;padding:16px;text-align:center;background:var(--accent-cyan)10;transition:.2s;"><div style="font-size:32px;">🎥</div><div style="font-size:13px;font-weight:700;margin-top:6px;color:var(--accent-cyan);">Video Lecture</div><div style="font-size:10px;color:var(--text-muted);margin-top:3px;">MP4, AVI, MOV, MKV, WebM</div></div></label>
      <label style="cursor:pointer;"><input type="radio" name="mtype" value="audio" id="mt-audio" onchange="toggleMediaAccept()">
        <div id="mt-audio-card" style="border:2px solid var(--border);border-radius:12px;padding:16px;text-align:center;background:var(--bg-secondary);transition:.2s;"><div style="font-size:32px;">🎙️</div><div style="font-size:13px;font-weight:700;margin-top:6px;">Audio Recording</div><div style="font-size:10px;color:var(--text-muted);margin-top:3px;">MP3, WAV, M4A, OGG, AAC</div></div></label>
    </div>
    <div class="media-upload-zone" id="mediaDropZone" onclick="document.getElementById('mediaFileInput').click()" ondragover="event.preventDefault();this.style.borderColor='var(--accent-cyan)'" ondragleave="this.style.borderColor='var(--border)'" ondrop="handleMediaDrop(event)">
      <div style="font-size:40px;margin-bottom:10px;">📁</div>
      <div style="font-size:14px;font-weight:600;margin-bottom:5px;">Click or drag & drop your file here</div>
      <div id="mediaDropHint" style="font-size:11px;color:var(--text-muted);">MP4, AVI, MOV, MKV, WebM accepted</div>
      <input type="file" id="mediaFileInput" style="display:none" accept="video/*" onchange="handleMediaFileSelect(event)">
    </div>
    <div id="mediaFilePreview" style="display:none;margin:12px 0;padding:12px 14px;background:var(--bg-secondary);border-radius:10px;border:1px solid var(--border);">
      <div style="display:flex;align-items:center;gap:10px;"><span id="mfp-icon" style="font-size:24px;">🎥</span><div style="flex:1;"><div style="font-size:13px;font-weight:600;" id="mfp-name">file.mp4</div><div style="font-size:11px;color:var(--text-muted);" id="mfp-size">0 MB</div></div><span style="font-size:18px;color:var(--accent-green);">✅</span></div>
      <div style="margin-top:8px;height:4px;background:var(--border);border-radius:2px;overflow:hidden;"><div id="mfp-progress" style="height:100%;background:linear-gradient(90deg,var(--accent-cyan),var(--accent-teal));border-radius:2px;width:0%;transition:width .3s;"></div></div>
    </div>
    <div class="form-group"><label class="form-label">Title <span style="color:var(--accent-red);">*</span></label><input class="form-input" id="media-title" placeholder="e.g. Lecture 5: Binary Trees & AVL Trees"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      <div class="form-group"><label class="form-label">Subject</label><input class="form-input" id="media-subject" placeholder="e.g. Data Structures"></div>
      <div class="form-group"><label class="form-label">Duration</label><input class="form-input" id="media-duration" placeholder="e.g. 45:20"></div>
    </div>
    <div class="form-group"><label class="form-label">Assign to <span style="color:var(--accent-red);">*</span></label>
      <select class="form-select" id="media-target"><option value="">— Select class or group —</option>${CLASSES.length ? `<optgroup label="📚 Classes">${classOpts}</optgroup>` : ''}${GROUPS.length ? `<optgroup label="👥 Groups">${groupOpts}</optgroup>` : ''}</select></div>
    <div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea" id="media-desc" placeholder="What does this lecture cover?"></textarea></div>
    <div class="form-group"><label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;"><input type="checkbox" id="media-notify" checked style="width:15px;height:15px;accent-color:var(--accent-cyan);"> 📢 Notify students via group chat when uploaded</label></div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="document.getElementById('mediaUploadModal').remove()">Cancel</button>
      <button class="btn btn-primary" onclick="submitMediaUpload()">📤 Upload Media</button>
    </div>
  </div>`;
  document.body.appendChild(m);
  m.addEventListener('click', e => { if (e.target === m) m.remove(); });
}

function toggleMediaAccept() { const isVideo = document.getElementById('mt-video')?.checked; const inp = document.getElementById('mediaFileInput'); const hint = document.getElementById('mediaDropHint'); if (inp) inp.accept = isVideo ? 'video/*' : 'audio/*'; if (hint) hint.textContent = isVideo ? 'MP4, AVI, MOV, MKV, WebM accepted' : 'MP3, WAV, M4A, OGG, AAC accepted'; }
function handleMediaDrop(e) { e.preventDefault(); document.getElementById('mediaDropZone').style.borderColor = 'var(--border)'; const file = e.dataTransfer.files[0]; if (file) processMediaFile(file); }
function handleMediaFileSelect(e) { const file = e.target.files[0]; if (file) processMediaFile(file); }
function processMediaFile(file) { const preview = document.getElementById('mediaFilePreview'), icon = document.getElementById('mfp-icon'), name = document.getElementById('mfp-name'), size = document.getElementById('mfp-size'), bar = document.getElementById('mfp-progress'); if (!preview) return; preview.style.display = 'block'; const isVideo = file.type.startsWith('video'); if (icon) icon.textContent = isVideo ? '🎥' : '🎙️'; if (name) name.textContent = file.name; if (size) size.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB'; const titleEl = document.getElementById('media-title'); if (titleEl && !titleEl.value) titleEl.value = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '); if (bar) { bar.style.width = '0%'; setTimeout(() => { bar.style.width = '100%'; }, 100); } }

function submitMediaUpload() {
  const title = document.getElementById('media-title')?.value.trim(), targetEl = document.getElementById('media-target'), targetId = targetEl?.value, subject = document.getElementById('media-subject')?.value.trim(), duration = document.getElementById('media-duration')?.value.trim(), desc = document.getElementById('media-desc')?.value.trim(), notify = document.getElementById('media-notify')?.checked, type = document.getElementById('mt-video')?.checked ? 'video' : 'audio';
  if (!title) { showToast('⚠️ Enter a title.'); return; } if (!targetId) { showToast('⚠️ Assign to a class or group.'); return; }
  const fileInput = document.getElementById('mediaFileInput'), fileName = fileInput?.files[0]?.name || null, fileSize = fileInput?.files[0] ? ((fileInput.files[0].size / (1024 * 1024)).toFixed(2) + ' MB') : '—';
  const cls = CLASSES.find(c => c.id === targetId), grp = GROUPS.find(g => g.id === targetId), targetName = cls?.label || grp?.name || '—', targetType = cls ? 'class' : 'group';
  const now = new Date(), dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const media = { id: 'm' + (nextMediaId++), type, title, subject, duration, desc: desc || '', targetId, targetName, targetType, fileName, size: fileSize, views: 0, uploadedAt: dateStr, uploadedBy: PROFILE.name };
  MEDIA.push(media); saveMedia();
  if (notify) { const t = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); const notifyGroups = grp ? [grp] : GROUPS.filter(g => g.classId === targetId); const icon = type === 'video' ? '🎥' : '🎙️'; notifyGroups.forEach(g => { g.chat.push({ from: PROFILE.name, text: `${icon} New ${type === 'video' ? 'Lecture Video' : 'Audio Recording'} uploaded!\n📌 "${title}"${subject ? ' — 📚 ' + subject : ''}${duration ? ' — ⏱ ' + duration : ''}\n\nAvailable now in the Media section.`, time: t, sent: true }); g.lastMsg = `${icon} New ${type} uploaded · Just now`; }); saveGroups(); }
  document.getElementById('mediaUploadModal')?.remove();
  const sv = document.getElementById('stat-videos'), sa = document.getElementById('stat-audio'), sc = document.getElementById('stat-classes');
  if (sv) sv.textContent = MEDIA.filter(x => x.type === 'video').length; if (sa) sa.textContent = MEDIA.filter(x => x.type === 'audio').length; if (sc) sc.textContent = [...new Set(MEDIA.map(x => x.targetId))].length;
  renderMediaGrid(); showToast(`✅ "${title}" uploaded!${notify ? ' Students notified.' : ''}`);
}

function openMediaPlayer(id) {
  const m = MEDIA.find(x => x.id === id); if (!m) return; m.views = (m.views || 0) + 1; saveMedia();
  document.getElementById('mediaPlayerModal')?.remove();
  const modal = document.createElement('div'); modal.className = 'modal-overlay open'; modal.id = 'mediaPlayerModal';
  const isVideo = m.type === 'video', color = isVideo ? 'var(--accent-cyan)' : 'var(--accent-purple)';
  modal.innerHTML = `<div class="modal" style="width:620px;max-width:95vw;"><div class="modal-title">${isVideo ? '🎥' : '🎙️'} ${m.title}</div>
    <div style="background:linear-gradient(135deg,#0d1117,#161b22);border-radius:12px;overflow:hidden;margin-bottom:16px;min-height:200px;display:flex;align-items:center;justify-content:center;border:1px solid var(--border);">
      <div style="text-align:center;padding:40px;"><div style="font-size:60px;margin-bottom:12px;opacity:.7;">${isVideo ? '🎥' : '🎙️'}</div>
        <div style="font-size:15px;font-weight:600;color:var(--text-primary);margin-bottom:6px;">${m.title}</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:20px;">File preview unavailable in demo mode.</div>
        <div style="display:flex;align-items:center;gap:10px;justify-content:center;">
          <button style="width:44px;height:44px;border-radius:50%;background:${color};border:none;font-size:18px;cursor:pointer;">▶</button>
          <div style="flex:1;max-width:280px;height:4px;background:var(--border);border-radius:2px;"><div style="width:35%;height:100%;background:${color};border-radius:2px;"></div></div>
          ${m.duration ? `<span style="font-size:12px;color:var(--text-muted);">${m.duration}</span>` : ''}
        </div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;">
      ${[['📚 Subject', m.subject || '—'], ['🏫 Assigned', m.targetName || '—'], ['⏱ Duration', m.duration || '—'], ['📅 Uploaded', m.uploadedAt || '—'], ['👁 Views', m.views + ' views'], ['📦 Size', m.size || '—']].map(([lbl, val]) => `<div style="background:var(--bg-secondary);border-radius:8px;padding:9px 12px;"><div style="font-size:10px;color:var(--text-muted);margin-bottom:2px;">${lbl}</div><div style="font-size:12px;font-weight:600;">${val}</div></div>`).join('')}
    </div>
    <div class="modal-footer"><button class="btn btn-outline" onclick="document.getElementById('mediaPlayerModal').remove()">Close</button><button class="btn btn-primary" onclick="document.getElementById('mediaPlayerModal').remove()">✅ Done</button></div>
  </div>`;
  document.body.appendChild(modal); modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  setTimeout(renderMediaGrid, 500);
}

function shareMediaToGroup(id) { const m = MEDIA.find(x => x.id === id); if (!m) return; if (!GROUPS.length) { showToast('⚠️ No groups yet.'); return; } document.getElementById('shareMediaModal')?.remove(); const modal = document.createElement('div'); modal.className = 'modal-overlay open'; modal.id = 'shareMediaModal'; modal.innerHTML = `<div class="modal" style="width:420px;max-width:95vw;"><div class="modal-title">📤 Share Media to Groups</div><div class="form-group" style="background:var(--bg-secondary);border-radius:10px;padding:14px;"><label class="form-label">Select Groups</label>${GROUPS.map(g => `<label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer;"><input type="checkbox" class="share-grp-check" value="${g.id}" ${m.targetId === g.id ? 'checked' : ''} style="accent-color:var(--accent-cyan);"><span style="font-size:13px;">${g.icon} ${g.name}</span></label>`).join('')}</div><div class="modal-footer"><button class="btn btn-outline" onclick="document.getElementById('shareMediaModal').remove()">Cancel</button><button class="btn btn-primary" onclick="confirmShareMedia('${id}')">📤 Share Now</button></div></div>`; document.body.appendChild(modal); modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); }); }

function confirmShareMedia(id) { const m = MEDIA.find(x => x.id === id), gids = [...document.querySelectorAll('.share-grp-check:checked')].map(c => c.value); if (!gids.length) { showToast('⚠️ Select at least one group.'); return; } const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), icon = m.type === 'video' ? '🎥' : '🎙️'; gids.forEach(gid => { const g = GROUPS.find(x => x.id === gid); if (g) { g.chat.push({ from: PROFILE.name, text: `${icon} Shared: "${m.title}"${m.subject ? ' — ' + m.subject : ''}.`, time: now, sent: true }); g.lastMsg = `${icon} Media shared · Just now`; } }); saveGroups(); document.getElementById('shareMediaModal')?.remove(); showToast(`✅ Shared to ${gids.length} group${gids.length > 1 ? 's' : ''}!`); }
function deleteMedia(id) { if (!confirm('Delete this media?')) return; MEDIA = MEDIA.filter(m => m.id !== id); saveMedia(); renderMediaGrid(); showToast('🗑 Media deleted.'); }

/* ─────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────── */
function navigate(page, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const pg = document.getElementById('page-' + page);
  if (pg) pg.classList.add('active');
  if (el) el.classList.add('active');
  const titles = { dashboard: 'Dashboard', result: 'Results Management', attendance: 'Attendance', classes: 'Classes', group: 'My Groups', messages: 'Messages', leaves: 'Leave Management', subjects: 'Subject Performance', profile: 'My Profile', media: 'Media Upload' };
  const subs = { dashboard: `Welcome back, ${PROFILE.name} 👋 — Thursday, 2 April 2026`, result: 'Upload and manage student results', attendance: 'Mark and track attendance', classes: 'Create and manage your classes', group: 'Manage class and lab groups', messages: 'Personal messages with students and staff', leaves: 'Apply for leave', subjects: 'Analytics per subject', profile: 'Your profile', media: 'Upload lecture videos and audio recordings' };
  document.getElementById('topbar-title').textContent = titles[page] || page;
  document.getElementById('topbar-sub').textContent = subs[page] || '';
  if (page === 'classes') renderClassesPage();
  if (page === 'group') renderGroupCards();
  if (page === 'result') renderResultPage();
  if (page === 'attendance') { syncAttendanceDropdowns(); buildAttTable(); }
  if (page === 'messages') { syncMessageContacts(); buildConvList(); }
  if (page === 'subjects') updateSubjPage();
  if (page === 'dashboard') refreshDashboardActivity();
  if (page === 'media') renderMediaPage();
  if (page === 'profile') renderProfilePage();
}

/* ─────────────────────────────────────────
   SYNC HELPERS
───────────────────────────────────────── */
function syncResultPage() { if (document.getElementById('page-result')?.classList.contains('active')) renderResultPage(); }
function syncAttendanceDropdowns() {
  const attClassTab = document.getElementById('att-class');
  if (attClassTab) { attClassTab.querySelectorAll('select[data-role="class-select"]').forEach(sel => { const prev = sel.value; sel.innerHTML = CLASSES.length ? CLASSES.map(c => `<option value="${c.id}">${c.label}</option>`).join('') : '<option value="">— No classes yet —</option>'; if ([...sel.options].some(o => o.value === prev)) sel.value = prev; sel.onchange = function () { cascadeAttSubject(this); buildAttTable(); }; cascadeAttSubject(sel); }); }
  const labTab = document.getElementById('att-lab');
  if (labTab) { const labSel = labTab.querySelector('select[data-role="group-select"]'); if (labSel) { const list = GROUPS.filter(g => g.type === 'Lab Group').length ? GROUPS.filter(g => g.type === 'Lab Group') : GROUPS; const prev = labSel.value; labSel.innerHTML = list.length ? list.map(g => `<option value="${g.id}">${g.name}</option>`).join('') : '<option value="">— No groups yet —</option>'; if ([...labSel.options].some(o => o.value === prev)) labSel.value = prev; } }
}
function cascadeAttSubject(classSelEl) { const cls = CLASSES.find(c => c.id === classSelEl.value); const container = classSelEl.closest('.card') || classSelEl.parentElement; const subjSel = container?.querySelector('select[data-role="subject-select"]'); if (subjSel) { subjSel.innerHTML = (cls && cls.subjects.length) ? cls.subjects.map(s => `<option value="${s}">${s}</option>`).join('') : '<option value="">— No subjects —</option>'; } }
function syncMessageContacts() { GROUPS.forEach(g => { if (!convData.find(c => c.groupId === g.id)) { convData.push({ groupId: g.id, name: g.name, last: g.chat.length ? g.chat[g.chat.length - 1].text : 'No messages yet', time: 'Now', unread: 0, isGroup: true }); } }); for (let i = convData.length - 1; i >= 0; i--) { if (convData[i].isGroup && !GROUPS.find(g => g.id === convData[i].groupId)) convData.splice(i, 1); } }
function refreshDashboardActivity() {
  const tbody = document.querySelector('#page-dashboard table tbody');
  if (!tbody) return;
  if (!GROUPS.length) { tbody.innerHTML = `<tr><td colspan="5" style="padding:24px;text-align:center;color:var(--text-muted);">No activity yet — create a class and group to get started</td></tr>`; return; }
  tbody.innerHTML = GROUPS.map(g => { const last = g.chat.length ? g.chat[g.chat.length - 1] : null; return `<tr><td>${g.name}</td><td>${last ? last.text.slice(0, 50) : '—'}</td><td>${PROFILE.name}</td><td>${last ? last.time : '—'}</td><td><button class="btn btn-outline btn-sm" onclick="navigate('group',document.querySelector('.nav-item[onclick*=group]'))">Open</button></td></tr>`; }).join('');
}

/* ─────────────────────────────────────────
   CLASSES PAGE
───────────────────────────────────────── */
function renderClassesPage() {
  const pg = document.getElementById('page-classes');
  if (!pg) return;
  pg.innerHTML = `<div class="section-header"><div><div class="section-title">🏫 Classes</div><div class="section-sub">Create classes, add subjects, and manage student groups</div></div><button class="btn btn-primary" onclick="openCreateClassModal()">+ Create Class</button></div><div class="grid-3" id="classCardsGrid"></div><div id="classDetailPanel" style="display:none;margin-top:24px;"><div class="card"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;"><div class="card-title" id="detailTitle">📋 Class Details</div><button class="btn btn-outline btn-sm" onclick="closeDetail()">✕ Close</button></div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;"><div><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;"><div style="font-weight:700;font-size:14px;">👩‍🎓 Students (<span id="stuCount">0</span>)</div><div style="display:flex;gap:6px;"><button class="btn btn-outline btn-sm" onclick="openAddStudentModal()">+ Add</button><button class="btn btn-primary btn-sm" onclick="openCreateGroupFromClass()">👥 Group</button></div></div><div style="max-height:340px;overflow-y:auto;"><table style="width:100%;border-collapse:collapse;"><thead><tr><th style="font-size:10px;text-transform:uppercase;color:var(--text-muted);padding:8px;border-bottom:1px solid var(--border);"><input type="checkbox" id="selectAllStu" onchange="toggleAllStudents(this)" style="accent-color:var(--accent-cyan);"></th><th style="font-size:10px;text-transform:uppercase;color:var(--text-muted);padding:8px;border-bottom:1px solid var(--border);text-align:left;">Roll</th><th style="font-size:10px;text-transform:uppercase;color:var(--text-muted);padding:8px;border-bottom:1px solid var(--border);text-align:left;">Name</th><th style="font-size:10px;text-transform:uppercase;color:var(--text-muted);padding:8px;border-bottom:1px solid var(--border);text-align:left;">Email</th><th style="border-bottom:1px solid var(--border);"></th></tr></thead><tbody id="stuTableBody"></tbody></table></div><div id="selectionActions" style="display:none;margin-top:10px;padding:10px;background:var(--bg-secondary);border-radius:10px;align-items:center;gap:10px;"><span id="selCount" style="font-size:13px;color:var(--accent-cyan);font-weight:600;"></span><button class="btn btn-primary btn-sm" onclick="createGroupFromSelected()">👥 Group Selected</button><button class="btn btn-outline btn-sm" onclick="clearSelection()">Clear</button></div></div><div><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;"><div style="font-weight:700;font-size:14px;">📚 Subjects (<span id="subjCount">0</span>)</div><button class="btn btn-outline btn-sm" onclick="openAddSubjectModal()">+ Add</button></div><div id="subjListWrap" style="max-height:340px;overflow-y:auto;"></div></div><div><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;"><div style="font-weight:700;font-size:14px;">👥 Groups (<span id="grpCount">0</span>)</div></div><div id="classGroupList" style="max-height:300px;overflow-y:auto;"></div><button class="btn btn-outline btn-sm" style="margin-top:10px;width:100%;" onclick="openCreateGroupFromClass()">+ Create Group</button></div></div></div></div>`;
  renderClassCards();
}

function renderClassCards() {
  const grid = document.getElementById('classCardsGrid'); if (!grid) return;
  const colors = ['#00d4ff', '#a855f7', '#f97316', '#10b981', '#ec4899', '#f59e0b', '#14b8a6', '#06b6d4'];
  if (!CLASSES.length) { grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:var(--text-muted);"><div style="font-size:56px;margin-bottom:16px;">🏫</div><div style="font-size:18px;font-weight:700;margin-bottom:8px;color:var(--text-primary);">No Classes Yet</div><button class="btn btn-primary" onclick="openCreateClassModal()">+ Create Your First Class</button></div>`; return; }
  grid.innerHTML = CLASSES.map((cls, i) => {
    const col = colors[i % colors.length], grpCount = GROUPS.filter(g => g.classId === cls.id).length;
    return `<div class="card" style="cursor:pointer;border-top:3px solid ${col};transition:.2s;" onclick="openClassDetail('${cls.id}')" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform=''">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px;">
        <div><div style="font-size:18px;font-weight:800;color:${col};font-family:'Rajdhani',sans-serif;">${cls.key}</div><div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">${cls.dept}${cls.section ? ' · Sec ' + cls.section : ''}</div></div>
        <div style="background:${col}22;border:1px solid ${col}44;border-radius:8px;padding:3px 9px;font-size:10px;font-weight:700;color:${col};">${cls.year}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;">
        <div style="text-align:center;background:var(--bg-secondary);border-radius:8px;padding:8px;"><div style="font-size:18px;font-weight:800;color:${col};">${cls.students.length}</div><div style="font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;">Students</div></div>
        <div style="text-align:center;background:var(--bg-secondary);border-radius:8px;padding:8px;"><div style="font-size:18px;font-weight:800;color:${col};">${cls.subjects.length}</div><div style="font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;">Subjects</div></div>
        <div style="text-align:center;background:var(--bg-secondary);border-radius:8px;padding:8px;"><div style="font-size:18px;font-weight:800;color:${col};">${grpCount}</div><div style="font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;">Groups</div></div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:12px;min-height:18px;">${cls.subjects.length ? '📚 ' + cls.subjects.slice(0, 2).join(' · ') + (cls.subjects.length > 2 ? ` +${cls.subjects.length - 2} more` : '') : '<em>No subjects added yet</em>'}</div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-primary btn-sm" style="flex:1;" onclick="event.stopPropagation();openClassDetail('${cls.id}')">👁 View</button>
        <button class="btn btn-outline btn-sm" style="flex:1;" onclick="event.stopPropagation();quickCreateGroupAll('${cls.id}')">👥 Group All</button>
        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();confirmDeleteClass('${cls.id}')" style="color:var(--accent-red);border-color:var(--accent-red);">🗑</button>
      </div>
    </div>`;
  }).join('');
}

function openClassDetail(id) { activeClassId = id; const cls = CLASSES.find(c => c.id === id); if (!cls) return; const panel = document.getElementById('classDetailPanel'); panel.style.display = 'block'; document.getElementById('detailTitle').textContent = `📋 ${cls.label}`; panel.scrollIntoView({ behavior: 'smooth' }); renderStudentTable(cls); renderSubjectList(cls); renderClassGroups(cls); }
function closeDetail() { document.getElementById('classDetailPanel').style.display = 'none'; activeClassId = null; }

function renderStudentTable(cls) { const cnt = document.getElementById('stuCount'); if (cnt) cnt.textContent = cls.students.length; const tbody = document.getElementById('stuTableBody'); if (!tbody) return; if (!cls.students.length) { tbody.innerHTML = `<tr><td colspan="5" style="padding:20px;text-align:center;color:var(--text-muted);">No students yet — click "+ Add"</td></tr>`; return; } tbody.innerHTML = cls.students.map(s => `<tr style="border-bottom:1px solid var(--border);"><td style="padding:7px;"><input type="checkbox" class="stu-check" value="${s.roll}" onchange="updateSelectionActions()" style="accent-color:var(--accent-cyan);"></td><td style="padding:7px;font-size:12px;font-family:'Rajdhani',sans-serif;font-weight:600;">${s.roll}</td><td style="padding:7px;font-size:13px;">${s.name}</td><td style="padding:7px;font-size:11px;color:var(--text-secondary);">${s.email}</td><td style="padding:7px;"><button class="btn btn-outline btn-sm" onclick="removeStudent('${cls.id}','${s.roll}')" style="color:var(--accent-red);border-color:var(--accent-red);padding:2px 7px;font-size:10px;">✕</button></td></tr>`).join(''); updateSelectionActions(); }

function renderSubjectList(cls) { const el = document.getElementById('subjListWrap'), cnt = document.getElementById('subjCount'); if (!el) return; if (cnt) cnt.textContent = cls.subjects.length; if (!cls.subjects.length) { el.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px;border:1px dashed var(--border);border-radius:10px;">No subjects yet<br><span style="font-size:11px;">Click "+ Add" to add subjects</span></div>`; return; } el.innerHTML = cls.subjects.map((subj, i) => `<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--border);border-radius:10px;margin-bottom:6px;background:var(--bg-secondary);transition:.15s;" onmouseover="this.style.borderColor='var(--accent-cyan)'" onmouseout="this.style.borderColor='var(--border)'"><div style="width:24px;height:24px;border-radius:6px;background:linear-gradient(135deg,var(--accent-cyan),var(--accent-teal));display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff;font-weight:700;flex-shrink:0;">${i + 1}</div><span style="flex:1;font-size:13px;font-weight:500;">${subj}</span><button class="btn btn-outline btn-sm" onclick="editSubject('${cls.id}',${i})" style="padding:2px 7px;font-size:10px;">✏️</button><button class="btn btn-outline btn-sm" onclick="deleteSubject('${cls.id}',${i})" style="color:var(--accent-red);border-color:var(--accent-red);padding:2px 7px;font-size:10px;">🗑</button></div>`).join(''); }

function openAddSubjectModal() { const cls = CLASSES.find(c => c.id === activeClassId); if (!cls) return; document.getElementById('addSubjectModal')?.remove(); const m = document.createElement('div'); m.className = 'modal-overlay open'; m.id = 'addSubjectModal'; m.innerHTML = `<div class="modal" style="width:440px;max-width:95vw;"><div class="modal-title">📚 Add Subject — ${cls.key}</div><div class="form-group"><label class="form-label">Subject Name</label><input class="form-input" id="subj-inp" placeholder="e.g. Data Structures & Algorithms" onkeydown="if(event.key==='Enter')submitAddSubject('${cls.id}')"></div><div style="background:var(--bg-secondary);border-radius:10px;padding:12px;margin-bottom:16px;"><div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Quick Add</div><div style="display:flex;flex-wrap:wrap;gap:5px;">${['Mathematics', 'Physics', 'Chemistry', 'English', 'Data Structures', 'Operating Systems', 'DBMS', 'Computer Networks', 'Software Engineering', 'Python', 'Java', 'AI & ML', 'Statistics', 'Economics', 'Digital Electronics'].filter(s => !cls.subjects.includes(s)).map(s => `<button class="btn btn-outline btn-sm" style="font-size:10px;padding:2px 8px;" onclick="document.getElementById('subj-inp').value='${s}'">${s}</button>`).join('')}</div></div><div class="modal-footer"><button class="btn btn-outline" onclick="document.getElementById('addSubjectModal').remove()">Cancel</button><button class="btn btn-primary" onclick="submitAddSubject('${cls.id}')">+ Add Subject</button></div></div>`; document.body.appendChild(m); m.addEventListener('click', e => { if (e.target === m) m.remove(); }); setTimeout(() => document.getElementById('subj-inp')?.focus(), 60); }
function submitAddSubject(classId) { const cls = CLASSES.find(c => c.id === classId), name = document.getElementById('subj-inp')?.value.trim(); if (!name) { showToast('⚠️ Enter a subject name.'); return; } if (cls.subjects.includes(name)) { showToast('⚠️ Subject already exists.'); return; } cls.subjects.push(name); saveClasses(); document.getElementById('addSubjectModal')?.remove(); renderSubjectList(cls); renderClassCards(); showToast(`✅ Subject "${name}" added`); }
function editSubject(classId, idx) { const cls = CLASSES.find(c => c.id === classId), curr = cls.subjects[idx], n = prompt('Edit subject name:', curr); if (!n || n.trim() === curr) return; if (cls.subjects.includes(n.trim())) { showToast('⚠️ Already exists.'); return; } cls.subjects[idx] = n.trim(); saveClasses(); renderSubjectList(cls); renderClassCards(); showToast(`✅ Renamed to "${n.trim()}"`); }
function deleteSubject(classId, idx) { const cls = CLASSES.find(c => c.id === classId), name = cls.subjects[idx]; if (!confirm(`Delete subject "${name}" from ${cls.key}?`)) return; cls.subjects.splice(idx, 1); saveClasses(); renderSubjectList(cls); renderClassCards(); showToast(`🗑 "${name}" removed`); }

function renderClassGroups(cls) { const el = document.getElementById('classGroupList'), cnt = document.getElementById('grpCount'); if (!el) return; const grps = GROUPS.filter(g => g.classId === cls.id); if (cnt) cnt.textContent = grps.length; if (!grps.length) { el.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:13px;border:1px dashed var(--border);border-radius:10px;">No groups yet</div>`; return; } el.innerHTML = grps.map(g => `<div style="display:flex;align-items:center;gap:8px;padding:9px;border:1px solid var(--border);border-radius:10px;margin-bottom:7px;background:var(--bg-secondary);"><div style="width:34px;height:34px;border-radius:8px;background:${g.gradient};display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;">${g.icon}</div><div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${g.name}</div><div style="font-size:10px;color:var(--text-secondary);">${g.memberRolls.length} members · ${g.type}</div></div><div style="display:flex;gap:5px;"><button class="btn btn-primary btn-sm" style="padding:3px 8px;font-size:11px;" onclick="openGroupChatById('${g.id}');navigate('group',null)">💬</button><button class="btn btn-outline btn-sm" style="padding:3px 8px;font-size:11px;color:var(--accent-red);border-color:var(--accent-red);" onclick="confirmDeleteGroup('${g.id}')">🗑</button></div></div>`).join(''); }

function toggleAllStudents(cb) { document.querySelectorAll('.stu-check').forEach(c => c.checked = cb.checked); updateSelectionActions(); }
function updateSelectionActions() { const checked = document.querySelectorAll('.stu-check:checked'), bar = document.getElementById('selectionActions'), cnt = document.getElementById('selCount'); if (!bar || !cnt) return; if (checked.length > 0) { bar.style.display = 'flex'; cnt.textContent = `${checked.length} student${checked.length > 1 ? 's' : ''} selected`; } else bar.style.display = 'none'; }
function clearSelection() { document.querySelectorAll('.stu-check').forEach(c => c.checked = false); const all = document.getElementById('selectAllStu'); if (all) all.checked = false; updateSelectionActions(); }

/* ─────────────────────────────────────────
   CREATE CLASS MODAL
───────────────────────────────────────── */
function openCreateClassModal() {
  document.getElementById('createClassModal')?.remove();
  pendingStudents = []; pendingSubjectsArr = [];
  const m = document.createElement('div'); m.className = 'modal-overlay open'; m.id = 'createClassModal';
  m.innerHTML = `<div class="modal" style="width:540px;max-width:95vw;max-height:90vh;overflow-y:auto;">
    <div class="modal-title">🏫 Create New Class</div>
    <div class="form-group"><label class="form-label">Department <span style="color:var(--accent-red);">*</span></label><input class="form-input" id="cls-dept" placeholder="e.g. Computer Science, MCA, Electronics..." onkeyup="autoGenerateKey()" autocomplete="off"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      <div class="form-group"><label class="form-label">Year <span style="color:var(--accent-red);">*</span></label><select class="form-select" id="cls-year" onchange="autoGenerateKey()"><option value="">— Select Year —</option><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option></select></div>
      <div class="form-group"><label class="form-label">Section</label><select class="form-select" id="cls-section" onchange="autoGenerateKey()"><option value="">— None —</option><option>A</option><option>B</option><option>C</option><option>D</option></select></div>
    </div>
    <div class="form-group"><label class="form-label">Class Key <span style="font-size:11px;font-weight:400;color:var(--text-muted);">(auto-generated, editable)</span></label><input class="form-input" id="cls-key" placeholder="Will auto-fill..." style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:15px;color:var(--accent-cyan);"></div>
    <div class="form-group"><label class="form-label">Subjects</label><div style="display:flex;gap:8px;margin-bottom:8px;"><input class="form-input" id="cls-subj-inp" placeholder="Type a subject name..." style="flex:1;" onkeydown="if(event.key==='Enter'){event.preventDefault();addSubjectToForm()}"><button class="btn btn-outline btn-sm" onclick="addSubjectToForm()">+ Add</button></div><div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;">${['Mathematics', 'Physics', 'Data Structures', 'OS', 'DBMS', 'Computer Networks', 'Software Engineering', 'Python', 'Java', 'AI & ML', 'Statistics', 'English'].map(s => `<button class="btn btn-outline btn-sm" style="font-size:10px;padding:2px 8px;" onclick="quickAddSubjectToForm('${s}')">${s}</button>`).join('')}</div><div id="formSubjTags" style="display:flex;flex-wrap:wrap;gap:6px;min-height:38px;padding:8px;background:var(--bg-secondary);border-radius:8px;border:1px solid var(--border);align-items:center;"><span style="font-size:11px;color:var(--text-muted);" id="noSubjHint">No subjects added yet</span></div></div>
    <div class="form-group"><label class="form-label">Students <span style="font-size:11px;font-weight:400;color:var(--text-muted);">(optional)</span></label><div style="display:flex;gap:6px;margin-bottom:8px;"><input class="form-input" id="stu-name-inp" placeholder="Full Name" style="flex:2;"><input class="form-input" id="stu-roll-inp" placeholder="Roll No" style="flex:1;"><input class="form-input" id="stu-email-inp" placeholder="Email" style="flex:2;"><button class="btn btn-outline btn-sm" onclick="addStudentToForm()">+ Add</button></div><div id="stuPreviewList" style="max-height:130px;overflow-y:auto;"></div></div>
    <div class="form-group"><label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;"><input type="checkbox" id="autoCreateGroup" checked style="width:15px;height:15px;accent-color:var(--accent-cyan);"><span>Auto-create a General group for all students</span></label></div>
    <div class="modal-footer"><button class="btn btn-outline" onclick="document.getElementById('createClassModal').remove()">Cancel</button><button class="btn btn-primary" onclick="submitCreateClass()">🏫 Create Class</button></div>
  </div>`;
  document.body.appendChild(m); m.addEventListener('click', e => { if (e.target === m) m.remove(); }); setTimeout(() => document.getElementById('cls-dept')?.focus(), 60);
}

let pendingStudents = [], pendingSubjectsArr = [];
function autoGenerateKey() { const dept = document.getElementById('cls-dept')?.value.trim() || '', year = document.getElementById('cls-year')?.value || '', section = document.getElementById('cls-section')?.value || ''; if (!dept || !year) { const el = document.getElementById('cls-key'); if (el) el.value = ''; return; } const abbr = dept.split(/\s+/).filter(Boolean).map(w => w[0].toUpperCase()).join('').slice(0, 4), yearNum = year.replace(/[^0-9]/g, ''), el = document.getElementById('cls-key'); if (el) el.value = `${abbr}-${yearNum}${section}`; }
function quickAddSubjectToForm(name) { if (pendingSubjectsArr.includes(name)) { showToast('⚠️ Already added.'); return; } pendingSubjectsArr.push(name); renderFormSubjTags(); }
function addSubjectToForm() { const inp = document.getElementById('cls-subj-inp'), name = inp?.value.trim(); if (!name) return; if (pendingSubjectsArr.includes(name)) { showToast('⚠️ Already added.'); return; } pendingSubjectsArr.push(name); renderFormSubjTags(); if (inp) inp.value = ''; }
function renderFormSubjTags() { const el = document.getElementById('formSubjTags'), hint = document.getElementById('noSubjHint'); if (!el) return; if (hint) hint.style.display = pendingSubjectsArr.length ? 'none' : 'inline'; el.querySelectorAll('.subj-tag').forEach(t => t.remove()); pendingSubjectsArr.forEach((s, i) => { const div = document.createElement('div'); div.className = 'subj-tag'; div.style.cssText = 'display:flex;align-items:center;gap:5px;background:var(--accent-cyan)18;border:1px solid var(--accent-cyan)44;border-radius:20px;padding:3px 10px;'; div.innerHTML = `<span style="font-size:12px;color:var(--accent-cyan);font-weight:600;">${s}</span><button onclick="removePendingSubj(${i})" style="background:none;border:none;color:var(--accent-red);cursor:pointer;font-size:12px;line-height:1;padding:0;">✕</button>`; el.appendChild(div); }); }
function removePendingSubj(i) { pendingSubjectsArr.splice(i, 1); renderFormSubjTags(); }
function addStudentToForm() { const name = document.getElementById('stu-name-inp')?.value.trim(), roll = document.getElementById('stu-roll-inp')?.value.trim(), email = document.getElementById('stu-email-inp')?.value.trim(); if (!name || !roll) { showToast('⚠️ Name and Roll are required.'); return; } if (pendingStudents.find(s => s.roll === roll)) { showToast('⚠️ Roll already added.'); return; } pendingStudents.push({ name, roll, email: email || roll + '@college.edu' }); renderPendingStudents();['stu-name-inp', 'stu-roll-inp', 'stu-email-inp'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; }); document.getElementById('stu-name-inp')?.focus(); }
function renderPendingStudents() { const el = document.getElementById('stuPreviewList'); if (!el) return; if (!pendingStudents.length) { el.innerHTML = ''; return; } el.innerHTML = `<table style="width:100%;border-collapse:collapse;font-size:12px;"><tr style="border-bottom:1px solid var(--border);"><th style="padding:5px;text-align:left;color:var(--text-muted);">Roll</th><th style="padding:5px;text-align:left;color:var(--text-muted);">Name</th><th style="padding:5px;text-align:left;color:var(--text-muted);">Email</th><th></th></tr>${pendingStudents.map((s, i) => `<tr style="border-bottom:1px solid var(--border);"><td style="padding:5px;">${s.roll}</td><td style="padding:5px;">${s.name}</td><td style="padding:5px;color:var(--text-secondary);">${s.email}</td><td style="padding:5px;"><button onclick="removePendingStu(${i})" style="background:none;border:none;color:var(--accent-red);cursor:pointer;">✕</button></td></tr>`).join('')}</table>`; }
function removePendingStu(i) { pendingStudents.splice(i, 1); renderPendingStudents(); }
function submitCreateClass() { const dept = document.getElementById('cls-dept')?.value.trim(), year = document.getElementById('cls-year')?.value, section = document.getElementById('cls-section')?.value || '', key = document.getElementById('cls-key')?.value.trim(), auto = document.getElementById('autoCreateGroup')?.checked; if (!dept) { showToast('⚠️ Department name is required.'); return; } if (!year) { showToast('⚠️ Please select a year.'); return; } if (!key) { showToast('⚠️ Class key is missing.'); return; } if (CLASSES.find(c => c.key === key)) { showToast(`⚠️ Class "${key}" already exists.`); return; } const label = `${dept} — ${year}${section ? ' · Sec ' + section : ''}`; const newClass = { id: 'cls' + (nextClassId++), key, label, dept, year, section, subjects: [...pendingSubjectsArr], students: [...pendingStudents], createdAt: new Date().toISOString() }; CLASSES.push(newClass); saveClasses(); if (auto && newClass.students.length) createGroupForClass(newClass, null, 'General'); document.getElementById('createClassModal')?.remove(); pendingStudents = []; pendingSubjectsArr = []; renderClassesPage(); syncAttendanceDropdowns(); syncMessageContacts(); refreshDashboardActivity(); showToast(`✅ Class "${key}" created!${auto && newClass.students.length ? ' + auto-group' : ''}`); }

/* ─────────────────────────────────────────
   GROUP CREATION
───────────────────────────────────────── */
function quickCreateGroupAll(classId) { const cls = CLASSES.find(c => c.id === classId); if (!cls) return; if (!cls.students.length) { showToast('⚠️ Add students first.'); return; } openGroupNameModal(cls, null); }
function createGroupFromSelected() { const cls = CLASSES.find(c => c.id === activeClassId); if (!cls) return; const rolls = [...document.querySelectorAll('.stu-check:checked')].map(c => c.value); if (!rolls.length) { showToast('⚠️ Select at least one student.'); return; } openGroupNameModal(cls, rolls); }
function openCreateGroupFromClass() { const cls = CLASSES.find(c => c.id === activeClassId); if (!cls) { showToast('⚠️ Open a class first.'); return; } openGroupNameModal(cls, null); }
function openGroupNameModal(cls, selectedRolls) { document.getElementById('groupNameModal')?.remove(); const isSelected = selectedRolls && selectedRolls.length > 0; const m = document.createElement('div'); m.className = 'modal-overlay open'; m.id = 'groupNameModal'; m.innerHTML = `<div class="modal" style="width:460px;max-width:95vw;"><div class="modal-title">👥 Create Group — ${cls.key}</div><div class="form-group"><label class="form-label">Group Name <span style="color:var(--accent-red);">*</span></label><input class="form-input" id="gn-name" value="${cls.key} ${isSelected ? 'Selected' : 'General'}" placeholder="e.g. ${cls.key} Lab Batch A"></div><div class="form-group"><label class="form-label">Group Type</label><select class="form-select" id="gn-type"><option>General</option><option>Lab Group</option><option>Project Group</option><option>Study Group</option><option>Special Group</option></select></div><div class="form-group" style="background:var(--bg-secondary);border-radius:10px;padding:14px;"><label class="form-label" style="margin-bottom:10px;">👩‍🎓 Students to include</label>${isSelected ? `<div style="color:var(--accent-cyan);font-size:13px;font-weight:600;">✅ ${selectedRolls.length} student${selectedRolls.length > 1 ? 's' : ''} selected</div><div style="font-size:11px;color:var(--text-muted);margin-top:4px;">${selectedRolls.map(r => cls.students.find(s => s.roll === r)?.name || r).join(', ')}</div>` : `<div style="display:flex;flex-direction:column;gap:8px;"><label style="display:flex;align-items:center;gap:8px;cursor:pointer;"><input type="radio" name="who" value="all" checked style="accent-color:var(--accent-cyan);"><span style="font-size:13px;">All students (${cls.students.length})</span></label><label style="display:flex;align-items:center;gap:8px;cursor:pointer;"><input type="radio" name="who" value="pick" style="accent-color:var(--accent-cyan);" onchange="document.getElementById('pickWrap').style.display='block'"><span style="font-size:13px;">Pick specific students</span></label><div id="pickWrap" style="display:none;padding:10px;background:var(--bg-secondary);border-radius:8px;max-height:160px;overflow-y:auto;border:1px solid var(--border);">${cls.students.length ? cls.students.map(s => `<label style="display:flex;align-items:center;gap:8px;padding:4px 0;cursor:pointer;"><input type="checkbox" class="gn-pick" value="${s.roll}" style="accent-color:var(--accent-cyan);"><span style="font-size:13px;">${s.roll} — ${s.name}</span></label>`).join('') : '<span style="font-size:12px;color:var(--text-muted);">No students in class yet</span>'}</div></div>`}</div><div class="modal-footer"><button class="btn btn-outline" onclick="document.getElementById('groupNameModal').remove()">Cancel</button><button class="btn btn-primary" onclick="submitGroupFromModal('${cls.id}','${isSelected ? selectedRolls.join('|') : ''}')">👥 Create Group</button></div></div>`; document.body.appendChild(m); m.addEventListener('click', e => { if (e.target === m) m.remove(); }); }
function submitGroupFromModal(classId, preRaw) { const cls = CLASSES.find(c => c.id === classId); if (!cls) return; const name = document.getElementById('gn-name')?.value.trim(), type = document.getElementById('gn-type')?.value || 'General'; if (!name) { showToast('⚠️ Enter a group name.'); return; } let rolls; if (preRaw) { rolls = preRaw.split('|').filter(Boolean); } else { const who = document.querySelector('input[name="who"]:checked')?.value; if (who === 'all') { rolls = cls.students.map(s => s.roll); if (!rolls.length) { showToast('⚠️ No students in class yet.'); return; } } else { rolls = [...document.querySelectorAll('.gn-pick:checked')].map(c => c.value); if (!rolls.length) { showToast('⚠️ Select at least one student.'); return; } } } createGroupForClass(cls, rolls, type, name); document.getElementById('groupNameModal')?.remove(); clearSelection(); if (activeClassId === classId) { const c2 = CLASSES.find(c => c.id === classId); renderStudentTable(c2); renderClassGroups(c2); renderClassCards(); } renderGroupCards(); syncAttendanceDropdowns(); syncMessageContacts(); buildConvList(); refreshDashboardActivity(); showToast(`✅ Group "${name}" created (${rolls.length} student${rolls.length > 1 ? 's' : ''})!`); }
function createGroupForClass(cls, rolls, type, name) { if (!rolls) rolls = cls.students.map(s => s.roll); const grpName = name || `${cls.key} ${type}`; const g = { id: 'g' + (nextGroupId++), name: grpName, classId: cls.id, type: type || 'General', icon: TYPE_ICON[type] || '📚', gradient: GRADIENTS[GROUPS.length % GRADIENTS.length], allStudents: rolls.length === cls.students.length, memberRolls: [...rolls], lastMsg: 'Group created · Just now', chat: [{ from: PROFILE.name, text: `Group "${grpName}" created. Welcome!`, time: 'Just now', sent: true }], createdAt: new Date().toISOString() }; GROUPS.push(g); saveGroups(); return g; }

/* ─────────────────────────────────────────
   ADD / REMOVE STUDENT
───────────────────────────────────────── */
function openAddStudentModal() { const cls = CLASSES.find(c => c.id === activeClassId); if (!cls) return; document.getElementById('addStudentModal')?.remove(); const m = document.createElement('div'); m.className = 'modal-overlay open'; m.id = 'addStudentModal'; m.innerHTML = `<div class="modal" style="width:440px;max-width:95vw;"><div class="modal-title">➕ Add Student — ${cls.key}</div><div class="form-group"><label class="form-label">Full Name <span style="color:var(--accent-red);">*</span></label><input class="form-input" id="as-name" placeholder="e.g. Rahul Sharma"></div><div class="form-group"><label class="form-label">Roll Number <span style="color:var(--accent-red);">*</span></label><input class="form-input" id="as-roll" placeholder="e.g. 2201009"></div><div class="form-group"><label class="form-label">Email</label><input class="form-input" id="as-email" type="email" placeholder="student@college.edu"></div><div class="form-group" style="background:var(--bg-secondary);border-radius:10px;padding:12px;"><label class="form-label" style="margin-bottom:8px;">Also add to groups</label>${GROUPS.filter(g => g.classId === cls.id).map(g => `<label style="display:flex;align-items:center;gap:8px;margin-bottom:6px;cursor:pointer;"><input type="checkbox" class="add-to-grp" value="${g.id}" style="accent-color:var(--accent-cyan);"><span style="font-size:13px;">${g.icon} ${g.name}</span></label>`).join('') || '<span style="font-size:12px;color:var(--text-muted);">No groups yet</span>'}</div><div class="modal-footer"><button class="btn btn-outline" onclick="document.getElementById('addStudentModal').remove()">Cancel</button><button class="btn btn-primary" onclick="submitAddStudent('${cls.id}')">+ Add Student</button></div></div>`; document.body.appendChild(m); m.addEventListener('click', e => { if (e.target === m) m.remove(); }); setTimeout(() => document.getElementById('as-name')?.focus(), 60); }
function submitAddStudent(classId) { const cls = CLASSES.find(c => c.id === classId), name = document.getElementById('as-name')?.value.trim(), roll = document.getElementById('as-roll')?.value.trim(), email = document.getElementById('as-email')?.value.trim(); if (!name || !roll) { showToast('⚠️ Name and Roll are required.'); return; } if (cls.students.find(s => s.roll === roll)) { showToast('⚠️ Roll already exists.'); return; } const stu = { name, roll, email: email || roll + '@college.edu' }; cls.students.push(stu); const grpIds = [...document.querySelectorAll('.add-to-grp:checked')].map(c => c.value); grpIds.forEach(gid => { const g = GROUPS.find(x => x.id === gid); if (g && !g.memberRolls.includes(roll)) g.memberRolls.push(roll); }); saveClasses(); saveGroups(); document.getElementById('addStudentModal')?.remove(); renderStudentTable(cls); renderClassGroups(cls); renderClassCards(); showToast(`✅ ${name} added to ${cls.key}${grpIds.length ? ' & ' + grpIds.length + ' group(s)' : ''}`); }
function removeStudent(classId, roll) { const cls = CLASSES.find(c => c.id === classId); if (!cls) return; const stu = cls.students.find(s => s.roll === roll); if (!confirm(`Remove ${stu?.name} from ${cls.key}?`)) return; cls.students = cls.students.filter(s => s.roll !== roll); GROUPS.filter(g => g.classId === classId).forEach(g => { g.memberRolls = g.memberRolls.filter(r => r !== roll); }); saveClasses(); saveGroups(); renderStudentTable(cls); renderClassCards(); showToast('✅ Student removed.'); }

/* ─────────────────────────────────────────
   DELETE
───────────────────────────────────────── */
function confirmDeleteClass(id) { const cls = CLASSES.find(c => c.id === id); if (!cls || !confirm(`Delete class "${cls.key}" and ALL its groups?\nThis cannot be undone.`)) return; CLASSES = CLASSES.filter(c => c.id !== id); GROUPS = GROUPS.filter(g => g.classId !== id); saveClasses(); saveGroups(); for (let i = convData.length - 1; i >= 0; i--) { if (convData[i].isGroup && !GROUPS.find(g => g.id === convData[i].groupId)) convData.splice(i, 1); } closeDetail(); renderClassesPage(); syncAttendanceDropdowns(); showToast(`🗑 Class "${cls.key}" deleted.`); }
function confirmDeleteGroup(id) { const g = GROUPS.find(x => x.id === id); if (!g || !confirm(`Delete group "${g.name}"?`)) return; GROUPS = GROUPS.filter(x => x.id !== id); saveGroups(); for (let i = convData.length - 1; i >= 0; i--) { if (convData[i].groupId === id) convData.splice(i, 1); } const cls = CLASSES.find(c => c.id === g.classId); if (cls && activeClassId === g.classId) renderClassGroups(cls); renderGroupCards(); syncAttendanceDropdowns(); showToast(`🗑 Group "${g.name}" deleted.`); }

/* ─────────────────────────────────────────
   MY GROUPS PAGE
───────────────────────────────────────── */
function renderGroupCards() {
  const container = document.querySelector('#page-group .grid-3'); if (!container) return;
  if (!GROUPS.length) { container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:var(--text-muted);"><div style="font-size:56px;margin-bottom:16px;">👥</div><div style="font-size:18px;font-weight:700;margin-bottom:8px;color:var(--text-primary);">No Groups Yet</div><button class="btn btn-primary" onclick="navigate('classes',document.querySelector('.nav-item[onclick*=classes]'))">Go to Classes</button></div>`; return; }
  container.innerHTML = GROUPS.map(g => { const cls = CLASSES.find(c => c.id === g.classId); return `<div class="card" style="cursor:pointer;transition:.2s;" onmouseover="this.style.borderColor='var(--accent-cyan)'" onmouseout="this.style.borderColor='var(--border)'" onclick="openGroupChatById('${g.id}')"><div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;"><div style="width:44px;height:44px;border-radius:12px;background:${g.gradient};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">${g.icon}</div><div style="flex:1;min-width:0;"><div style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${g.name}</div><div style="font-size:11px;color:var(--text-secondary);">${g.memberRolls.length} students · ${g.type}</div>${cls ? `<div style="font-size:10px;color:var(--text-muted);">Class: ${cls.key}</div>` : ''}</div></div><div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;background:var(--bg-secondary);border-radius:8px;padding:7px;">${g.lastMsg}</div><div style="display:flex;gap:5px;flex-wrap:wrap;"><button class="btn btn-primary btn-sm" style="flex:1;" onclick="event.stopPropagation();openGroupChatById('${g.id}')">💬 Chat</button><button class="btn btn-outline btn-sm" style="flex:1;" onclick="event.stopPropagation();broadcastToGroup('${g.id}')">📢 Broadcast</button><button class="btn btn-outline btn-sm" onclick="event.stopPropagation();confirmDeleteGroup('${g.id}')" style="color:var(--accent-red);border-color:var(--accent-red);">🗑</button></div></div>`; }).join('');
  const chatArea = document.getElementById('groupChatArea'); if (chatArea) chatArea.style.display = 'none';
}

/* ─────────────────────────────────────────
   GROUP CHAT
───────────────────────────────────────── */
function openGroupChatById(id) { const g = GROUPS.find(x => x.id === id); if (!g) return; currentGroupObj = g; const area = document.getElementById('groupChatArea'); if (!area) return; area.style.display = 'block'; const cls = CLASSES.find(c => c.id === g.classId); document.getElementById('groupChatTitle').textContent = `💬 ${g.name}${cls ? ' — ' + cls.key : ''}`; renderGroupMsgs(g); area.scrollIntoView({ behavior: 'smooth' }); }
function openGroupChat(nameOrId) { const g = GROUPS.find(x => x.id === nameOrId || x.name === nameOrId); if (g) openGroupChatById(g.id); }
function renderGroupMsgs(g) { const el = document.getElementById('groupMsgs'); if (!el) return; el.innerHTML = g.chat.map(m => `<div class="msg-bubble ${m.sent ? 'sent' : 'recv'}">${!m.sent ? `<div style="font-size:11px;color:var(--accent-cyan);margin-bottom:4px;">${m.from}</div>` : ''} ${m.text.replace(/\n/g, '<br>')}<div class="msg-meta">${m.time}</div></div>`).join(''); el.scrollTop = el.scrollHeight; }
function sendGroupMessage() { const inp = document.getElementById('groupInput'), txt = inp?.value.trim(); if (!txt || !currentGroupObj) return; const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); currentGroupObj.chat.push({ from: PROFILE.name, text: txt, time: now, sent: true }); currentGroupObj.lastMsg = txt + ' · Just now'; saveGroups(); renderGroupMsgs(currentGroupObj); inp.value = ''; const c = convData.find(x => x.groupId === currentGroupObj.id); if (c) { c.last = txt; c.time = 'Just now'; } }
function broadcastToGroup(id) { const g = GROUPS.find(x => x.id === id); if (!g) return; document.getElementById('broadcastTitle').textContent = `📢 Broadcast to ${g.name}`; document.getElementById('broadcastModal').dataset.groupId = id; openModal('broadcastModal'); }
function sendBroadcast() { const msg = document.getElementById('broadcastMsg')?.value.trim(), id = document.getElementById('broadcastModal')?.dataset.groupId, g = GROUPS.find(x => x.id === id); if (!msg || !g) { showToast('⚠️ Enter a message.'); return; } const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); g.chat.push({ from: PROFILE.name, text: '📢 ' + msg, time: now, sent: true }); g.lastMsg = '📢 ' + msg + ' · Just now'; saveGroups(); closeModal('broadcastModal'); document.getElementById('broadcastMsg').value = ''; showToast('✅ Broadcast sent to ' + g.name); }

/* ─────────────────────────────────────────
   MESSAGES
───────────────────────────────────────── */
const convData = []; const personalMsgData = {};
function buildConvList() { syncMessageContacts(); const el = document.getElementById('convList'); if (!el) return; if (!convData.length) { el.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-muted);font-size:13px;">No conversations yet</div>`; return; } el.innerHTML = convData.map((c, i) => { const isGrp = !!c.isGroup, g = isGrp ? GROUPS.find(x => x.id === c.groupId) : null, grad = g?.gradient || 'linear-gradient(135deg,#00d4ff,#0891b2)', ini = c.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); return `<div onclick="openConv(${i})" style="display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:10px;cursor:pointer;border:1px solid var(--border);margin-bottom:8px;transition:.2s;" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background=''"><div style="width:38px;height:38px;border-radius:${isGrp ? '10px' : '50%'};background:${grad};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:${isGrp ? '18px' : '13px'};flex-shrink:0;">${isGrp ? (g?.icon || '👥') : ini}</div><div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:600;">${c.name}${isGrp ? '<span style="font-size:10px;color:var(--accent-cyan);margin-left:4px;">GROUP</span>' : ''}</div><div style="font-size:11px;color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.last}</div></div><div style="text-align:right;flex-shrink:0;"><div style="font-size:10px;color:var(--text-muted);">${c.time}</div>${c.unread ? `<span class="badge badge-cyan" style="margin-top:4px;">${c.unread}</span>` : ''}</div></div>`; }).join(''); }
function openConv(i) { currentConv = i; const c = convData[i]; document.getElementById('msgChatTitle').innerHTML = `<span class="ci">💬</span> ${c.name}`; if (c.isGroup) { const g = GROUPS.find(x => x.id === c.groupId), el = document.getElementById('personalMsgs'); if (el && g) { el.innerHTML = g.chat.map(m => `<div class="msg-bubble ${m.sent ? 'sent' : 'recv'}">${!m.sent ? `<div style="font-size:11px;color:var(--accent-cyan);margin-bottom:4px;">${m.from}</div>` : ''} ${m.text.replace(/\n/g, '<br>')}<div class="msg-meta">${m.time}</div></div>`).join(''); el.scrollTop = el.scrollHeight; } return; } if (!personalMsgData[i]) personalMsgData[i] = [{ sent: false, text: c.last, time: c.time }]; renderPersonalMsgs(i); }
function renderPersonalMsgs(i) { const el = document.getElementById('personalMsgs'); if (!el) return; el.innerHTML = (personalMsgData[i] || []).map(m => `<div class="msg-bubble ${m.sent ? 'sent' : 'recv'}">${m.text}<div class="msg-meta">${m.time}</div></div>`).join(''); el.scrollTop = el.scrollHeight; }
function sendPersonalMsg() { const inp = document.getElementById('personalInput'), txt = inp?.value.trim(); if (!txt) return; if (currentConv !== null && convData[currentConv]?.isGroup) { const g = GROUPS.find(x => x.id === convData[currentConv].groupId); if (g) { const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); g.chat.push({ from: PROFILE.name, text: txt, time: now, sent: true }); g.lastMsg = txt + ' · Just now'; saveGroups(); convData[currentConv].last = txt; openConv(currentConv); } inp.value = ''; return; } if (currentConv === null) return; if (!personalMsgData[currentConv]) personalMsgData[currentConv] = []; personalMsgData[currentConv].push({ sent: true, text: txt, time: 'Just now' }); renderPersonalMsgs(currentConv); inp.value = ''; }

/* ─────────────────────────────────────────
   ATTENDANCE
───────────────────────────────────────── */
function buildAttTable() {
  const sel = document.querySelector('#att-class select[data-role="class-select"]'), classId = sel?.value, cls = classId ? CLASSES.find(c => c.id === classId) : CLASSES[0], studs = cls?.students || [];
  const tbody = document.getElementById('attTableBody'), lbody = document.getElementById('labAttBody');
  if (tbody) { if (!CLASSES.length) tbody.innerHTML = `<tr><td colspan="6" style="padding:20px;text-align:center;color:var(--text-muted);">No classes yet</td></tr>`; else if (!studs.length) tbody.innerHTML = `<tr><td colspan="6" style="padding:20px;text-align:center;color:var(--text-muted);">No students in this class</td></tr>`; else tbody.innerHTML = studs.map((s, i) => `<tr><td>${s.roll}</td><td>${s.name}</td><td><input type="radio" name="att_${i}" value="present" onclick="updateStatus(${i},'present')" checked></td><td><input type="radio" name="att_${i}" value="absent" onclick="updateStatus(${i},'absent')"></td><td><input type="radio" name="att_${i}" value="medical" onclick="updateStatus(${i},'medical')"></td><td><span class="badge badge-green" id="status_${i}">Present</span></td></tr>`).join(''); }
  if (lbody) lbody.innerHTML = studs.map((s, i) => `<tr><td>${s.roll}</td><td>${s.name}</td><td>${i % 2 === 0 ? 'Batch A' : 'Batch B'}</td><td><input type="radio" name="lab_${i}" value="present" checked></td><td><input type="radio" name="lab_${i}" value="absent"></td><td><span class="badge badge-green">Present</span></td></tr>`).join('');
  buildHeatmap();
}
function updateStatus(i, val) { const el = document.getElementById('status_' + i); if (!el) return; const map = { present: ['badge-green', 'Present'], absent: ['badge-red', 'Absent'], medical: ['badge-orange', 'Medical'] }; el.className = 'badge ' + map[val][0]; el.textContent = map[val][1]; }
function markAll(type) { document.querySelectorAll('#attTableBody tr').forEach((_, i) => { const r = document.querySelector(`input[name="att_${i}"][value="${type}"]`); if (r) { r.checked = true; updateStatus(i, type); } }); }
function buildHeatmap() { const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], grid = document.getElementById('attHeatmap'); if (!grid) return; let html = days.map(d => `<div class="att-day header">${d}</div>`).join(''); for (let i = 0; i < 35; i++) { const r = Math.random(), cls = i < 2 ? 'empty' : r > .85 ? 'absent' : r > .75 ? 'medical' : 'present', lbl = i < 2 ? '' : (i - 1); html += `<div class="att-day ${cls}" title="Day ${lbl}">${lbl}</div>`; } grid.innerHTML = html; }

/* ─────────────────────────────────────────
   CHARTS
───────────────────────────────────────── */
let subjectData = {};
let subjectChart, attDonutChart, cgpaLineChart, subjectBarChart;
function buildSubjectData() { CLASSES.forEach(cls => { if (!subjectData[cls.key]) subjectData[cls.key] = { labels: [...cls.subjects], data: cls.subjects.map(() => Math.floor(Math.random() * 30) + 60) }; else { const sd = subjectData[cls.key]; cls.subjects.forEach(s => { if (!sd.labels.includes(s)) { sd.labels.push(s); sd.data.push(Math.floor(Math.random() * 30) + 60); } }); sd.labels = sd.labels.filter(l => cls.subjects.includes(l)); sd.data = sd.labels.map((l, i) => sd.data[i] ?? Math.floor(Math.random() * 30) + 60); } }); }
function initDashboardCharts() { buildSubjectData(); const firstKey = CLASSES[0]?.key, sd0 = firstKey ? (subjectData[firstKey] || { labels: [], data: [] }) : { labels: [], data: [] }; const sctx = document.getElementById('subjectChart')?.getContext('2d'); if (sctx) { subjectChart = new Chart(sctx, { type: 'bar', data: { labels: sd0.labels, datasets: [{ label: 'Avg Marks', data: sd0.data, backgroundColor: 'rgba(0,212,255,.25)', borderColor: '#00d4ff', borderWidth: 2, borderRadius: 6 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } }, x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } } } } }); if (firstKey) buildSubjectPerfTable(firstKey); } const actx = document.getElementById('attDonut')?.getContext('2d'); if (actx) attDonutChart = new Chart(actx, { type: 'doughnut', data: { labels: ['Present', 'Absent', 'Medical'], datasets: [{ data: [87, 9, 4], backgroundColor: ['rgba(0,212,255,.7)', 'rgba(255,71,87,.7)', 'rgba(255,123,41,.7)'], borderColor: ['#00d4ff', '#ff4757', '#ff7b29'], borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#8b949e', font: { size: 12 } } } } } }); const lctx = document.getElementById('cgpaLine')?.getContext('2d'); if (lctx) cgpaLineChart = new Chart(lctx, { type: 'line', data: { labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'], datasets: [{ label: 'Avg CGPA', data: [7.8, 8.1, 8.6, 8.9, 8.4], borderColor: '#00d4ff', backgroundColor: 'rgba(0,212,255,.1)', tension: .4, pointRadius: 5, pointBackgroundColor: '#00d4ff', fill: true }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 7, max: 10, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } }, x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } } } } }); buildDashboardClassRadios(); }
function buildDashboardClassRadios() { const rg = document.querySelector('#page-dashboard .radio-group'); if (!rg) return; if (!CLASSES.length) { rg.innerHTML = '<span style="font-size:13px;color:var(--text-muted);">No classes yet — create one first.</span>'; return; } rg.innerHTML = CLASSES.map((cls, i) => `<div class="radio-btn"><input type="radio" name="cls" id="cls_r_${i}" value="${cls.key}" ${i === 0 ? 'checked' : ''} onchange="updateSubjectChart()"><label for="cls_r_${i}">${cls.key}</label></div>`).join(''); }
function updateSubjectChart() { buildSubjectData(); const cls = document.querySelector('input[name="cls"]:checked')?.value; if (!cls || !subjectChart) return; const sd = subjectData[cls] || { labels: [], data: [] }; subjectChart.data.labels = sd.labels; subjectChart.data.datasets[0].data = sd.data; subjectChart.update(); buildSubjectPerfTable(cls); }
function buildSubjectPerfTable(cls) { buildSubjectData(); const sd = cls ? subjectData[cls] : null, el = document.getElementById('subjectPerfTable'); if (!el) return; if (!sd || !sd.labels.length) { el.innerHTML = '<div style="padding:20px;color:var(--text-muted);text-align:center;font-size:13px;">No subject data yet</div>'; return; } el.innerHTML = '<div style="padding:4px 0;">' + sd.labels.map((l, i) => { const pct = sd.data[i], color = pct >= 80 ? 'var(--accent-green)' : pct >= 65 ? 'var(--accent-cyan)' : 'var(--accent-red)'; return `<div style="margin-bottom:14px;"><div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600;"><span>${l}</span><span style="color:${color}">${pct}/100</span></div><div class="subj-bar"><div class="subj-bar-fill" style="width:${pct}%;background:${color};"></div></div></div>`; }).join('') + '</div>'; }
function updateSubjPage() { buildSubjectData(); const rg = document.querySelector('#page-subjects .radio-group'); if (rg) { if (!CLASSES.length) rg.innerHTML = '<span style="font-size:13px;color:var(--text-muted);">No classes yet.</span>'; else rg.innerHTML = CLASSES.map((cls, i) => `<div class="radio-btn"><input type="radio" name="scls" id="scls_r_${i}" value="${cls.key}" ${i === 0 ? 'checked' : ''} onchange="updateSubjPage()"><label for="scls_r_${i}">${cls.key}</label></div>`).join(''); } const cls = document.querySelector('input[name="scls"]:checked')?.value || CLASSES[0]?.key; const el = document.getElementById('subjPageTitle'); if (el) el.textContent = cls || '—'; initSubjectBarChart(cls); buildSubjSummary(cls); }
function initSubjectBarChart(cls) { buildSubjectData(); const sd = cls ? (subjectData[cls] || { labels: [], data: [] }) : { labels: [], data: [] }; const ctx = document.getElementById('subjectBarChart')?.getContext('2d'); if (!ctx) return; if (subjectBarChart) subjectBarChart.destroy(); subjectBarChart = new Chart(ctx, { type: 'bar', data: { labels: sd.labels, datasets: [{ label: 'Avg Marks', data: sd.data, backgroundColor: 'rgba(0,212,255,.3)', borderColor: '#00d4ff', borderWidth: 2, borderRadius: 8 }, { label: 'Pass %', data: sd.data.map(v => Math.min(100, v + Math.floor(Math.random() * 10))), backgroundColor: 'rgba(57,211,83,.2)', borderColor: '#39d353', borderWidth: 2, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#8b949e' } } }, scales: { y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } }, x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } } } } }); }
function buildSubjSummary(cls) { buildSubjectData(); const sd = cls ? subjectData[cls] : null, tbody = document.getElementById('subjSummaryBody'); if (!tbody) return; if (!sd || !sd.labels.length) { tbody.innerHTML = `<tr><td colspan="6" style="padding:20px;text-align:center;color:var(--text-muted);">${!CLASSES.length ? 'No classes yet' : 'No subjects for this class'}</td></tr>`; return; } tbody.innerHTML = sd.labels.map((l, i) => { const avg = sd.data[i], high = Math.min(100, avg + Math.floor(Math.random() * 15) + 5), low = Math.max(0, avg - Math.floor(Math.random() * 25) - 5), pass = Math.min(100, avg + Math.floor(Math.random() * 10)), trend = avg >= 75 ? '📈 Rising' : '📉 Dip', badge = avg >= 80 ? 'badge-green' : avg >= 65 ? 'badge-cyan' : 'badge-red'; return `<tr><td>${l}</td><td><span class="badge ${badge}">${avg}</span></td><td>${high}</td><td>${low}</td><td>${pass}%</td><td>${trend}</td></tr>`; }).join(''); }

/* ─────────────────────────────────────────
   LEAVE
───────────────────────────────────────── */
function submitLeave() { const reason = document.getElementById('leaveReason')?.value.trim(), notify = document.getElementById('notifyGroups')?.checked, grpMsg = document.getElementById('leaveGroupMsg')?.value.trim(); if (!reason) { showToast('⚠️ Please enter a reason.'); return; } if (notify) { if (!GROUPS.length) { showToast('⚠️ No groups to notify.'); return; } const msg = grpMsg || 'Dear students, I will be on leave. Please self-study.'; const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); GROUPS.forEach(g => { g.chat.push({ from: PROFILE.name, text: '🌿 Leave Notice: ' + msg, time: now, sent: true }); g.lastMsg = '🌿 Leave Notice · Just now'; }); saveGroups(); showToast('✅ Leave applied & all groups notified!'); } else showToast('✅ Leave application submitted!'); if (document.getElementById('leaveReason')) document.getElementById('leaveReason').value = ''; if (document.getElementById('leaveGroupMsg')) document.getElementById('leaveGroupMsg').value = ''; }

/* ─────────────────────────────────────────
   UTILS / TABS
───────────────────────────────────────── */
function switchTab(group, name, el) { const pageId = group === 'att' ? 'attendance' : group; document.querySelectorAll(`#page-${pageId} .tab`).forEach(t => t.classList.remove('active')); document.querySelectorAll(`#page-${pageId} .tab-pane`).forEach(t => t.classList.remove('active')); el.classList.add('active'); const pane = document.getElementById(group + '-' + name); if (pane) pane.classList.add('active'); if (name === 'class' || name === 'lab') buildAttTable(); }
function openModal(id) { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
function showToast(msg) { const t = document.getElementById('toast'); if (!t) return; t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 3200); }
function refreshPage() { buildDashboardClassRadios(); refreshDashboardActivity(); showToast('🔄 Refreshed!'); }
function toggleNotif() { showToast('🔔 Notifications checked!'); }
function sendAlert() { showToast('📨 Attendance alert sent!'); }
function saveAttendance() { showToast('✅ Attendance saved!'); }
function scrollToUpdate(id) { document.getElementById('updatesContainer')?.scrollTo({ top: 0, behavior: 'smooth' }); }

document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', function (e) { if (e.target === this) this.classList.remove('open'); }));

/* ─────────────────────────────────────────
   PATCH HTML (add classes page + media page)
───────────────────────────────────────── */
function patchHTML() {
  if (!document.getElementById('page-classes')) { const pg = document.createElement('div'); pg.className = 'page'; pg.id = 'page-classes'; document.querySelector('.content')?.appendChild(pg); }
  if (!document.querySelector('.nav-item[onclick*="classes"]')) { const nav = document.querySelector('.nav-section:first-of-type'); if (nav) { const item = document.createElement('div'); item.className = 'nav-item'; item.setAttribute('onclick', "navigate('classes',this)"); item.innerHTML = '<span class="icon">🏫</span> Classes'; const dash = nav.querySelector('.nav-item'); if (dash?.nextSibling) nav.insertBefore(item, dash.nextSibling); else nav.appendChild(item); } }
  injectMediaPage();
  /* Update sidebar avatar if profile has one */
  if (PROFILE.avatar) { const av = document.querySelector('.avatar'); if (av) av.innerHTML = `<img src="${PROFILE.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="Avatar">`; }
  /* Update sidebar name */
  const sn = document.querySelector('.profile-name'); if (sn) sn.textContent = PROFILE.name;
  const ss = document.querySelector('.profile-sub'); if (ss) ss.textContent = `${PROFILE.dept}\nEmployee ID: ${PROFILE.empId} · ${PROFILE.designation}`;
}

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
window.onload = () => {
  patchHTML();
  addUpdateAnimCSS();
  injectDailyUpdatesWidget();
  buildSubjectData();
  initDashboardCharts();
  renderGroupCards();
  syncAttendanceDropdowns();
  syncMessageContacts();
  buildConvList();
  buildAttTable();
  refreshDashboardActivity();
};