/* ═══════════════════════════════════════════════════════════════════
   Teacher_dash.js  —  v2.0 — with Daily Updates + Media Upload
   ✅ Daily Updates (Admin/HOD broadcast panel on dashboard)
   ✅ Media Upload (video/audio) for classes/groups
   ✅ All previous features intact
   ═══════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   DATABASE  (localStorage-backed)
───────────────────────────────────────── */
const DB_KEY_CLASSES = 'td_classes';
const DB_KEY_GROUPS = 'td_groups';
const DB_KEY_UPDATES = 'td_daily_updates';
const DB_KEY_MEDIA = 'td_media';

function dbLoad(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function dbSave(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { }
}

let CLASSES = dbLoad(DB_KEY_CLASSES, []);
let GROUPS = dbLoad(DB_KEY_GROUPS, []);
let DAILY_UPDATES = dbLoad(DB_KEY_UPDATES, [
    { id: 'u1', title: '📅 Mid-Semester Exam Schedule Released', body: 'Mid-semester examinations will commence from 15th April 2026. Detailed timetable is available on the notice board and college portal. All faculty are requested to complete syllabus coverage by 12th April.', priority: 'high', author: 'HOD — Dr. Ramesh Kumar', time: '2 Apr 2026, 8:00 AM', pinned: true },
    { id: 'u2', title: '📝 Result Submission Deadline', body: 'All faculty must submit internal assessment marks for Semester 6 by 10th April 2026 (5:00 PM). Late submissions will not be accepted. Please use the official portal only.', priority: 'urgent', author: 'Admin Office', time: '1 Apr 2026, 3:30 PM', pinned: false },
    { id: 'u3', title: '🏫 Department Meeting — 5th April', body: 'A mandatory department meeting has been scheduled for Saturday, 5th April 2026 at 11:00 AM in the Conference Room (Block B, 2nd Floor). All faculty members must attend. Agenda: curriculum revision and accreditation updates.', priority: 'normal', author: 'HOD — Dr. Ramesh Kumar', time: '31 Mar 2026, 10:00 AM', pinned: false },
    { id: 'u4', title: '🔬 New Lab Equipment Available', body: 'The department has procured 20 new Raspberry Pi 4 units for the embedded systems lab. Faculty can book lab slots via the online portal starting 3rd April. Students should be informed accordingly.', priority: 'normal', author: 'Lab Coordinator', time: '30 Mar 2026, 2:00 PM', pinned: false },
]);
let MEDIA = dbLoad(DB_KEY_MEDIA, []);

function saveClasses() { dbSave(DB_KEY_CLASSES, CLASSES); }
function saveGroups() { dbSave(DB_KEY_GROUPS, GROUPS); }
function saveUpdates() { dbSave(DB_KEY_UPDATES, DAILY_UPDATES); }
function saveMedia() { dbSave(DB_KEY_MEDIA, MEDIA); }

let nextClassId = CLASSES.length ? Math.max(...CLASSES.map(c => parseInt(c.id.replace('cls', '')) || 0)) + 1 : 1;
let nextGroupId = GROUPS.length ? Math.max(...GROUPS.map(g => parseInt(g.id.replace('g', '')) || 0)) + 1 : 1;
let nextUpdateId = DAILY_UPDATES.length ? Math.max(...DAILY_UPDATES.map(u => parseInt(u.id.replace('u', '')) || 0)) + 1 : 1;
let nextMediaId = MEDIA.length ? Math.max(...MEDIA.map(m => parseInt(m.id.replace('m', '')) || 0)) + 1 : 1;

let currentGroupObj = null;
let currentConv = null;
let activeClassId = null;

const GRADIENTS = [
    'linear-gradient(135deg,#06b6d4,#0284c7)',
    'linear-gradient(135deg,#8b5cf6,#6d28d9)',
    'linear-gradient(135deg,#10b981,#059669)',
    'linear-gradient(135deg,#f59e0b,#d97706)',
    'linear-gradient(135deg,#ec4899,#be185d)',
    'linear-gradient(135deg,#14b8a6,#0f766e)',
    'linear-gradient(135deg,#f97316,#e85d04)',
    'linear-gradient(135deg,#a855f7,#7c3aed)',
];
const TYPE_ICON = {
    'General': '📚', 'Lab Group': '🔬', 'Project Group': '💡', 'Study Group': '📖', 'Special Group': '⭐'
};

/* ═══════════════════════════════════════════════════════════════════
   ▌ FEATURE 1 — DAILY UPDATES (Admin/HOD)
   ═══════════════════════════════════════════════════════════════════ */

/* Inject Daily Updates widget into the dashboard */
function injectDailyUpdatesWidget() {
    const pg = document.getElementById('page-dashboard');
    if (!pg || document.getElementById('dailyUpdatesWidget')) return;

    const widget = document.createElement('div');
    widget.id = 'dailyUpdatesWidget';
    widget.style.cssText = 'margin-bottom:20px;';
    widget.innerHTML = `
    <div class="card" style="border-left:4px solid var(--accent-orange);position:relative;overflow:hidden;">
      <!-- Animated top bar -->
      <div style="position:absolute;top:0;left:0;right:0;height:3px;
                  background:linear-gradient(90deg,var(--accent-orange),var(--accent-red),var(--accent-purple),var(--accent-cyan));
                  background-size:300% 100%;animation:gradientShift 3s linear infinite;"></div>

      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:40px;height:40px;border-radius:12px;
                      background:linear-gradient(135deg,var(--accent-orange),var(--accent-red));
                      display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">📢</div>
          <div>
            <div style="font-family:'Rajdhani',sans-serif;font-size:18px;font-weight:800;letter-spacing:.5px;">
              Daily Updates
              <span id="updateBadge" style="margin-left:8px;background:var(--accent-red);color:#fff;
                    border-radius:20px;padding:2px 8px;font-size:11px;font-weight:700;vertical-align:middle;">
                ${DAILY_UPDATES.filter(u => u.priority === 'urgent').length} Urgent
              </span>
            </div>
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
          <button class="btn btn-primary btn-sm" onclick="openPostUpdateModal()" style="font-size:11px;">
            ✍️ Post Update
          </button>
        </div>
      </div>

      <!-- Pinned notice ticker -->
      <div id="pinnedTicker" style="background:var(--accent-orange)15;border:1px solid var(--accent-orange)44;
           border-radius:10px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;gap:10px;
           overflow:hidden;cursor:pointer;" onclick="scrollToUpdate('pinned')">
        <span style="background:var(--accent-orange);color:#fff;border-radius:6px;padding:2px 8px;
                     font-size:10px;font-weight:800;letter-spacing:.5px;flex-shrink:0;">📌 PINNED</span>
        <div id="tickerText" style="font-size:13px;font-weight:600;overflow:hidden;white-space:nowrap;
             text-overflow:ellipsis;color:var(--text-primary);">
          ${DAILY_UPDATES.find(u => u.pinned)?.title || 'No pinned notices'}
        </div>
      </div>

      <!-- Update Cards -->
      <div id="updatesContainer" style="display:flex;flex-direction:column;gap:10px;max-height:420px;overflow-y:auto;
           padding-right:4px;scrollbar-width:thin;scrollbar-color:var(--border) transparent;">
      </div>
    </div>`;

    // Insert after stat cards (first .grid-4)
    const grid4 = pg.querySelector('.grid-4');
    if (grid4) grid4.after(widget);
    else pg.prepend(widget);

    renderUpdateCards('all');
    addUpdateAnimCSS();
}

function addUpdateAnimCSS() {
    if (document.getElementById('updateAnimCSS')) return;
    const s = document.createElement('style');
    s.id = 'updateAnimCSS';
    s.textContent = `
    @keyframes gradientShift {
        0%   { background-position:0% 50%; }
        100% { background-position:300% 50%; }
    }
    @keyframes slideInUp {
        from { opacity:0; transform:translateY(12px); }
        to   { opacity:1; transform:translateY(0); }
    }
    .update-card { animation: slideInUp .3s ease forwards; }
    .update-card:hover { border-color:var(--accent-cyan) !important; transform:translateY(-1px); }
    .update-expand { display:none; }
    .update-expand.open { display:block; }
    #updatesContainer::-webkit-scrollbar { width:5px; }
    #updatesContainer::-webkit-scrollbar-track { background:transparent; }
    #updatesContainer::-webkit-scrollbar-thumb { background:var(--border);border-radius:3px; }

    /* Media upload styles */
    .media-upload-zone {
        border:2px dashed var(--border);border-radius:14px;padding:32px;text-align:center;
        cursor:pointer;transition:.2s;position:relative;overflow:hidden;
    }
    .media-upload-zone:hover { border-color:var(--accent-cyan);background:var(--accent-cyan)08; }
    .media-item { transition:.2s; }
    .media-item:hover { border-color:var(--accent-cyan) !important; transform:translateY(-2px); }
    @keyframes progressFill {
        from { width:0%; }
        to   { width:100%; }
    }
    .progress-bar-anim { animation: progressFill 2s ease forwards; }
    `;
    document.head.appendChild(s);
}

function renderUpdateCards(filter) {
    const container = document.getElementById('updatesContainer');
    if (!container) return;
    const list = filter === 'all'
        ? [...DAILY_UPDATES].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
        : DAILY_UPDATES.filter(u => u.priority === filter);

    if (!list.length) {
        container.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-muted);font-size:13px;">
            No updates found for this filter.</div>`;
        return;
    }

    const priorityMeta = {
        urgent: { color: 'var(--accent-red)', bg: 'var(--accent-red)18', label: '🔴 URGENT', border: 'var(--accent-red)55' },
        high: { color: 'var(--accent-orange)', bg: 'var(--accent-orange)18', label: '🟠 HIGH', border: 'var(--accent-orange)55' },
        normal: { color: 'var(--accent-cyan)', bg: 'var(--accent-cyan)10', label: '🔵 INFO', border: 'var(--border)' },
    };

    container.innerHTML = list.map((u, i) => {
        const pm = priorityMeta[u.priority] || priorityMeta.normal;
        return `
        <div class="update-card" id="upd-${u.id}" data-priority="${u.priority}"
             style="border:1px solid ${pm.border};border-radius:12px;background:${pm.bg};
                    padding:14px 16px;cursor:pointer;transition:.2s;animation-delay:${i * 0.05}s;"
             onclick="toggleUpdateExpand('${u.id}')">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;">
            <div style="flex:1;min-width:0;">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;flex-wrap:wrap;">
                <span style="font-size:9px;font-weight:800;letter-spacing:.8px;
                             color:${pm.color};background:${pm.color}22;
                             border:1px solid ${pm.color}44;border-radius:5px;padding:1px 7px;">
                  ${pm.label}
                </span>
                ${u.pinned ? '<span style="font-size:9px;background:var(--accent-orange);color:#fff;border-radius:5px;padding:1px 7px;font-weight:700;">📌 PINNED</span>' : ''}
                <span style="font-size:10px;color:var(--text-muted);">${u.time}</span>
              </div>
              <div style="font-size:14px;font-weight:700;color:var(--text-primary);line-height:1.4;">${u.title}</div>
              <div style="font-size:11px;color:var(--text-secondary);margin-top:3px;">👤 ${u.author}</div>
            </div>
            <div style="display:flex;gap:5px;flex-shrink:0;align-items:center;">
              <button onclick="event.stopPropagation();pinToggleUpdate('${u.id}')"
                style="background:none;border:1px solid var(--border);border-radius:6px;padding:3px 7px;
                       cursor:pointer;font-size:12px;color:${u.pinned ? 'var(--accent-orange)' : 'var(--text-muted)'};"
                title="${u.pinned ? 'Unpin' : 'Pin'}">📌</button>
              <button onclick="event.stopPropagation();deleteUpdate('${u.id}')"
                style="background:none;border:1px solid var(--border);border-radius:6px;padding:3px 7px;
                       cursor:pointer;font-size:12px;color:var(--accent-red);">🗑</button>
              <span id="arrow-${u.id}" style="font-size:12px;color:var(--text-muted);transition:.2s;">▼</span>
            </div>
          </div>
          <div class="update-expand" id="expand-${u.id}">
            <div style="margin-top:12px;padding-top:12px;border-top:1px solid ${pm.border};
                        font-size:13px;color:var(--text-secondary);line-height:1.7;">
              ${u.body}
            </div>
            <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
              <button class="btn btn-outline btn-sm" style="font-size:11px;"
                      onclick="event.stopPropagation();acknowledgeUpdate('${u.id}')">✅ Acknowledged</button>
              <button class="btn btn-outline btn-sm" style="font-size:11px;"
                      onclick="event.stopPropagation();forwardUpdateToGroup('${u.id}')">📤 Forward to Group</button>
            </div>
          </div>
        </div>`;
    }).join('');
}

function toggleUpdateExpand(id) {
    const el = document.getElementById('expand-' + id);
    const arr = document.getElementById('arrow-' + id);
    if (!el) return;
    el.classList.toggle('open');
    if (arr) arr.style.transform = el.classList.contains('open') ? 'rotate(180deg)' : '';
}

function filterUpdates(filter, btn) {
    document.querySelectorAll('.upd-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderUpdateCards(filter);
}

function pinToggleUpdate(id) {
    const u = DAILY_UPDATES.find(x => x.id === id);
    if (!u) return;
    DAILY_UPDATES.forEach(x => x.pinned = false);
    u.pinned = !u.pinned;
    saveUpdates();
    const ticker = document.getElementById('tickerText');
    if (ticker) ticker.textContent = DAILY_UPDATES.find(x => x.pinned)?.title || 'No pinned notices';
    renderUpdateCards(document.querySelector('.upd-filter.active')?.dataset.filter || 'all');
    showToast(u.pinned ? '📌 Notice pinned!' : '📌 Notice unpinned.');
}

function deleteUpdate(id) {
    if (!confirm('Delete this update?')) return;
    DAILY_UPDATES = DAILY_UPDATES.filter(u => u.id !== id);
    saveUpdates();
    updateBadgeCount();
    renderUpdateCards(document.querySelector('.upd-filter.active')?.dataset.filter || 'all');
    showToast('🗑 Update deleted.');
}

function updateBadgeCount() {
    const b = document.getElementById('updateBadge');
    const c = document.getElementById('updateCount');
    if (b) b.textContent = DAILY_UPDATES.filter(u => u.priority === 'urgent').length + ' Urgent';
    if (c) c.textContent = DAILY_UPDATES.length;
}

function acknowledgeUpdate(id) {
    showToast('✅ Acknowledged!');
}

function forwardUpdateToGroup(id) {
    const u = DAILY_UPDATES.find(x => x.id === id);
    if (!u) return;
    if (!GROUPS.length) { showToast('⚠️ No groups yet.'); return; }
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    GROUPS.forEach(g => {
        g.chat.push({ from: 'Dr. Priya Verma', text: `📢 Notice from Admin: ${u.title}\n\n${u.body}`, time: now, sent: true });
        g.lastMsg = '📢 Admin Notice forwarded · Just now';
    });
    saveGroups();
    showToast('📤 Forwarded to all groups!');
}

/* Post Update Modal */
function openPostUpdateModal() {
    document.getElementById('postUpdateModal')?.remove();
    const m = document.createElement('div');
    m.className = 'modal-overlay open';
    m.id = 'postUpdateModal';
    m.innerHTML = `
    <div class="modal" style="width:520px;max-width:95vw;">
      <div class="modal-title">✍️ Post Daily Update</div>
      <div style="background:var(--bg-secondary);border-radius:10px;padding:10px 14px;margin-bottom:14px;
                  font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:8px;">
        <span style="font-size:16px;">ℹ️</span>
        Posting as <strong style="color:var(--accent-cyan);">Dr. Priya Verma</strong> —
        In a live system this would be restricted to HOD/Admin roles.
      </div>
      <div class="form-group">
        <label class="form-label">Notice Title <span style="color:var(--accent-red);">*</span></label>
        <input class="form-input" id="upd-title" placeholder="e.g. 📅 Exam schedule updated">
      </div>
      <div class="form-group">
        <label class="form-label">Full Message <span style="color:var(--accent-red);">*</span></label>
        <textarea class="form-textarea" id="upd-body" style="min-height:100px;"
                  placeholder="Write the full notice content here..."></textarea>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        <div class="form-group">
          <label class="form-label">Priority</label>
          <select class="form-select" id="upd-priority">
            <option value="normal">🔵 Normal</option>
            <option value="high">🟠 High</option>
            <option value="urgent">🔴 Urgent</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Author / Posted By</label>
          <input class="form-input" id="upd-author" value="HOD — Dr. Ramesh Kumar">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
          <input type="checkbox" id="upd-pin" style="width:15px;height:15px;accent-color:var(--accent-orange);">
          📌 Pin this notice at the top
        </label>
      </div>
      <div class="form-group">
        <label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
          <input type="checkbox" id="upd-notify-groups" checked style="width:15px;height:15px;accent-color:var(--accent-cyan);">
          📢 Also broadcast to all groups
        </label>
      </div>
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
    const title = document.getElementById('upd-title')?.value.trim();
    const body = document.getElementById('upd-body')?.value.trim();
    const priority = document.getElementById('upd-priority')?.value || 'normal';
    const author = document.getElementById('upd-author')?.value.trim() || 'Admin';
    const pin = document.getElementById('upd-pin')?.checked;
    const notify = document.getElementById('upd-notify-groups')?.checked;

    if (!title) { showToast('⚠️ Enter a title.'); return; }
    if (!body) { showToast('⚠️ Enter notice content.'); return; }

    if (pin) DAILY_UPDATES.forEach(u => u.pinned = false);

    const now = new Date();
    const timeStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' +
        now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const upd = { id: 'u' + (nextUpdateId++), title, body, priority, author, time: timeStr, pinned: !!pin };
    DAILY_UPDATES.unshift(upd);
    saveUpdates();

    if (notify && GROUPS.length) {
        const t = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        GROUPS.forEach(g => {
            g.chat.push({ from: author, text: `📢 ${title}\n\n${body}`, time: t, sent: true });
            g.lastMsg = '📢 Notice · Just now';
        });
        saveGroups();
    }

    document.getElementById('postUpdateModal')?.remove();
    updateBadgeCount();
    renderUpdateCards('all');
    const ticker = document.getElementById('tickerText');
    if (ticker) ticker.textContent = DAILY_UPDATES.find(u => u.pinned)?.title || DAILY_UPDATES[0]?.title || '';
    showToast('✅ Update posted!' + (notify && GROUPS.length ? ' Groups notified.' : ''));
}


/* ═══════════════════════════════════════════════════════════════════
   ▌ FEATURE 2 — MEDIA UPLOAD (Video / Audio)
   ═══════════════════════════════════════════════════════════════════ */

/* Inject media page nav + page element */
function injectMediaPage() {
    if (document.getElementById('page-media')) return;

    // Create page
    const pg = document.createElement('div');
    pg.className = 'page';
    pg.id = 'page-media';
    document.querySelector('.content')?.appendChild(pg);

    // Create nav item
    if (!document.querySelector('.nav-item[onclick*="media"]')) {
        const nav = document.querySelector('.nav-section:nth-of-type(2)');
        if (nav) {
            const item = document.createElement('div');
            item.className = 'nav-item';
            item.setAttribute('onclick', "navigate('media',this)");
            item.innerHTML = '<span class="icon">🎬</span> Media Upload';
            nav.appendChild(item);
        }
    }
}

function renderMediaPage() {
    const pg = document.getElementById('page-media');
    if (!pg) return;

    const classOpts = CLASSES.length
        ? CLASSES.map(c => `<option value="${c.id}">${c.label}</option>`).join('')
        : '<option value="">— No classes yet —</option>';

    const groupOpts = GROUPS.length
        ? GROUPS.map(g => `<option value="${g.id}">${g.name}</option>`).join('')
        : '<option value="">— No groups yet —</option>';

    pg.innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">🎬 Media Upload</div>
        <div class="section-sub">Upload lecture videos and audio recordings for your classes and groups</div>
      </div>
      <button class="btn btn-primary" onclick="openMediaUploadModal()">📤 Upload Media</button>
    </div>

    <!-- Stats row -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px;">
      <div class="stat-card">
        <div class="stat-icon">🎥</div>
        <div class="stat-val" style="color:var(--accent-cyan);" id="stat-videos">${MEDIA.filter(m => m.type === 'video').length}</div>
        <div class="stat-label">Videos Uploaded</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🎙️</div>
        <div class="stat-val" style="color:var(--accent-purple);" id="stat-audio">${MEDIA.filter(m => m.type === 'audio').length}</div>
        <div class="stat-label">Audio Recordings</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">👁️</div>
        <div class="stat-val" style="color:var(--accent-green);" id="stat-views">${MEDIA.reduce((a, m) => a + (m.views || 0), 0)}</div>
        <div class="stat-label">Total Views</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🏫</div>
        <div class="stat-val" style="color:var(--accent-orange);" id="stat-classes">${[...new Set(MEDIA.map(m => m.targetId))].length}</div>
        <div class="stat-label">Classes/Groups Covered</div>
      </div>
    </div>

    <!-- Filter + Search bar -->
    <div class="card" style="margin-bottom:16px;padding:14px 16px;">
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <input class="form-input" id="mediaSearch" placeholder="🔍 Search by title, subject, class..."
               style="flex:1;min-width:200px;" oninput="filterMediaGrid()">
        <select class="form-select" id="mediaTypeFilter" style="width:140px;" onchange="filterMediaGrid()">
          <option value="all">All Types</option>
          <option value="video">🎥 Video Only</option>
          <option value="audio">🎙️ Audio Only</option>
        </select>
        <select class="form-select" id="mediaTargetFilter" style="width:160px;" onchange="filterMediaGrid()">
          <option value="all">All Classes/Groups</option>
          ${CLASSES.map(c => `<option value="${c.id}">📚 ${c.key}</option>`).join('')}
          ${GROUPS.map(g => `<option value="${g.id}">👥 ${g.name}</option>`).join('')}
        </select>
        <div style="display:flex;gap:5px;">
          <button class="btn btn-outline btn-sm" id="viewGrid" onclick="setMediaView('grid',this)" style="font-size:13px;">⊞</button>
          <button class="btn btn-outline btn-sm" id="viewList" onclick="setMediaView('list',this)" style="font-size:13px;">☰</button>
        </div>
      </div>
    </div>

    <!-- Media Grid -->
    <div id="mediaGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;"></div>
    <div id="mediaList" style="display:none;flex-direction:column;gap:10px;"></div>`;

    renderMediaGrid();
}

let mediaViewMode = 'grid';
function setMediaView(mode, btn) {
    mediaViewMode = mode;
    document.getElementById('mediaGrid').style.display = mode === 'grid' ? 'grid' : 'none';
    document.getElementById('mediaList').style.display = mode === 'list' ? 'flex' : 'none';
    document.getElementById('viewGrid').style.borderColor = mode === 'grid' ? 'var(--accent-cyan)' : '';
    document.getElementById('viewList').style.borderColor = mode === 'list' ? 'var(--accent-cyan)' : '';
    renderMediaGrid();
}

function filterMediaGrid() {
    renderMediaGrid();
}

function renderMediaGrid() {
    const search = document.getElementById('mediaSearch')?.value.toLowerCase() || '';
    const typeF = document.getElementById('mediaTypeFilter')?.value || 'all';
    const targetF = document.getElementById('mediaTargetFilter')?.value || 'all';

    let list = MEDIA.filter(m => {
        const matchSearch = !search || m.title.toLowerCase().includes(search) ||
            (m.subject || '').toLowerCase().includes(search) ||
            (m.targetName || '').toLowerCase().includes(search);
        const matchType = typeF === 'all' || m.type === typeF;
        const matchTarget = targetF === 'all' || m.targetId === targetF;
        return matchSearch && matchType && matchTarget;
    });

    const grid = document.getElementById('mediaGrid');
    const lst = document.getElementById('mediaList');
    if (!grid && !lst) return;

    if (!list.length) {
        const empty = `<div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:var(--text-muted);">
            <div style="font-size:56px;margin-bottom:16px;">🎬</div>
            <div style="font-size:18px;font-weight:700;margin-bottom:8px;color:var(--text-primary);">No Media Yet</div>
            <div style="font-size:13px;max-width:320px;margin:0 auto 20px;line-height:1.6;">
              Upload lecture videos or audio recordings for your classes and groups.
            </div>
            <button class="btn btn-primary" onclick="openMediaUploadModal()">📤 Upload First Media</button>
          </div>`;
        if (grid) grid.innerHTML = empty;
        if (lst) lst.innerHTML = empty;
        return;
    }

    if (mediaViewMode === 'grid') {
        grid.innerHTML = list.map(m => buildMediaCard(m)).join('');
    } else {
        lst.innerHTML = list.map(m => buildMediaListItem(m)).join('');
    }
}

function buildMediaCard(m) {
    const isVideo = m.type === 'video';
    const gradient = isVideo
        ? 'linear-gradient(135deg,#1a1a2e,#16213e)'
        : 'linear-gradient(135deg,#0f2027,#203a43)';
    const accentColor = isVideo ? 'var(--accent-cyan)' : 'var(--accent-purple)';
    const icon = isVideo ? '🎥' : '🎙️';
    const tagColor = isVideo ? '#00d4ff' : '#a855f7';

    return `
    <div class="media-item card" style="padding:0;overflow:hidden;border:1px solid var(--border);cursor:pointer;"
         onclick="openMediaPlayer('${m.id}')">
      <!-- Thumbnail area -->
      <div style="height:140px;background:${gradient};position:relative;overflow:hidden;
                  display:flex;align-items:center;justify-content:center;">
        <div style="font-size:52px;opacity:.7;">${icon}</div>
        <!-- Play button overlay -->
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
                    opacity:0;transition:.2s;background:rgba(0,0,0,.4);"
             onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0">
          <div style="width:50px;height:50px;border-radius:50%;background:${accentColor};
                      display:flex;align-items:center;justify-content:center;font-size:20px;">▶️</div>
        </div>
        <!-- Type badge -->
        <div style="position:absolute;top:10px;left:10px;background:${tagColor}22;border:1px solid ${tagColor}55;
                    border-radius:6px;padding:2px 8px;font-size:10px;font-weight:700;color:${tagColor};">
          ${icon} ${isVideo ? 'VIDEO' : 'AUDIO'}
        </div>
        <!-- Duration -->
        ${m.duration ? `<div style="position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,.7);
                         border-radius:5px;padding:2px 7px;font-size:10px;color:#fff;font-weight:600;">⏱ ${m.duration}</div>` : ''}
      </div>
      <div style="padding:14px;">
        <div style="font-size:13px;font-weight:700;margin-bottom:5px;line-height:1.4;
                    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${m.title}">${m.title}</div>
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;flex-wrap:wrap;">
          ${m.subject ? `<span style="font-size:10px;background:var(--accent-cyan)18;color:var(--accent-cyan);
                                  border:1px solid var(--accent-cyan)33;border-radius:10px;padding:1px 7px;">📚 ${m.subject}</span>` : ''}
          <span style="font-size:10px;background:var(--bg-secondary);border:1px solid var(--border);
                       border-radius:10px;padding:1px 7px;color:var(--text-secondary);">
            ${m.targetType === 'class' ? '🏫' : '👥'} ${m.targetName || '—'}
          </span>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:10px;">
          📅 ${m.uploadedAt} · 👁 ${m.views || 0} views · 📦 ${m.size || '—'}
        </div>
        ${m.description ? `<div style="font-size:11px;color:var(--text-secondary);margin-bottom:10px;
                                       line-height:1.5;max-height:36px;overflow:hidden;text-overflow:ellipsis;">
          ${m.description}</div>` : ''}
        <div style="display:flex;gap:6px;">
          <button class="btn btn-primary btn-sm" style="flex:1;font-size:11px;"
                  onclick="event.stopPropagation();openMediaPlayer('${m.id}')">▶ Play</button>
          <button class="btn btn-outline btn-sm" style="font-size:11px;"
                  onclick="event.stopPropagation();shareMediaToGroup('${m.id}')">📤 Share</button>
          <button class="btn btn-outline btn-sm" style="color:var(--accent-red);border-color:var(--accent-red);font-size:11px;"
                  onclick="event.stopPropagation();deleteMedia('${m.id}')">🗑</button>
        </div>
      </div>
    </div>`;
}

function buildMediaListItem(m) {
    const isVideo = m.type === 'video';
    const icon = isVideo ? '🎥' : '🎙️';
    const color = isVideo ? 'var(--accent-cyan)' : 'var(--accent-purple)';
    return `
    <div class="media-item" style="border:1px solid var(--border);border-radius:12px;padding:12px 16px;
         background:var(--bg-card);display:flex;align-items:center;gap:14px;cursor:pointer;transition:.2s;"
         onclick="openMediaPlayer('${m.id}')">
      <div style="width:50px;height:50px;border-radius:10px;background:${color}18;border:1px solid ${color}33;
                  display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">${icon}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${m.title}</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">
          ${m.subject ? '📚 ' + m.subject + ' · ' : ''}${m.targetType === 'class' ? '🏫' : '👥'} ${m.targetName || '—'} · 📅 ${m.uploadedAt}
        </div>
      </div>
      <div style="text-align:right;flex-shrink:0;">
        <div style="font-size:11px;color:var(--text-muted);">👁 ${m.views || 0} views</div>
        ${m.duration ? `<div style="font-size:11px;color:var(--text-muted);">⏱ ${m.duration}</div>` : ''}
        <div style="font-size:10px;color:var(--text-muted);">${m.size || '—'}</div>
      </div>
      <div style="display:flex;gap:5px;flex-shrink:0;">
        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();openMediaPlayer('${m.id}')">▶</button>
        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();shareMediaToGroup('${m.id}')">📤</button>
        <button class="btn btn-outline btn-sm" style="color:var(--accent-red);border-color:var(--accent-red);"
                onclick="event.stopPropagation();deleteMedia('${m.id}')">🗑</button>
      </div>
    </div>`;
}

/* Media Upload Modal */
function openMediaUploadModal() {
    document.getElementById('mediaUploadModal')?.remove();
    const m = document.createElement('div');
    m.className = 'modal-overlay open';
    m.id = 'mediaUploadModal';

    const classOpts = CLASSES.map(c => `<option value="${c.id}" data-type="class">${c.label}</option>`).join('');
    const groupOpts = GROUPS.map(g => `<option value="${g.id}" data-type="group">👥 ${g.name}</option>`).join('');
    const allSubj = [...new Set(CLASSES.flatMap(c => c.subjects))];

    m.innerHTML = `
    <div class="modal" style="width:560px;max-width:95vw;max-height:92vh;overflow-y:auto;">
      <div class="modal-title">📤 Upload Media</div>

      <!-- Type selector -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px;">
        <label style="cursor:pointer;">
          <input type="radio" name="mtype" value="video" id="mt-video" checked onchange="toggleMediaAccept()">
          <div id="mt-video-card" style="border:2px solid var(--accent-cyan);border-radius:12px;padding:16px;
               text-align:center;background:var(--accent-cyan)10;transition:.2s;">
            <div style="font-size:32px;">🎥</div>
            <div style="font-size:13px;font-weight:700;margin-top:6px;color:var(--accent-cyan);">Video Lecture</div>
            <div style="font-size:10px;color:var(--text-muted);margin-top:3px;">MP4, AVI, MOV, MKV, WebM</div>
          </div>
        </label>
        <label style="cursor:pointer;">
          <input type="radio" name="mtype" value="audio" id="mt-audio" onchange="toggleMediaAccept()">
          <div id="mt-audio-card" style="border:2px solid var(--border);border-radius:12px;padding:16px;
               text-align:center;background:var(--bg-secondary);transition:.2s;">
            <div style="font-size:32px;">🎙️</div>
            <div style="font-size:13px;font-weight:700;margin-top:6px;">Audio Recording</div>
            <div style="font-size:10px;color:var(--text-muted);margin-top:3px;">MP3, WAV, M4A, OGG, AAC</div>
          </div>
        </label>
      </div>

      <!-- Drop zone -->
      <div class="media-upload-zone" id="mediaDropZone" onclick="document.getElementById('mediaFileInput').click()"
           ondragover="event.preventDefault();this.style.borderColor='var(--accent-cyan)'"
           ondragleave="this.style.borderColor='var(--border)'"
           ondrop="handleMediaDrop(event)">
        <div style="font-size:40px;margin-bottom:10px;">📁</div>
        <div style="font-size:14px;font-weight:600;margin-bottom:5px;">Click or drag & drop your file here</div>
        <div id="mediaDropHint" style="font-size:11px;color:var(--text-muted);">MP4, AVI, MOV, MKV, WebM accepted</div>
        <input type="file" id="mediaFileInput" style="display:none"
               accept="video/*" onchange="handleMediaFileSelect(event)">
      </div>

      <!-- File preview -->
      <div id="mediaFilePreview" style="display:none;margin:12px 0;padding:12px 14px;
           background:var(--bg-secondary);border-radius:10px;border:1px solid var(--border);">
        <div style="display:flex;align-items:center;gap:10px;">
          <span id="mfp-icon" style="font-size:24px;">🎥</span>
          <div style="flex:1;">
            <div style="font-size:13px;font-weight:600;" id="mfp-name">file.mp4</div>
            <div style="font-size:11px;color:var(--text-muted);" id="mfp-size">0 MB</div>
          </div>
          <span style="font-size:18px;color:var(--accent-green);">✅</span>
        </div>
        <!-- Simulated progress bar -->
        <div style="margin-top:8px;height:4px;background:var(--border);border-radius:2px;overflow:hidden;">
          <div id="mfp-progress" style="height:100%;background:linear-gradient(90deg,var(--accent-cyan),var(--accent-teal));
               border-radius:2px;width:0%;transition:width .3s;"></div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Title <span style="color:var(--accent-red);">*</span></label>
        <input class="form-input" id="media-title" placeholder="e.g. Lecture 5: Binary Trees & AVL Trees">
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        <div class="form-group">
          <label class="form-label">Subject</label>
          <input class="form-input" id="media-subject" placeholder="e.g. Data Structures"
                 list="subjDatalist" autocomplete="off">
          <datalist id="subjDatalist">
            ${allSubj.map(s => `<option value="${s}">`).join('')}
          </datalist>
        </div>
        <div class="form-group">
          <label class="form-label">Duration</label>
          <input class="form-input" id="media-duration" placeholder="e.g. 45:20">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Assign to <span style="color:var(--accent-red);">*</span></label>
        <select class="form-select" id="media-target">
          <option value="">— Select class or group —</option>
          ${CLASSES.length ? `<optgroup label="📚 Classes">${classOpts}</optgroup>` : ''}
          ${GROUPS.length ? `<optgroup label="👥 Groups">${groupOpts}</optgroup>` : ''}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Description <span style="font-size:11px;font-weight:400;color:var(--text-muted);">(optional)</span></label>
        <textarea class="form-textarea" id="media-desc"
                  placeholder="What does this lecture cover? Any prerequisites or notes for students..."></textarea>
      </div>

      <div class="form-group">
        <label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
          <input type="checkbox" id="media-notify" checked style="width:15px;height:15px;accent-color:var(--accent-cyan);">
          📢 Notify students via group chat when uploaded
        </label>
      </div>

      <div class="modal-footer">
        <button class="btn btn-outline" onclick="document.getElementById('mediaUploadModal').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="submitMediaUpload()" id="mediaSubmitBtn">📤 Upload Media</button>
      </div>
    </div>`;
    document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target === m) m.remove(); });

    // Radio card visual toggle
    ['video', 'audio'].forEach(t => {
        document.getElementById('mt-' + t)?.addEventListener('change', () => {
            const onColor = 'var(--accent-' + (t === 'video' ? 'cyan' : 'purple') + ')';
            document.getElementById('mt-video-card').style.borderColor = t === 'video' ? onColor : 'var(--border)';
            document.getElementById('mt-audio-card').style.borderColor = t === 'audio' ? onColor : 'var(--border)';
            document.getElementById('mt-video-card').style.background = t === 'video' ? onColor.replace(')', ',0.08)').replace('var(', 'rgba(255,') : 'var(--bg-secondary)';
            document.getElementById('mt-audio-card').style.background = t === 'audio' ? 'var(--accent-purple)10' : 'var(--bg-secondary)';
        });
    });
}

function toggleMediaAccept() {
    const isVideo = document.getElementById('mt-video')?.checked;
    const inp = document.getElementById('mediaFileInput');
    const hint = document.getElementById('mediaDropHint');
    if (inp) inp.accept = isVideo ? 'video/*' : 'audio/*';
    if (hint) hint.textContent = isVideo
        ? 'MP4, AVI, MOV, MKV, WebM accepted'
        : 'MP3, WAV, M4A, OGG, AAC accepted';
}

function handleMediaDrop(e) {
    e.preventDefault();
    document.getElementById('mediaDropZone').style.borderColor = 'var(--border)';
    const file = e.dataTransfer.files[0];
    if (file) processMediaFile(file);
}

function handleMediaFileSelect(e) {
    const file = e.target.files[0];
    if (file) processMediaFile(file);
}

function processMediaFile(file) {
    const preview = document.getElementById('mediaFilePreview');
    const icon = document.getElementById('mfp-icon');
    const name = document.getElementById('mfp-name');
    const size = document.getElementById('mfp-size');
    const bar = document.getElementById('mfp-progress');
    if (!preview) return;

    preview.style.display = 'block';
    const isVideo = file.type.startsWith('video');
    if (icon) icon.textContent = isVideo ? '🎥' : '🎙️';
    if (name) name.textContent = file.name;
    if (size) size.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    // Auto-fill title from filename
    const titleEl = document.getElementById('media-title');
    if (titleEl && !titleEl.value) {
        titleEl.value = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    }

    // Animate progress bar
    if (bar) {
        bar.style.width = '0%';
        setTimeout(() => { bar.style.width = '100%'; }, 100);
    }
}

function submitMediaUpload() {
    const title = document.getElementById('media-title')?.value.trim();
    const targetEl = document.getElementById('media-target');
    const targetId = targetEl?.value;
    const subject = document.getElementById('media-subject')?.value.trim();
    const duration = document.getElementById('media-duration')?.value.trim();
    const desc = document.getElementById('media-desc')?.value.trim();
    const notify = document.getElementById('media-notify')?.checked;
    const type = document.getElementById('mt-video')?.checked ? 'video' : 'audio';

    if (!title) { showToast('⚠️ Enter a title.'); return; }
    if (!targetId) { showToast('⚠️ Assign to a class or group.'); return; }

    const fileInput = document.getElementById('mediaFileInput');
    const fileName = fileInput?.files[0]?.name || null;
    const fileSize = fileInput?.files[0] ? ((fileInput.files[0].size / (1024 * 1024)).toFixed(2) + ' MB') : '—';

    // Determine target name + type
    const cls = CLASSES.find(c => c.id === targetId);
    const grp = GROUPS.find(g => g.id === targetId);
    const targetName = cls?.label || grp?.name || '—';
    const targetType = cls ? 'class' : 'group';

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const media = {
        id: 'm' + (nextMediaId++),
        type, title, subject, duration, desc: desc || '',
        targetId, targetName, targetType,
        fileName, size: fileSize,
        views: 0,
        uploadedAt: dateStr,
        uploadedBy: 'Dr. Priya Verma'
    };
    MEDIA.push(media);
    saveMedia();

    // Notify group
    if (notify) {
        const t = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        const notifyGroups = grp ? [grp] : GROUPS.filter(g => g.classId === targetId);
        const icon = type === 'video' ? '🎥' : '🎙️';
        notifyGroups.forEach(g => {
            g.chat.push({
                from: 'Dr. Priya Verma',
                text: `${icon} New ${type === 'video' ? 'Lecture Video' : 'Audio Recording'} uploaded!\n📌 "${title}"${subject ? ' — 📚 ' + subject : ''}${duration ? ' — ⏱ ' + duration : ''}\n\nAvailable now in the Media section.`,
                time: t, sent: true
            });
            g.lastMsg = `${icon} New ${type} uploaded · Just now`;
        });
        saveGroups();
    }

    document.getElementById('mediaUploadModal')?.remove();

    // Refresh media stats + grid
    const sv = document.getElementById('stat-videos');
    const sa = document.getElementById('stat-audio');
    const sc = document.getElementById('stat-classes');
    if (sv) sv.textContent = MEDIA.filter(x => x.type === 'video').length;
    if (sa) sa.textContent = MEDIA.filter(x => x.type === 'audio').length;
    if (sc) sc.textContent = [...new Set(MEDIA.map(x => x.targetId))].length;

    renderMediaGrid();
    showToast(`✅ "${title}" uploaded!${notify ? ' Students notified.' : ''}`);
}

/* Media Player Modal */
function openMediaPlayer(id) {
    const m = MEDIA.find(x => x.id === id);
    if (!m) return;
    m.views = (m.views || 0) + 1;
    saveMedia();

    document.getElementById('mediaPlayerModal')?.remove();
    const modal = document.createElement('div');
    modal.className = 'modal-overlay open';
    modal.id = 'mediaPlayerModal';
    const isVideo = m.type === 'video';
    const color = isVideo ? 'var(--accent-cyan)' : 'var(--accent-purple)';

    modal.innerHTML = `
    <div class="modal" style="width:620px;max-width:95vw;">
      <div class="modal-title">${isVideo ? '🎥' : '🎙️'} ${m.title}</div>

      <!-- Player area -->
      <div style="background:linear-gradient(135deg,#0d1117,#161b22);border-radius:12px;overflow:hidden;
                  margin-bottom:16px;min-height:200px;display:flex;align-items:center;justify-content:center;
                  border:1px solid var(--border);position:relative;">
        ${m.fileName ? `
          ${isVideo
                ? `<video style="width:100%;max-height:340px;display:block;" controls>
                 <source src="#" type="video/mp4">
                 Your browser does not support video.
               </video>`
                : `<audio style="width:100%;padding:20px;" controls>
                 <source src="#" type="audio/mpeg">
                 Your browser does not support audio.
               </audio>`}
        ` : `
          <!-- Simulated player UI when no actual file is available -->
          <div style="text-align:center;padding:40px;">
            <div style="font-size:60px;margin-bottom:12px;opacity:.7;">${isVideo ? '🎥' : '🎙️'}</div>
            <div style="font-size:15px;font-weight:600;color:var(--text-primary);margin-bottom:6px;">${m.title}</div>
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:20px;">
              File preview unavailable in demo mode.<br>In production, the actual file would stream here.
            </div>
            <!-- Fake player controls -->
            <div style="display:flex;align-items:center;gap:10px;justify-content:center;flex-wrap:wrap;">
              <button style="width:44px;height:44px;border-radius:50%;background:${color};border:none;
                             font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;">▶</button>
              <div style="flex:1;max-width:280px;height:4px;background:var(--border);border-radius:2px;cursor:pointer;">
                <div style="width:35%;height:100%;background:${color};border-radius:2px;"></div>
              </div>
              ${m.duration ? `<span style="font-size:12px;color:var(--text-muted);">${m.duration}</span>` : ''}
            </div>
          </div>
        `}
      </div>

      <!-- Meta info -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;">
        ${[
            ['📚 Subject', m.subject || '—'],
            ['🏫 Assigned', m.targetName || '—'],
            ['⏱ Duration', m.duration || '—'],
            ['📅 Uploaded', m.uploadedAt || '—'],
            ['👁 Views', m.views + ' views'],
            ['📦 Size', m.size || '—'],
        ].map(([lbl, val]) => `
          <div style="background:var(--bg-secondary);border-radius:8px;padding:9px 12px;">
            <div style="font-size:10px;color:var(--text-muted);margin-bottom:2px;">${lbl}</div>
            <div style="font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${val}</div>
          </div>`).join('')}
      </div>

      ${m.desc ? `<div style="background:var(--bg-secondary);border-radius:10px;padding:12px;margin-bottom:16px;
                              font-size:12px;color:var(--text-secondary);line-height:1.6;">${m.desc}</div>` : ''}

      <div class="modal-footer">
        <button class="btn btn-outline" onclick="document.getElementById('mediaPlayerModal').remove()">Close</button>
        <button class="btn btn-outline" onclick="shareMediaToGroup('${m.id}');document.getElementById('mediaPlayerModal').remove()">📤 Share to Group</button>
        <button class="btn btn-primary" onclick="document.getElementById('mediaPlayerModal').remove()">✅ Done</button>
      </div>
    </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    // Refresh view count in grid
    setTimeout(renderMediaGrid, 500);
}

function shareMediaToGroup(id) {
    const m = MEDIA.find(x => x.id === id);
    if (!m) return;
    if (!GROUPS.length) { showToast('⚠️ No groups yet.'); return; }
    document.getElementById('shareMediaModal')?.remove();
    const modal = document.createElement('div');
    modal.className = 'modal-overlay open';
    modal.id = 'shareMediaModal';
    modal.innerHTML = `
    <div class="modal" style="width:420px;max-width:95vw;">
      <div class="modal-title">📤 Share Media to Groups</div>
      <div style="font-size:13px;color:var(--text-secondary);margin-bottom:14px;">
        ${m.type === 'video' ? '🎥' : '🎙️'} <strong>${m.title}</strong>
      </div>
      <div class="form-group" style="background:var(--bg-secondary);border-radius:10px;padding:14px;">
        <label class="form-label">Select Groups</label>
        ${GROUPS.map(g => `
          <label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer;">
            <input type="checkbox" class="share-grp-check" value="${g.id}"
                   ${m.targetId === g.id || m.targetId === g.classId ? 'checked' : ''} style="accent-color:var(--accent-cyan);">
            <span style="font-size:13px;">${g.icon} ${g.name}</span>
          </label>`).join('')}
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="document.getElementById('shareMediaModal').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="confirmShareMedia('${id}')">📤 Share Now</button>
      </div>
    </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

function confirmShareMedia(id) {
    const m = MEDIA.find(x => x.id === id);
    const gids = [...document.querySelectorAll('.share-grp-check:checked')].map(c => c.value);
    if (!gids.length) { showToast('⚠️ Select at least one group.'); return; }
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const icon = m.type === 'video' ? '🎥' : '🎙️';
    gids.forEach(gid => {
        const g = GROUPS.find(x => x.id === gid);
        if (g) {
            g.chat.push({ from: 'Dr. Priya Verma', text: `${icon} Shared: "${m.title}"${m.subject ? ' — ' + m.subject : ''}.`, time: now, sent: true });
            g.lastMsg = `${icon} Media shared · Just now`;
        }
    });
    saveGroups();
    document.getElementById('shareMediaModal')?.remove();
    showToast(`✅ Shared to ${gids.length} group${gids.length > 1 ? 's' : ''}!`);
}

function deleteMedia(id) {
    if (!confirm('Delete this media?')) return;
    MEDIA = MEDIA.filter(m => m.id !== id);
    saveMedia();
    renderMediaGrid();
    showToast('🗑 Media deleted.');
}


/* ─────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────── */
function navigate(page, el) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const pg = document.getElementById('page-' + page);
    if (pg) pg.classList.add('active');
    if (el) el.classList.add('active');

    const titles = {
        dashboard: 'Dashboard', result: 'Upload Results', attendance: 'Attendance',
        classes: 'Classes', group: 'My Groups', messages: 'Messages',
        leaves: 'Leave Management', subjects: 'Subject Performance',
        profile: 'My Profile', media: 'Media Upload'
    };
    const subs = {
        dashboard: 'Welcome back, Dr. Priya Verma 👋 — Thursday, 2 April 2026',
        result: 'Upload and manage student results',
        attendance: 'Mark and track attendance',
        classes: 'Create and manage your classes',
        group: 'Manage class and lab groups',
        messages: 'Personal messages with students and staff',
        leaves: 'Apply for leave',
        subjects: 'Analytics per subject',
        profile: 'Your profile',
        media: 'Upload lecture videos and audio recordings for classes and groups'
    };
    document.getElementById('topbar-title').textContent = titles[page] || page;
    document.getElementById('topbar-sub').textContent = subs[page] || '';

    if (page === 'classes') renderClassesPage();
    if (page === 'group') renderGroupCards();
    if (page === 'result') syncResultPage();
    if (page === 'attendance') { syncAttendanceDropdowns(); buildAttTable(); }
    if (page === 'messages') { syncMessageContacts(); buildConvList(); }
    if (page === 'subjects') updateSubjPage();
    if (page === 'dashboard') refreshDashboardActivity();
    if (page === 'media') renderMediaPage();
}

/* ─────────────────────────────────────────
   SYNC HELPERS
───────────────────────────────────────── */
function syncResultPage() {
    const resultPage = document.getElementById('page-result');
    if (!resultPage) return;
    const classSelects = resultPage.querySelectorAll('select[data-role="class-select"]');
    classSelects.forEach(sel => {
        const prev = sel.value;
        sel.innerHTML = CLASSES.length
            ? CLASSES.map(c => `<option value="${c.id}">${c.label}</option>`).join('')
            : '<option value="">— No classes yet —</option>';
        if ([...sel.options].some(o => o.value === prev)) sel.value = prev;
        sel.onchange = function () { cascadeSubjectSelect(this); };
        cascadeSubjectSelect(sel);
    });
}
function cascadeSubjectSelect(classSelEl) {
    const classId = classSelEl.value;
    const cls = CLASSES.find(c => c.id === classId);
    const container = classSelEl.closest('.card') || classSelEl.parentElement;
    const subjSel = container?.querySelector('select[data-role="subject-select"]');
    if (subjSel) {
        const prev = subjSel.value;
        subjSel.innerHTML = (cls && cls.subjects.length)
            ? cls.subjects.map(s => `<option value="${s}">${s}</option>`).join('')
            : '<option value="">— No subjects —</option>';
        if ([...subjSel.options].some(o => o.value === prev)) subjSel.value = prev;
    }
    const tbody = container?.querySelector('#manualResultBody');
    if (tbody && cls) buildManualTable(cls);
}
function syncAttendanceDropdowns() {
    const attClassTab = document.getElementById('att-class');
    if (attClassTab) {
        attClassTab.querySelectorAll('select[data-role="class-select"]').forEach(sel => {
            const prev = sel.value;
            sel.innerHTML = CLASSES.length
                ? CLASSES.map(c => `<option value="${c.id}">${c.label}</option>`).join('')
                : '<option value="">— No classes yet —</option>';
            if ([...sel.options].some(o => o.value === prev)) sel.value = prev;
            sel.onchange = function () { cascadeAttSubject(this); buildAttTable(); };
            cascadeAttSubject(sel);
        });
    }
    const labTab = document.getElementById('att-lab');
    if (labTab) {
        const labSel = labTab.querySelector('select[data-role="group-select"]');
        if (labSel) {
            const list = GROUPS.filter(g => g.type === 'Lab Group').length ? GROUPS.filter(g => g.type === 'Lab Group') : GROUPS;
            const prev = labSel.value;
            labSel.innerHTML = list.length
                ? list.map(g => `<option value="${g.id}">${g.name}</option>`).join('')
                : '<option value="">— No groups yet —</option>';
            if ([...labSel.options].some(o => o.value === prev)) labSel.value = prev;
        }
    }
}
function cascadeAttSubject(classSelEl) {
    const cls = CLASSES.find(c => c.id === classSelEl.value);
    const container = classSelEl.closest('.card') || classSelEl.parentElement;
    const subjSel = container?.querySelector('select[data-role="subject-select"]');
    if (subjSel) {
        subjSel.innerHTML = (cls && cls.subjects.length)
            ? cls.subjects.map(s => `<option value="${s}">${s}</option>`).join('')
            : '<option value="">— No subjects —</option>';
    }
}
function syncMessageContacts() {
    GROUPS.forEach(g => {
        if (!convData.find(c => c.groupId === g.id)) {
            convData.push({
                groupId: g.id, name: g.name,
                last: g.chat.length ? g.chat[g.chat.length - 1].text : 'No messages yet',
                time: 'Now', unread: 0, isGroup: true
            });
        }
    });
    for (let i = convData.length - 1; i >= 0; i--) {
        if (convData[i].isGroup && !GROUPS.find(g => g.id === convData[i].groupId)) convData.splice(i, 1);
    }
}
function refreshDashboardActivity() {
    const tbody = document.querySelector('#page-dashboard table tbody');
    if (!tbody) return;
    if (!GROUPS.length) {
        tbody.innerHTML = `<tr><td colspan="5" style="padding:24px;text-align:center;color:var(--text-muted);">
      No activity yet — create a class and group to get started</td></tr>`;
        return;
    }
    tbody.innerHTML = GROUPS.map(g => {
        const last = g.chat.length ? g.chat[g.chat.length - 1] : null;
        return `<tr>
      <td>${g.name}</td>
      <td>${last ? last.text.slice(0, 50) : '—'}</td>
      <td>Dr. Priya Verma</td>
      <td>${last ? last.time : '—'}</td>
      <td><button class="btn btn-outline btn-sm"
            onclick="navigate('group',document.querySelector('.nav-item[onclick*=group]'))">Open</button></td>
    </tr>`;
    }).join('');
}

/* ─────────────────────────────────────────
   CLASSES PAGE
───────────────────────────────────────── */
function renderClassesPage() {
    const pg = document.getElementById('page-classes');
    if (!pg) return;
    pg.innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">🏫 Classes</div>
        <div class="section-sub">Create classes, add subjects, and manage student groups</div>
      </div>
      <button class="btn btn-primary" onclick="openCreateClassModal()">+ Create Class</button>
    </div>
    <div class="grid-3" id="classCardsGrid"></div>
    <div id="classDetailPanel" style="display:none;margin-top:24px;">
      <div class="card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
          <div class="card-title" id="detailTitle">📋 Class Details</div>
          <button class="btn btn-outline btn-sm" onclick="closeDetail()">✕ Close</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;">
          <div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
              <div style="font-weight:700;font-size:14px;">👩‍🎓 Students (<span id="stuCount">0</span>)</div>
              <div style="display:flex;gap:6px;">
                <button class="btn btn-outline btn-sm" onclick="openAddStudentModal()">+ Add</button>
                <button class="btn btn-primary btn-sm" onclick="openCreateGroupFromClass()">👥 Group</button>
              </div>
            </div>
            <div style="max-height:340px;overflow-y:auto;">
              <table style="width:100%;border-collapse:collapse;">
                <thead><tr>
                  <th style="font-size:10px;text-transform:uppercase;color:var(--text-muted);padding:8px;border-bottom:1px solid var(--border);">
                    <input type="checkbox" id="selectAllStu" onchange="toggleAllStudents(this)" style="accent-color:var(--accent-cyan);">
                  </th>
                  <th style="font-size:10px;text-transform:uppercase;color:var(--text-muted);padding:8px;border-bottom:1px solid var(--border);text-align:left;">Roll</th>
                  <th style="font-size:10px;text-transform:uppercase;color:var(--text-muted);padding:8px;border-bottom:1px solid var(--border);text-align:left;">Name</th>
                  <th style="font-size:10px;text-transform:uppercase;color:var(--text-muted);padding:8px;border-bottom:1px solid var(--border);text-align:left;">Email</th>
                  <th style="border-bottom:1px solid var(--border);"></th>
                </tr></thead>
                <tbody id="stuTableBody"></tbody>
              </table>
            </div>
            <div id="selectionActions" style="display:none;margin-top:10px;padding:10px;background:var(--bg-secondary);border-radius:10px;align-items:center;gap:10px;">
              <span id="selCount" style="font-size:13px;color:var(--accent-cyan);font-weight:600;"></span>
              <button class="btn btn-primary btn-sm" onclick="createGroupFromSelected()">👥 Group Selected</button>
              <button class="btn btn-outline btn-sm" onclick="clearSelection()">Clear</button>
            </div>
          </div>
          <div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
              <div style="font-weight:700;font-size:14px;">📚 Subjects (<span id="subjCount">0</span>)</div>
              <button class="btn btn-outline btn-sm" onclick="openAddSubjectModal()">+ Add</button>
            </div>
            <div id="subjListWrap" style="max-height:340px;overflow-y:auto;"></div>
          </div>
          <div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
              <div style="font-weight:700;font-size:14px;">👥 Groups (<span id="grpCount">0</span>)</div>
            </div>
            <div id="classGroupList" style="max-height:300px;overflow-y:auto;"></div>
            <button class="btn btn-outline btn-sm" style="margin-top:10px;width:100%;"
                    onclick="openCreateGroupFromClass()">+ Create Group</button>
          </div>
        </div>
      </div>
    </div>`;
    renderClassCards();
}

function renderClassCards() {
    const grid = document.getElementById('classCardsGrid');
    if (!grid) return;
    const colors = ['#00d4ff', '#a855f7', '#f97316', '#10b981', '#ec4899', '#f59e0b', '#14b8a6', '#06b6d4'];
    if (!CLASSES.length) {
        grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:var(--text-muted);">
        <div style="font-size:56px;margin-bottom:16px;">🏫</div>
        <div style="font-size:18px;font-weight:700;margin-bottom:8px;color:var(--text-primary);">No Classes Yet</div>
        <div style="font-size:13px;max-width:340px;margin:0 auto 24px;line-height:1.6;">
          Click <strong style="color:var(--accent-cyan);">+ Create Class</strong> to add your first class.
        </div>
        <button class="btn btn-primary" onclick="openCreateClassModal()">+ Create Your First Class</button>
      </div>`;
        return;
    }
    grid.innerHTML = CLASSES.map((cls, i) => {
        const col = colors[i % colors.length];
        const grpCount = GROUPS.filter(g => g.classId === cls.id).length;
        return `
    <div class="card" style="cursor:pointer;border-top:3px solid ${col};transition:.2s;"
         onclick="openClassDetail('${cls.id}')"
         onmouseover="this.style.transform='translateY(-3px)'"
         onmouseout="this.style.transform=''">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px;">
        <div>
          <div style="font-size:18px;font-weight:800;color:${col};font-family:'Rajdhani',sans-serif;">${cls.key}</div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">${cls.dept}${cls.section ? ' · Sec ' + cls.section : ''}</div>
        </div>
        <div style="background:${col}22;border:1px solid ${col}44;border-radius:8px;padding:3px 9px;font-size:10px;font-weight:700;color:${col};max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${cls.year}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;">
        <div style="text-align:center;background:var(--bg-secondary);border-radius:8px;padding:8px;">
          <div style="font-size:18px;font-weight:800;color:${col};">${cls.students.length}</div>
          <div style="font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;">Students</div>
        </div>
        <div style="text-align:center;background:var(--bg-secondary);border-radius:8px;padding:8px;">
          <div style="font-size:18px;font-weight:800;color:${col};">${cls.subjects.length}</div>
          <div style="font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;">Subjects</div>
        </div>
        <div style="text-align:center;background:var(--bg-secondary);border-radius:8px;padding:8px;">
          <div style="font-size:18px;font-weight:800;color:${col};">${grpCount}</div>
          <div style="font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;">Groups</div>
        </div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:12px;min-height:18px;">
        ${cls.subjects.length ? '📚 ' + cls.subjects.slice(0, 2).join(' · ') + (cls.subjects.length > 2 ? ` +${cls.subjects.length - 2} more` : '') : '<em>No subjects added yet</em>'}
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-primary btn-sm" style="flex:1;" onclick="event.stopPropagation();openClassDetail('${cls.id}')">👁 View</button>
        <button class="btn btn-outline btn-sm" style="flex:1;" onclick="event.stopPropagation();quickCreateGroupAll('${cls.id}')">👥 Group All</button>
        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();confirmDeleteClass('${cls.id}')" style="color:var(--accent-red);border-color:var(--accent-red);">🗑</button>
      </div>
    </div>`;
    }).join('');
}

/* ─────────────────────────────────────────
   CLASS DETAIL
───────────────────────────────────────── */
function openClassDetail(id) {
    activeClassId = id;
    const cls = CLASSES.find(c => c.id === id);
    if (!cls) return;
    const panel = document.getElementById('classDetailPanel');
    panel.style.display = 'block';
    document.getElementById('detailTitle').textContent = `📋 ${cls.label}`;
    panel.scrollIntoView({ behavior: 'smooth' });
    renderStudentTable(cls);
    renderSubjectList(cls);
    renderClassGroups(cls);
}
function closeDetail() { document.getElementById('classDetailPanel').style.display = 'none'; activeClassId = null; }

function renderStudentTable(cls) {
    const cnt = document.getElementById('stuCount');
    if (cnt) cnt.textContent = cls.students.length;
    const tbody = document.getElementById('stuTableBody');
    if (!tbody) return;
    if (!cls.students.length) {
        tbody.innerHTML = `<tr><td colspan="5" style="padding:20px;text-align:center;color:var(--text-muted);">No students yet — click "+ Add"</td></tr>`;
        return;
    }
    tbody.innerHTML = cls.students.map(s => `
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:7px;"><input type="checkbox" class="stu-check" value="${s.roll}" onchange="updateSelectionActions()" style="accent-color:var(--accent-cyan);"></td>
      <td style="padding:7px;font-size:12px;font-family:'Rajdhani',sans-serif;font-weight:600;">${s.roll}</td>
      <td style="padding:7px;font-size:13px;">${s.name}</td>
      <td style="padding:7px;font-size:11px;color:var(--text-secondary);">${s.email}</td>
      <td style="padding:7px;">
        <button class="btn btn-outline btn-sm" onclick="removeStudent('${cls.id}','${s.roll}')"
                style="color:var(--accent-red);border-color:var(--accent-red);padding:2px 7px;font-size:10px;">✕</button>
      </td>
    </tr>`).join('');
    updateSelectionActions();
}

function renderSubjectList(cls) {
    const el = document.getElementById('subjListWrap');
    const cnt = document.getElementById('subjCount');
    if (!el) return;
    if (cnt) cnt.textContent = cls.subjects.length;
    if (!cls.subjects.length) {
        el.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-muted);font-size:13px;border:1px dashed var(--border);border-radius:10px;">No subjects yet<br><span style="font-size:11px;">Click "+ Add" to add subjects</span></div>`;
        return;
    }
    el.innerHTML = cls.subjects.map((subj, i) => `
    <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--border);
                border-radius:10px;margin-bottom:6px;background:var(--bg-secondary);transition:.15s;"
         onmouseover="this.style.borderColor='var(--accent-cyan)'" onmouseout="this.style.borderColor='var(--border)'">
      <div style="width:24px;height:24px;border-radius:6px;background:linear-gradient(135deg,var(--accent-cyan),var(--accent-teal));display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff;font-weight:700;flex-shrink:0;">${i + 1}</div>
      <span style="flex:1;font-size:13px;font-weight:500;">${subj}</span>
      <button class="btn btn-outline btn-sm" onclick="editSubject('${cls.id}',${i})" style="padding:2px 7px;font-size:10px;">✏️</button>
      <button class="btn btn-outline btn-sm" onclick="deleteSubject('${cls.id}',${i})" style="color:var(--accent-red);border-color:var(--accent-red);padding:2px 7px;font-size:10px;">🗑</button>
    </div>`).join('');
}

function openAddSubjectModal() {
    const cls = CLASSES.find(c => c.id === activeClassId);
    if (!cls) return;
    document.getElementById('addSubjectModal')?.remove();
    const m = document.createElement('div');
    m.className = 'modal-overlay open'; m.id = 'addSubjectModal';
    m.innerHTML = `
    <div class="modal" style="width:440px;max-width:95vw;">
      <div class="modal-title">📚 Add Subject — ${cls.key}</div>
      <div class="form-group">
        <label class="form-label">Subject Name</label>
        <input class="form-input" id="subj-inp" placeholder="e.g. Data Structures & Algorithms"
               onkeydown="if(event.key==='Enter')submitAddSubject('${cls.id}')">
      </div>
      <div style="background:var(--bg-secondary);border-radius:10px;padding:12px;margin-bottom:16px;">
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Quick Add</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px;">
          ${['Mathematics', 'Physics', 'Chemistry', 'English', 'Data Structures', 'Operating Systems', 'DBMS', 'Computer Networks', 'Software Engineering', 'Python', 'Java', 'AI & ML', 'Statistics', 'Economics', 'Digital Electronics']
            .filter(s => !cls.subjects.includes(s))
            .map(s => `<button class="btn btn-outline btn-sm" style="font-size:10px;padding:2px 8px;" onclick="document.getElementById('subj-inp').value='${s}'">${s}</button>`).join('')}
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="document.getElementById('addSubjectModal').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="submitAddSubject('${cls.id}')">+ Add Subject</button>
      </div>
    </div>`;
    document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target === m) m.remove(); });
    setTimeout(() => document.getElementById('subj-inp')?.focus(), 60);
}

function submitAddSubject(classId) {
    const cls = CLASSES.find(c => c.id === classId);
    const name = document.getElementById('subj-inp')?.value.trim();
    if (!name) { showToast('⚠️ Enter a subject name.'); return; }
    if (cls.subjects.includes(name)) { showToast('⚠️ Subject already exists.'); return; }
    cls.subjects.push(name);
    saveClasses();
    document.getElementById('addSubjectModal')?.remove();
    renderSubjectList(cls); renderClassCards(); syncResultPage(); syncAttendanceDropdowns();
    showToast(`✅ Subject "${name}" added`);
}
function editSubject(classId, idx) {
    const cls = CLASSES.find(c => c.id === classId);
    const curr = cls.subjects[idx];
    const n = prompt('Edit subject name:', curr);
    if (!n || n.trim() === curr) return;
    if (cls.subjects.includes(n.trim())) { showToast('⚠️ Already exists.'); return; }
    cls.subjects[idx] = n.trim(); saveClasses();
    renderSubjectList(cls); renderClassCards(); syncResultPage(); syncAttendanceDropdowns();
    showToast(`✅ Renamed to "${n.trim()}"`);
}
function deleteSubject(classId, idx) {
    const cls = CLASSES.find(c => c.id === classId);
    const name = cls.subjects[idx];
    if (!confirm(`Delete subject "${name}" from ${cls.key}?`)) return;
    cls.subjects.splice(idx, 1); saveClasses();
    renderSubjectList(cls); renderClassCards(); syncResultPage(); syncAttendanceDropdowns();
    showToast(`🗑 "${name}" removed`);
}

function renderClassGroups(cls) {
    const el = document.getElementById('classGroupList');
    const cnt = document.getElementById('grpCount');
    if (!el) return;
    const grps = GROUPS.filter(g => g.classId === cls.id);
    if (cnt) cnt.textContent = grps.length;
    if (!grps.length) {
        el.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:13px;border:1px dashed var(--border);border-radius:10px;">No groups yet</div>`;
        return;
    }
    el.innerHTML = grps.map(g => `
    <div style="display:flex;align-items:center;gap:8px;padding:9px;border:1px solid var(--border);border-radius:10px;margin-bottom:7px;background:var(--bg-secondary);">
      <div style="width:34px;height:34px;border-radius:8px;background:${g.gradient};display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;">${g.icon}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${g.name}</div>
        <div style="font-size:10px;color:var(--text-secondary);">${g.memberRolls.length} members · ${g.type}</div>
      </div>
      <div style="display:flex;gap:5px;">
        <button class="btn btn-primary btn-sm" style="padding:3px 8px;font-size:11px;" onclick="openGroupChatById('${g.id}');navigate('group',null)">💬</button>
        <button class="btn btn-outline btn-sm" style="padding:3px 8px;font-size:11px;color:var(--accent-red);border-color:var(--accent-red);" onclick="confirmDeleteGroup('${g.id}')">🗑</button>
      </div>
    </div>`).join('');
}

function toggleAllStudents(cb) { document.querySelectorAll('.stu-check').forEach(c => c.checked = cb.checked); updateSelectionActions(); }
function updateSelectionActions() {
    const checked = document.querySelectorAll('.stu-check:checked');
    const bar = document.getElementById('selectionActions'), cnt = document.getElementById('selCount');
    if (!bar || !cnt) return;
    if (checked.length > 0) { bar.style.display = 'flex'; cnt.textContent = `${checked.length} student${checked.length > 1 ? 's' : ''} selected`; }
    else bar.style.display = 'none';
}
function clearSelection() {
    document.querySelectorAll('.stu-check').forEach(c => c.checked = false);
    const all = document.getElementById('selectAllStu'); if (all) all.checked = false;
    updateSelectionActions();
}

/* ─────────────────────────────────────────
   CREATE CLASS MODAL
───────────────────────────────────────── */
function openCreateClassModal() {
    document.getElementById('createClassModal')?.remove();
    pendingStudents = []; pendingSubjectsArr = [];
    const m = document.createElement('div');
    m.className = 'modal-overlay open'; m.id = 'createClassModal';
    m.innerHTML = `
    <div class="modal" style="width:540px;max-width:95vw;max-height:90vh;overflow-y:auto;">
      <div class="modal-title">🏫 Create New Class</div>
      <div class="form-group">
        <label class="form-label">Department <span style="color:var(--accent-red);">*</span></label>
        <input class="form-input" id="cls-dept" placeholder="Type your department e.g. Computer Science, MCA, Electronics..." onkeyup="autoGenerateKey()" autocomplete="off">
        <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Enter the full department name — the key will be auto-generated from this.</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        <div class="form-group">
          <label class="form-label">Year <span style="color:var(--accent-red);">*</span></label>
          <select class="form-select" id="cls-year" onchange="autoGenerateKey()">
            <option value="">— Select Year —</option>
            <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Section <span style="font-size:11px;font-weight:400;color:var(--text-muted);">(optional)</span></label>
          <select class="form-select" id="cls-section" onchange="autoGenerateKey()">
            <option value="">— None —</option><option>A</option><option>B</option><option>C</option><option>D</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Class Key <span style="font-size:11px;font-weight:400;color:var(--text-muted);">(auto-generated, editable)</span></label>
        <input class="form-input" id="cls-key" placeholder="Will auto-fill from Department + Year + Section" style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:15px;color:var(--accent-cyan);letter-spacing:.5px;">
      </div>
      <div class="form-group">
        <label class="form-label">Subjects <span style="font-size:11px;font-weight:400;color:var(--text-muted);">(add now or later)</span></label>
        <div style="display:flex;gap:8px;margin-bottom:8px;">
          <input class="form-input" id="cls-subj-inp" placeholder="Type a subject name..." style="flex:1;" onkeydown="if(event.key==='Enter'){event.preventDefault();addSubjectToForm()}">
          <button class="btn btn-outline btn-sm" onclick="addSubjectToForm()">+ Add</button>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;">
          ${['Mathematics', 'Physics', 'Data Structures', 'OS', 'DBMS', 'Computer Networks', 'Software Engineering', 'Python', 'Java', 'AI & ML', 'Statistics', 'English', 'Chemistry', 'EVS']
            .map(s => `<button class="btn btn-outline btn-sm" style="font-size:10px;padding:2px 8px;" onclick="quickAddSubjectToForm('${s}')">${s}</button>`).join('')}
        </div>
        <div id="formSubjTags" style="display:flex;flex-wrap:wrap;gap:6px;min-height:38px;padding:8px;background:var(--bg-secondary);border-radius:8px;border:1px solid var(--border);align-items:center;">
          <span style="font-size:11px;color:var(--text-muted);" id="noSubjHint">No subjects added yet</span>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Students <span style="font-size:11px;font-weight:400;color:var(--text-muted);">(optional — can add later)</span></label>
        <div style="display:flex;gap:6px;margin-bottom:8px;">
          <input class="form-input" id="stu-name-inp" placeholder="Full Name" style="flex:2;">
          <input class="form-input" id="stu-roll-inp" placeholder="Roll No" style="flex:1;">
          <input class="form-input" id="stu-email-inp" placeholder="Email" style="flex:2;">
          <button class="btn btn-outline btn-sm" onclick="addStudentToForm()">+ Add</button>
        </div>
        <div id="stuPreviewList" style="max-height:130px;overflow-y:auto;"></div>
      </div>
      <div class="form-group">
        <label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
          <input type="checkbox" id="autoCreateGroup" checked style="width:15px;height:15px;accent-color:var(--accent-cyan);">
          <span>Auto-create a General group for all students in this class</span>
        </label>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="document.getElementById('createClassModal').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="submitCreateClass()">🏫 Create Class</button>
      </div>
    </div>`;
    document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target === m) m.remove(); });
    setTimeout(() => document.getElementById('cls-dept')?.focus(), 60);
}

let pendingStudents = [], pendingSubjectsArr = [];

function autoGenerateKey() {
    const dept = document.getElementById('cls-dept')?.value.trim() || '';
    const year = document.getElementById('cls-year')?.value || '';
    const section = document.getElementById('cls-section')?.value || '';
    if (!dept || !year) { const el = document.getElementById('cls-key'); if (el) el.value = ''; return; }
    const abbr = dept.split(/\s+/).filter(Boolean).map(w => w[0].toUpperCase()).join('').slice(0, 4);
    const yearNum = year.replace(/[^0-9]/g, '');
    const el = document.getElementById('cls-key');
    if (el) el.value = `${abbr}-${yearNum}${section}`;
}
function quickAddSubjectToForm(name) { if (pendingSubjectsArr.includes(name)) { showToast('⚠️ Already added.'); return; } pendingSubjectsArr.push(name); renderFormSubjTags(); }
function addSubjectToForm() {
    const inp = document.getElementById('cls-subj-inp'), name = inp?.value.trim();
    if (!name) return;
    if (pendingSubjectsArr.includes(name)) { showToast('⚠️ Already added.'); return; }
    pendingSubjectsArr.push(name); renderFormSubjTags(); if (inp) inp.value = '';
}
function renderFormSubjTags() {
    const el = document.getElementById('formSubjTags'), hint = document.getElementById('noSubjHint');
    if (!el) return;
    if (hint) hint.style.display = pendingSubjectsArr.length ? 'none' : 'inline';
    el.querySelectorAll('.subj-tag').forEach(t => t.remove());
    pendingSubjectsArr.forEach((s, i) => {
        const div = document.createElement('div'); div.className = 'subj-tag';
        div.style.cssText = 'display:flex;align-items:center;gap:5px;background:var(--accent-cyan)18;border:1px solid var(--accent-cyan)44;border-radius:20px;padding:3px 10px;';
        div.innerHTML = `<span style="font-size:12px;color:var(--accent-cyan);font-weight:600;">${s}</span>
      <button onclick="removePendingSubj(${i})" style="background:none;border:none;color:var(--accent-red);cursor:pointer;font-size:12px;line-height:1;padding:0;">✕</button>`;
        el.appendChild(div);
    });
}
function removePendingSubj(i) { pendingSubjectsArr.splice(i, 1); renderFormSubjTags(); }
function addStudentToForm() {
    const name = document.getElementById('stu-name-inp')?.value.trim(), roll = document.getElementById('stu-roll-inp')?.value.trim(), email = document.getElementById('stu-email-inp')?.value.trim();
    if (!name || !roll) { showToast('⚠️ Name and Roll are required.'); return; }
    if (pendingStudents.find(s => s.roll === roll)) { showToast('⚠️ Roll already added.'); return; }
    pendingStudents.push({ name, roll, email: email || roll + '@college.edu' });
    renderPendingStudents();
    ['stu-name-inp', 'stu-roll-inp', 'stu-email-inp'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    document.getElementById('stu-name-inp')?.focus();
}
function renderPendingStudents() {
    const el = document.getElementById('stuPreviewList'); if (!el) return;
    if (!pendingStudents.length) { el.innerHTML = ''; return; }
    el.innerHTML = `<table style="width:100%;border-collapse:collapse;font-size:12px;">
    <tr style="border-bottom:1px solid var(--border);">
      <th style="padding:5px;text-align:left;color:var(--text-muted);">Roll</th>
      <th style="padding:5px;text-align:left;color:var(--text-muted);">Name</th>
      <th style="padding:5px;text-align:left;color:var(--text-muted);">Email</th><th></th>
    </tr>
    ${pendingStudents.map((s, i) => `
      <tr style="border-bottom:1px solid var(--border);">
        <td style="padding:5px;">${s.roll}</td><td style="padding:5px;">${s.name}</td>
        <td style="padding:5px;color:var(--text-secondary);">${s.email}</td>
        <td style="padding:5px;"><button onclick="removePendingStu(${i})" style="background:none;border:none;color:var(--accent-red);cursor:pointer;">✕</button></td>
      </tr>`).join('')}
  </table>`;
}
function removePendingStu(i) { pendingStudents.splice(i, 1); renderPendingStudents(); }

function submitCreateClass() {
    const dept = document.getElementById('cls-dept')?.value.trim(), year = document.getElementById('cls-year')?.value, section = document.getElementById('cls-section')?.value || '', key = document.getElementById('cls-key')?.value.trim(), auto = document.getElementById('autoCreateGroup')?.checked;
    if (!dept) { showToast('⚠️ Department name is required.'); document.getElementById('cls-dept')?.focus(); return; }
    if (!year) { showToast('⚠️ Please select a year.'); return; }
    if (!key) { showToast('⚠️ Class key is missing — fill Department and Year first.'); return; }
    if (CLASSES.find(c => c.key === key)) { showToast(`⚠️ Class "${key}" already exists.`); return; }
    const label = `${dept} — ${year}${section ? ' · Sec ' + section : ''}`;
    const newClass = { id: 'cls' + (nextClassId++), key, label, dept, year, section, subjects: [...pendingSubjectsArr], students: [...pendingStudents], createdAt: new Date().toISOString() };
    CLASSES.push(newClass); saveClasses();
    if (auto && newClass.students.length) createGroupForClass(newClass, null, 'General');
    document.getElementById('createClassModal')?.remove();
    pendingStudents = []; pendingSubjectsArr = [];
    renderClassesPage(); syncResultPage(); syncAttendanceDropdowns(); syncMessageContacts(); refreshDashboardActivity();
    showToast(`✅ Class "${key}" created!${auto && newClass.students.length ? ' + auto-group' : ''}`);
}

/* ─────────────────────────────────────────
   GROUP CREATION
───────────────────────────────────────── */
function quickCreateGroupAll(classId) {
    const cls = CLASSES.find(c => c.id === classId);
    if (!cls) return;
    if (!cls.students.length) { showToast('⚠️ Add students first, then create a group.'); return; }
    openGroupNameModal(cls, null);
}
function createGroupFromSelected() {
    const cls = CLASSES.find(c => c.id === activeClassId); if (!cls) return;
    const rolls = [...document.querySelectorAll('.stu-check:checked')].map(c => c.value);
    if (!rolls.length) { showToast('⚠️ Select at least one student.'); return; }
    openGroupNameModal(cls, rolls);
}
function openCreateGroupFromClass() {
    const cls = CLASSES.find(c => c.id === activeClassId); if (!cls) { showToast('⚠️ Open a class first.'); return; }
    openGroupNameModal(cls, null);
}
function openGroupNameModal(cls, selectedRolls) {
    document.getElementById('groupNameModal')?.remove();
    const isSelected = selectedRolls && selectedRolls.length > 0;
    const m = document.createElement('div');
    m.className = 'modal-overlay open'; m.id = 'groupNameModal';
    m.innerHTML = `
    <div class="modal" style="width:460px;max-width:95vw;">
      <div class="modal-title">👥 Create Group — ${cls.key}</div>
      <div class="form-group">
        <label class="form-label">Group Name <span style="color:var(--accent-red);">*</span></label>
        <input class="form-input" id="gn-name" value="${cls.key} ${isSelected ? 'Selected' : 'General'}" placeholder="e.g. ${cls.key} Lab Batch A">
      </div>
      <div class="form-group">
        <label class="form-label">Group Type</label>
        <select class="form-select" id="gn-type">
          <option>General</option><option>Lab Group</option><option>Project Group</option><option>Study Group</option><option>Special Group</option>
        </select>
      </div>
      <div class="form-group" style="background:var(--bg-secondary);border-radius:10px;padding:14px;">
        <label class="form-label" style="margin-bottom:10px;">👩‍🎓 Students to include</label>
        ${isSelected
            ? `<div style="color:var(--accent-cyan);font-size:13px;font-weight:600;">✅ ${selectedRolls.length} student${selectedRolls.length > 1 ? 's' : ''} selected</div>
             <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">${selectedRolls.map(r => cls.students.find(s => s.roll === r)?.name || r).join(', ')}</div>`
            : `<div style="display:flex;flex-direction:column;gap:8px;">
               <label style="display:flex;align-items:center;gap:8px;cursor:pointer;"><input type="radio" name="who" value="all" checked style="accent-color:var(--accent-cyan);"><span style="font-size:13px;">All students (${cls.students.length})</span></label>
               <label style="display:flex;align-items:center;gap:8px;cursor:pointer;"><input type="radio" name="who" value="pick" style="accent-color:var(--accent-cyan);" onchange="document.getElementById('pickWrap').style.display='block'"><span style="font-size:13px;">Pick specific students</span></label>
               <div id="pickWrap" style="display:none;padding:10px;background:var(--bg-secondary);border-radius:8px;max-height:160px;overflow-y:auto;border:1px solid var(--border);">
                 ${cls.students.length ? cls.students.map(s => `<label style="display:flex;align-items:center;gap:8px;padding:4px 0;cursor:pointer;"><input type="checkbox" class="gn-pick" value="${s.roll}" style="accent-color:var(--accent-cyan);"><span style="font-size:13px;">${s.roll} — ${s.name}</span></label>`).join('') : '<span style="font-size:12px;color:var(--text-muted);">No students in class yet</span>'}
               </div>
             </div>`}
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="document.getElementById('groupNameModal').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="submitGroupFromModal('${cls.id}','${isSelected ? selectedRolls.join('|') : ''}')">👥 Create Group</button>
      </div>
    </div>`;
    document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target === m) m.remove(); });
}

function submitGroupFromModal(classId, preRaw) {
    const cls = CLASSES.find(c => c.id === classId); if (!cls) return;
    const name = document.getElementById('gn-name')?.value.trim();
    const type = document.getElementById('gn-type')?.value || 'General';
    if (!name) { showToast('⚠️ Enter a group name.'); return; }
    let rolls;
    if (preRaw) { rolls = preRaw.split('|').filter(Boolean); }
    else {
        const who = document.querySelector('input[name="who"]:checked')?.value;
        if (who === 'all') { rolls = cls.students.map(s => s.roll); if (!rolls.length) { showToast('⚠️ No students in class yet.'); return; } }
        else { rolls = [...document.querySelectorAll('.gn-pick:checked')].map(c => c.value); if (!rolls.length) { showToast('⚠️ Select at least one student.'); return; } }
    }
    createGroupForClass(cls, rolls, type, name);
    document.getElementById('groupNameModal')?.remove();
    clearSelection();
    if (activeClassId === classId) { const c2 = CLASSES.find(c => c.id === classId); renderStudentTable(c2); renderClassGroups(c2); renderClassCards(); }
    renderGroupCards(); syncAttendanceDropdowns(); syncMessageContacts(); buildConvList(); refreshDashboardActivity();
    showToast(`✅ Group "${name}" created (${rolls.length} student${rolls.length > 1 ? 's' : ''})!`);
}

function createGroupForClass(cls, rolls, type, name) {
    if (!rolls) rolls = cls.students.map(s => s.roll);
    const grpName = name || `${cls.key} ${type}`;
    const g = { id: 'g' + (nextGroupId++), name: grpName, classId: cls.id, type: type || 'General', icon: TYPE_ICON[type] || '📚', gradient: GRADIENTS[GROUPS.length % GRADIENTS.length], allStudents: rolls.length === cls.students.length, memberRolls: [...rolls], lastMsg: 'Group created · Just now', chat: [{ from: 'Dr. Priya Verma', text: `Group "${grpName}" created. Welcome!`, time: 'Just now', sent: true }], createdAt: new Date().toISOString() };
    GROUPS.push(g); saveGroups(); return g;
}

/* ─────────────────────────────────────────
   ADD STUDENT
───────────────────────────────────────── */
function openAddStudentModal() {
    const cls = CLASSES.find(c => c.id === activeClassId); if (!cls) return;
    document.getElementById('addStudentModal')?.remove();
    const m = document.createElement('div'); m.className = 'modal-overlay open'; m.id = 'addStudentModal';
    m.innerHTML = `
    <div class="modal" style="width:440px;max-width:95vw;">
      <div class="modal-title">➕ Add Student — ${cls.key}</div>
      <div class="form-group"><label class="form-label">Full Name <span style="color:var(--accent-red);">*</span></label><input class="form-input" id="as-name" placeholder="e.g. Rahul Sharma"></div>
      <div class="form-group"><label class="form-label">Roll Number <span style="color:var(--accent-red);">*</span></label><input class="form-input" id="as-roll" placeholder="e.g. 2201009"></div>
      <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="as-email" type="email" placeholder="student@college.edu"></div>
      <div class="form-group" style="background:var(--bg-secondary);border-radius:10px;padding:12px;">
        <label class="form-label" style="margin-bottom:8px;">Also add to groups</label>
        ${GROUPS.filter(g => g.classId === cls.id).map(g => `<label style="display:flex;align-items:center;gap:8px;margin-bottom:6px;cursor:pointer;"><input type="checkbox" class="add-to-grp" value="${g.id}" style="accent-color:var(--accent-cyan);"><span style="font-size:13px;">${g.icon} ${g.name}</span></label>`).join('') || '<span style="font-size:12px;color:var(--text-muted);">No groups yet</span>'}
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="document.getElementById('addStudentModal').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="submitAddStudent('${cls.id}')">+ Add Student</button>
      </div>
    </div>`;
    document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target === m) m.remove(); });
    setTimeout(() => document.getElementById('as-name')?.focus(), 60);
}

function submitAddStudent(classId) {
    const cls = CLASSES.find(c => c.id === classId), name = document.getElementById('as-name')?.value.trim(), roll = document.getElementById('as-roll')?.value.trim(), email = document.getElementById('as-email')?.value.trim();
    if (!name || !roll) { showToast('⚠️ Name and Roll are required.'); return; }
    if (cls.students.find(s => s.roll === roll)) { showToast('⚠️ Roll already exists.'); return; }
    const stu = { name, roll, email: email || roll + '@college.edu' };
    cls.students.push(stu);
    const grpIds = [...document.querySelectorAll('.add-to-grp:checked')].map(c => c.value);
    grpIds.forEach(gid => { const g = GROUPS.find(x => x.id === gid); if (g && !g.memberRolls.includes(roll)) g.memberRolls.push(roll); });
    saveClasses(); saveGroups();
    document.getElementById('addStudentModal')?.remove();
    renderStudentTable(cls); renderClassGroups(cls); renderClassCards();
    showToast(`✅ ${name} added to ${cls.key}${grpIds.length ? ' & ' + grpIds.length + ' group(s)' : ''}`);
}
function removeStudent(classId, roll) {
    const cls = CLASSES.find(c => c.id === classId); if (!cls) return;
    const stu = cls.students.find(s => s.roll === roll);
    if (!confirm(`Remove ${stu?.name} from ${cls.key}?`)) return;
    cls.students = cls.students.filter(s => s.roll !== roll);
    GROUPS.filter(g => g.classId === classId).forEach(g => { g.memberRolls = g.memberRolls.filter(r => r !== roll); });
    saveClasses(); saveGroups();
    renderStudentTable(cls); renderClassCards();
    showToast('✅ Student removed.');
}

/* ─────────────────────────────────────────
   DELETE
───────────────────────────────────────── */
function confirmDeleteClass(id) {
    const cls = CLASSES.find(c => c.id === id);
    if (!cls || !confirm(`Delete class "${cls.key}" and ALL its groups?\nThis cannot be undone.`)) return;
    CLASSES = CLASSES.filter(c => c.id !== id); GROUPS = GROUPS.filter(g => g.classId !== id);
    saveClasses(); saveGroups();
    for (let i = convData.length - 1; i >= 0; i--) { if (convData[i].isGroup && !GROUPS.find(g => g.id === convData[i].groupId)) convData.splice(i, 1); }
    closeDetail(); renderClassesPage(); syncResultPage(); syncAttendanceDropdowns();
    showToast(`🗑 Class "${cls.key}" deleted.`);
}
function confirmDeleteGroup(id) {
    const g = GROUPS.find(x => x.id === id);
    if (!g || !confirm(`Delete group "${g.name}"?`)) return;
    GROUPS = GROUPS.filter(x => x.id !== id); saveGroups();
    for (let i = convData.length - 1; i >= 0; i--) { if (convData[i].groupId === id) convData.splice(i, 1); }
    const cls = CLASSES.find(c => c.id === g.classId);
    if (cls && activeClassId === g.classId) renderClassGroups(cls);
    renderGroupCards(); syncAttendanceDropdowns();
    showToast(`🗑 Group "${g.name}" deleted.`);
}

/* ─────────────────────────────────────────
   MY GROUPS PAGE
───────────────────────────────────────── */
function renderGroupCards() {
    const container = document.querySelector('#page-group .grid-3'); if (!container) return;
    if (!GROUPS.length) {
        container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:var(--text-muted);">
      <div style="font-size:56px;margin-bottom:16px;">👥</div>
      <div style="font-size:18px;font-weight:700;margin-bottom:8px;color:var(--text-primary);">No Groups Yet</div>
      <div style="font-size:13px;max-width:320px;margin:0 auto 20px;line-height:1.6;">Go to <strong style="color:var(--accent-cyan);">Classes</strong>, create a class, add students, then create a group from there.</div>
      <button class="btn btn-primary" onclick="navigate('classes',document.querySelector('.nav-item[onclick*=classes]'))">Go to Classes</button>
    </div>`;
        return;
    }
    container.innerHTML = GROUPS.map(g => {
        const cls = CLASSES.find(c => c.id === g.classId);
        return `
    <div class="card" style="cursor:pointer;transition:.2s;"
         onmouseover="this.style.borderColor='var(--accent-cyan)'" onmouseout="this.style.borderColor='var(--border)'"
         onclick="openGroupChatById('${g.id}')">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
        <div style="width:44px;height:44px;border-radius:12px;background:${g.gradient};display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">${g.icon}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${g.name}</div>
          <div style="font-size:11px;color:var(--text-secondary);">${g.memberRolls.length} students · ${g.type}</div>
          ${cls ? `<div style="font-size:10px;color:var(--text-muted);">Class: ${cls.key}</div>` : ''}
        </div>
      </div>
      ${cls && cls.subjects.length ? `
      <div style="margin-bottom:8px;background:var(--bg-secondary);border-radius:8px;padding:7px;">
        <div style="font-size:9px;text-transform:uppercase;letter-spacing:.6px;color:var(--text-muted);margin-bottom:4px;font-weight:600;">📚 Subjects</div>
        <div style="display:flex;flex-wrap:wrap;gap:3px;">
          ${cls.subjects.slice(0, 3).map(s => `<span style="font-size:9px;background:var(--accent-cyan)18;color:var(--accent-cyan);border:1px solid var(--accent-cyan)33;border-radius:10px;padding:1px 6px;">${s}</span>`).join('')}
          ${cls.subjects.length > 3 ? `<span style="font-size:9px;color:var(--text-muted);padding:1px 3px;">+${cls.subjects.length - 3}</span>` : ''}
        </div>
      </div>`: ''}
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;background:var(--bg-secondary);border-radius:8px;padding:7px;">${g.lastMsg}</div>
      <div style="display:flex;gap:5px;flex-wrap:wrap;">
        <button class="btn btn-primary btn-sm" style="flex:1;" onclick="event.stopPropagation();openGroupChatById('${g.id}')">💬 Chat</button>
        <button class="btn btn-outline btn-sm" style="flex:1;" onclick="event.stopPropagation();broadcastToGroup('${g.id}')">📢 Broadcast</button>
        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();confirmDeleteGroup('${g.id}')" style="color:var(--accent-red);border-color:var(--accent-red);">🗑</button>
      </div>
    </div>`;
    }).join('');
    const chatArea = document.getElementById('groupChatArea');
    if (chatArea) chatArea.style.display = 'none';
}

/* ─────────────────────────────────────────
   GROUP CHAT
───────────────────────────────────────── */
function openGroupChatById(id) {
    const g = GROUPS.find(x => x.id === id); if (!g) return;
    currentGroupObj = g;
    const area = document.getElementById('groupChatArea'); if (!area) return;
    area.style.display = 'block';
    const cls = CLASSES.find(c => c.id === g.classId);
    document.getElementById('groupChatTitle').textContent = `💬 ${g.name}${cls ? ' — ' + cls.key : ''}`;
    renderGroupMsgs(g);
    area.scrollIntoView({ behavior: 'smooth' });
}
function openGroupChat(nameOrId) {
    const g = GROUPS.find(x => x.id === nameOrId || x.name === nameOrId);
    if (g) openGroupChatById(g.id);
}
function renderGroupMsgs(g) {
    const el = document.getElementById('groupMsgs'); if (!el) return;
    el.innerHTML = g.chat.map(m => `
    <div class="msg-bubble ${m.sent ? 'sent' : 'recv'}">
      ${!m.sent ? `<div style="font-size:11px;color:var(--accent-cyan);margin-bottom:4px;">${m.from}</div>` : ''}
      ${m.text.replace(/\n/g, '<br>')}<div class="msg-meta">${m.time}</div>
    </div>`).join('');
    el.scrollTop = el.scrollHeight;
}
function sendGroupMessage() {
    const inp = document.getElementById('groupInput'), txt = inp?.value.trim();
    if (!txt || !currentGroupObj) return;
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    currentGroupObj.chat.push({ from: 'Dr. Priya Verma', text: txt, time: now, sent: true });
    currentGroupObj.lastMsg = txt + ' · Just now';
    saveGroups(); renderGroupMsgs(currentGroupObj); inp.value = '';
    const c = convData.find(x => x.groupId === currentGroupObj.id);
    if (c) { c.last = txt; c.time = 'Just now'; }
}
function broadcastToGroup(id) {
    const g = GROUPS.find(x => x.id === id); if (!g) return;
    document.getElementById('broadcastTitle').textContent = `📢 Broadcast to ${g.name}`;
    document.getElementById('broadcastModal').dataset.groupId = id;
    openModal('broadcastModal');
}
function sendBroadcast() {
    const msg = document.getElementById('broadcastMsg')?.value.trim(), id = document.getElementById('broadcastModal')?.dataset.groupId, g = GROUPS.find(x => x.id === id);
    if (!msg || !g) { showToast('⚠️ Enter a message.'); return; }
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    g.chat.push({ from: 'Dr. Priya Verma', text: '📢 ' + msg, time: now, sent: true });
    g.lastMsg = '📢 ' + msg + ' · Just now'; saveGroups();
    closeModal('broadcastModal'); document.getElementById('broadcastMsg').value = '';
    showToast('✅ Broadcast sent to ' + g.name);
}

/* ─────────────────────────────────────────
   MESSAGES
───────────────────────────────────────── */
const convData = [];
const personalMsgData = {};

function buildConvList() {
    syncMessageContacts();
    const el = document.getElementById('convList'); if (!el) return;
    if (!convData.length) {
        el.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-muted);font-size:13px;">No conversations yet — create groups to start messaging</div>`;
        return;
    }
    el.innerHTML = convData.map((c, i) => {
        const isGrp = !!c.isGroup, g = isGrp ? GROUPS.find(x => x.id === c.groupId) : null;
        const grad = g?.gradient || 'linear-gradient(135deg,#00d4ff,#0891b2)';
        const ini = c.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        return `
    <div onclick="openConv(${i})" style="display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:10px;cursor:pointer;border:1px solid var(--border);margin-bottom:8px;transition:.2s;" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background=''">
      <div style="width:38px;height:38px;border-radius:${isGrp ? '10px' : '50%'};background:${grad};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:${isGrp ? '18px' : '13px'};flex-shrink:0;">${isGrp ? (g?.icon || '👥') : ini}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:13px;font-weight:600;">${c.name}${isGrp ? '<span style="font-size:10px;color:var(--accent-cyan);margin-left:4px;">GROUP</span>' : ''}</div>
        <div style="font-size:11px;color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.last}</div>
      </div>
      <div style="text-align:right;flex-shrink:0;">
        <div style="font-size:10px;color:var(--text-muted);">${c.time}</div>
        ${c.unread ? `<span class="badge badge-cyan" style="margin-top:4px;">${c.unread}</span>` : ''}
      </div>
    </div>`;
    }).join('');
}

function openConv(i) {
    currentConv = i; const c = convData[i];
    document.getElementById('msgChatTitle').innerHTML = `<span class="ci">💬</span> ${c.name}`;
    if (c.isGroup) {
        const g = GROUPS.find(x => x.id === c.groupId), el = document.getElementById('personalMsgs');
        if (el && g) { el.innerHTML = g.chat.map(m => `<div class="msg-bubble ${m.sent ? 'sent' : 'recv'}">${!m.sent ? `<div style="font-size:11px;color:var(--accent-cyan);margin-bottom:4px;">${m.from}</div>` : ''} ${m.text.replace(/\n/g, '<br>')}<div class="msg-meta">${m.time}</div></div>`).join(''); el.scrollTop = el.scrollHeight; }
        return;
    }
    if (!personalMsgData[i]) personalMsgData[i] = [{ sent: false, text: c.last, time: c.time }];
    renderPersonalMsgs(i);
}
function renderPersonalMsgs(i) {
    const el = document.getElementById('personalMsgs'); if (!el) return;
    el.innerHTML = (personalMsgData[i] || []).map(m => `<div class="msg-bubble ${m.sent ? 'sent' : 'recv'}">${m.text}<div class="msg-meta">${m.time}</div></div>`).join('');
    el.scrollTop = el.scrollHeight;
}
function sendPersonalMsg() {
    const inp = document.getElementById('personalInput'), txt = inp?.value.trim(); if (!txt) return;
    if (currentConv !== null && convData[currentConv]?.isGroup) {
        const g = GROUPS.find(x => x.id === convData[currentConv].groupId);
        if (g) { const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); g.chat.push({ from: 'Dr. Priya Verma', text: txt, time: now, sent: true }); g.lastMsg = txt + ' · Just now'; saveGroups(); convData[currentConv].last = txt; openConv(currentConv); }
        inp.value = ''; return;
    }
    if (currentConv === null) return;
    if (!personalMsgData[currentConv]) personalMsgData[currentConv] = [];
    personalMsgData[currentConv].push({ sent: true, text: txt, time: 'Just now' });
    renderPersonalMsgs(currentConv); inp.value = '';
}

/* ─────────────────────────────────────────
   ATTENDANCE
───────────────────────────────────────── */
function buildAttTable() {
    const sel = document.querySelector('#att-class select[data-role="class-select"]');
    const classId = sel?.value, cls = classId ? CLASSES.find(c => c.id === classId) : CLASSES[0], studs = cls?.students || [];
    const tbody = document.getElementById('attTableBody'), lbody = document.getElementById('labAttBody');
    if (tbody) {
        if (!CLASSES.length) tbody.innerHTML = `<tr><td colspan="6" style="padding:20px;text-align:center;color:var(--text-muted);">No classes yet — create a class first</td></tr>`;
        else if (!studs.length) tbody.innerHTML = `<tr><td colspan="6" style="padding:20px;text-align:center;color:var(--text-muted);">No students in this class</td></tr>`;
        else tbody.innerHTML = studs.map((s, i) => `<tr><td>${s.roll}</td><td>${s.name}</td><td><input type="radio" name="att_${i}" value="present" onclick="updateStatus(${i},'present')" checked></td><td><input type="radio" name="att_${i}" value="absent" onclick="updateStatus(${i},'absent')"></td><td><input type="radio" name="att_${i}" value="medical" onclick="updateStatus(${i},'medical')"></td><td><span class="badge badge-green" id="status_${i}">Present</span></td></tr>`).join('');
    }
    if (lbody) lbody.innerHTML = studs.map((s, i) => `<tr><td>${s.roll}</td><td>${s.name}</td><td>${i % 2 === 0 ? 'Batch A' : 'Batch B'}</td><td><input type="radio" name="lab_${i}" value="present" checked></td><td><input type="radio" name="lab_${i}" value="absent"></td><td><span class="badge badge-green">Present</span></td></tr>`).join('');
    buildHeatmap();
}
function updateStatus(i, val) {
    const el = document.getElementById('status_' + i); if (!el) return;
    const map = { present: ['badge-green', 'Present'], absent: ['badge-red', 'Absent'], medical: ['badge-orange', 'Medical'] };
    el.className = 'badge ' + map[val][0]; el.textContent = map[val][1];
}
function markAll(type) { document.querySelectorAll('#attTableBody tr').forEach((_, i) => { const r = document.querySelector(`input[name="att_${i}"][value="${type}"]`); if (r) { r.checked = true; updateStatus(i, type); } }); }
function buildHeatmap() {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'], grid = document.getElementById('attHeatmap'); if (!grid) return;
    let html = days.map(d => `<div class="att-day header">${d}</div>`).join('');
    for (let i = 0; i < 35; i++) { const r = Math.random(), cls = i < 2 ? 'empty' : r > .85 ? 'absent' : r > .75 ? 'medical' : 'present', lbl = i < 2 ? '' : (i - 1); html += `<div class="att-day ${cls}" title="Day ${lbl}">${lbl}</div>`; }
    grid.innerHTML = html;
}

/* ─────────────────────────────────────────
   CHARTS
───────────────────────────────────────── */
let subjectData = {};
let subjectChart, attDonutChart, cgpaLineChart, subjectBarChart;

function buildSubjectData() {
    CLASSES.forEach(cls => {
        if (!subjectData[cls.key]) subjectData[cls.key] = { labels: [...cls.subjects], data: cls.subjects.map(() => Math.floor(Math.random() * 30) + 60) };
        else {
            const sd = subjectData[cls.key];
            cls.subjects.forEach(s => { if (!sd.labels.includes(s)) { sd.labels.push(s); sd.data.push(Math.floor(Math.random() * 30) + 60); } });
            sd.labels = sd.labels.filter(l => cls.subjects.includes(l));
            sd.data = sd.labels.map((l, i) => sd.data[i] ?? Math.floor(Math.random() * 30) + 60);
        }
    });
}

function initDashboardCharts() {
    buildSubjectData();
    const firstKey = CLASSES[0]?.key, sd0 = firstKey ? (subjectData[firstKey] || { labels: [], data: [] }) : { labels: [], data: [] };
    const sctx = document.getElementById('subjectChart')?.getContext('2d');
    if (sctx) {
        subjectChart = new Chart(sctx, { type: 'bar', data: { labels: sd0.labels, datasets: [{ label: 'Avg Marks', data: sd0.data, backgroundColor: 'rgba(0,212,255,.25)', borderColor: '#00d4ff', borderWidth: 2, borderRadius: 6 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } }, x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } } } } });
        if (firstKey) buildSubjectPerfTable(firstKey);
    }
    const actx = document.getElementById('attDonut')?.getContext('2d');
    if (actx) attDonutChart = new Chart(actx, { type: 'doughnut', data: { labels: ['Present', 'Absent', 'Medical'], datasets: [{ data: [87, 9, 4], backgroundColor: ['rgba(0,212,255,.7)', 'rgba(255,71,87,.7)', 'rgba(255,123,41,.7)'], borderColor: ['#00d4ff', '#ff4757', '#ff7b29'], borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#8b949e', font: { size: 12 } } } } } });
    const lctx = document.getElementById('cgpaLine')?.getContext('2d');
    if (lctx) cgpaLineChart = new Chart(lctx, { type: 'line', data: { labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'], datasets: [{ label: 'Avg CGPA', data: [7.8, 8.1, 8.6, 8.9, 8.4], borderColor: '#00d4ff', backgroundColor: 'rgba(0,212,255,.1)', tension: .4, pointRadius: 5, pointBackgroundColor: '#00d4ff', fill: true }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 7, max: 10, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } }, x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } } } } });
    buildDashboardClassRadios();
}

function buildDashboardClassRadios() {
    const rg = document.querySelector('#page-dashboard .radio-group'); if (!rg) return;
    if (!CLASSES.length) { rg.innerHTML = '<span style="font-size:13px;color:var(--text-muted);">No classes yet — create one first.</span>'; return; }
    rg.innerHTML = CLASSES.map((cls, i) => `<div class="radio-btn"><input type="radio" name="cls" id="cls_r_${i}" value="${cls.key}" ${i === 0 ? 'checked' : ''} onchange="updateSubjectChart()"><label for="cls_r_${i}">${cls.key}</label></div>`).join('');
}
function updateSubjectChart() {
    buildSubjectData(); const cls = document.querySelector('input[name="cls"]:checked')?.value;
    if (!cls || !subjectChart) return;
    const sd = subjectData[cls] || { labels: [], data: [] };
    subjectChart.data.labels = sd.labels; subjectChart.data.datasets[0].data = sd.data; subjectChart.update();
    buildSubjectPerfTable(cls);
}
function buildSubjectPerfTable(cls) {
    buildSubjectData(); const sd = cls ? subjectData[cls] : null, el = document.getElementById('subjectPerfTable'); if (!el) return;
    if (!sd || !sd.labels.length) { el.innerHTML = '<div style="padding:20px;color:var(--text-muted);text-align:center;font-size:13px;">No subject data yet</div>'; return; }
    el.innerHTML = '<div style="padding:4px 0;">' + sd.labels.map((l, i) => {
        const pct = sd.data[i], color = pct >= 80 ? 'var(--accent-green)' : pct >= 65 ? 'var(--accent-cyan)' : 'var(--accent-red)';
        return `<div style="margin-bottom:14px;"><div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600;"><span>${l}</span><span style="color:${color}">${pct}/100</span></div><div class="subj-bar"><div class="subj-bar-fill" style="width:${pct}%;background:${color};"></div></div></div>`;
    }).join('') + '</div>';
}
function updateSubjPage() {
    buildSubjectData();
    const rg = document.querySelector('#page-subjects .radio-group');
    if (rg) { if (!CLASSES.length) rg.innerHTML = '<span style="font-size:13px;color:var(--text-muted);">No classes yet.</span>'; else rg.innerHTML = CLASSES.map((cls, i) => `<div class="radio-btn"><input type="radio" name="scls" id="scls_r_${i}" value="${cls.key}" ${i === 0 ? 'checked' : ''} onchange="updateSubjPage()"><label for="scls_r_${i}">${cls.key}</label></div>`).join(''); }
    const cls = document.querySelector('input[name="scls"]:checked')?.value || CLASSES[0]?.key;
    const el = document.getElementById('subjPageTitle'); if (el) el.textContent = cls || '—';
    initSubjectBarChart(cls); buildSubjSummary(cls);
}
function initSubjectBarChart(cls) {
    buildSubjectData(); const sd = cls ? (subjectData[cls] || { labels: [], data: [] }) : { labels: [], data: [] };
    const ctx = document.getElementById('subjectBarChart')?.getContext('2d'); if (!ctx) return;
    if (subjectBarChart) subjectBarChart.destroy();
    subjectBarChart = new Chart(ctx, { type: 'bar', data: { labels: sd.labels, datasets: [{ label: 'Avg Marks', data: sd.data, backgroundColor: 'rgba(0,212,255,.3)', borderColor: '#00d4ff', borderWidth: 2, borderRadius: 8 }, { label: 'Pass %', data: sd.data.map(v => Math.min(100, v + Math.floor(Math.random() * 10))), backgroundColor: 'rgba(57,211,83,.2)', borderColor: '#39d353', borderWidth: 2, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#8b949e' } } }, scales: { y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } }, x: { grid: { color: 'rgba(255,255,255,.05)' }, ticks: { color: '#8b949e' } } } } });
}
function buildSubjSummary(cls) {
    buildSubjectData(); const sd = cls ? subjectData[cls] : null, tbody = document.getElementById('subjSummaryBody'); if (!tbody) return;
    if (!sd || !sd.labels.length) { tbody.innerHTML = `<tr><td colspan="6" style="padding:20px;text-align:center;color:var(--text-muted);">${!CLASSES.length ? 'No classes yet' : 'No subjects for this class'}</td></tr>`; return; }
    tbody.innerHTML = sd.labels.map((l, i) => {
        const avg = sd.data[i], high = Math.min(100, avg + Math.floor(Math.random() * 15) + 5), low = Math.max(0, avg - Math.floor(Math.random() * 25) - 5), pass = Math.min(100, avg + Math.floor(Math.random() * 10)), trend = avg >= 75 ? '📈 Rising' : '📉 Dip', badge = avg >= 80 ? 'badge-green' : avg >= 65 ? 'badge-cyan' : 'badge-red';
        return `<tr><td>${l}</td><td><span class="badge ${badge}">${avg}</span></td><td>${high}</td><td>${low}</td><td>${pass}%</td><td>${trend}</td></tr>`;
    }).join('');
}

/* ─────────────────────────────────────────
   RESULT PAGE
───────────────────────────────────────── */
function buildManualTable(cls) {
    const tbody = document.getElementById('manualResultBody'); if (!tbody || !cls) return;
    if (!cls.students.length) { tbody.innerHTML = `<tr><td colspan="4" style="padding:16px;text-align:center;color:var(--text-muted);">No students in this class</td></tr>`; return; }
    tbody.innerHTML = cls.students.map(s => `<tr><td>${s.roll}</td><td>${s.name}</td><td><input class="form-input" style="width:70px;padding:4px 8px;" type="number" value="${Math.floor(Math.random() * 40) + 55}" onchange="calcGrade(this)"></td><td><span class="badge badge-green">A</span></td></tr>`).join('');
    tbody.querySelectorAll('input[type=number]').forEach(inp => calcGrade(inp));
}
function handleFileUpload(e) {
    const file = e.target.files[0]; if (!file) return;
    const el = document.getElementById('uploadedFiles'); if (!el) return;
    el.innerHTML = `<div class="file-item"><div class="file-icon">📄</div><div class="file-meta"><div class="file-name">${file.name}</div><div class="file-size">${(file.size / 1024).toFixed(1)} KB · Ready</div></div><span class="badge badge-green">Ready</span></div>`;
}
function submitResult() { showToast('✅ Results uploaded and published!'); }
function saveManualResult() { showToast('✅ Manual results saved!'); }
function addResultRow() {
    const tbody = document.getElementById('manualResultBody'); if (!tbody) return;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><input class="form-input" style="width:80px;padding:4px 8px;" placeholder="Roll No"></td><td><input class="form-input" style="width:120px;padding:4px 8px;" placeholder="Name"></td><td><input class="form-input" style="width:70px;padding:4px 8px;" type="number" value="0" onchange="calcGrade(this)"></td><td><span class="badge badge-red">F</span></td>`;
    tbody.appendChild(tr);
}
function calcGrade(inp) {
    const v = parseInt(inp.value), badge = inp.closest('tr').querySelector('.badge'); if (!badge) return;
    if (v >= 90) { badge.className = 'badge badge-green'; badge.textContent = 'O'; }
    else if (v >= 80) { badge.className = 'badge badge-green'; badge.textContent = 'A+'; }
    else if (v >= 70) { badge.className = 'badge badge-cyan'; badge.textContent = 'A'; }
    else if (v >= 60) { badge.className = 'badge badge-cyan'; badge.textContent = 'B+'; }
    else if (v >= 50) { badge.className = 'badge badge-orange'; badge.textContent = 'B'; }
    else if (v >= 40) { badge.className = 'badge badge-orange'; badge.textContent = 'C'; }
    else { badge.className = 'badge badge-red'; badge.textContent = 'F'; }
}

/* ─────────────────────────────────────────
   LEAVE
───────────────────────────────────────── */
function submitLeave() {
    const reason = document.getElementById('leaveReason')?.value.trim(), notify = document.getElementById('notifyGroups')?.checked, grpMsg = document.getElementById('leaveGroupMsg')?.value.trim();
    if (!reason) { showToast('⚠️ Please enter a reason.'); return; }
    if (notify) {
        if (!GROUPS.length) { showToast('⚠️ No groups to notify.'); return; }
        const msg = grpMsg || 'Dear students, I will be on leave. Please self-study.';
        const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        GROUPS.forEach(g => { g.chat.push({ from: 'Dr. Priya Verma', text: '🌿 Leave Notice: ' + msg, time: now, sent: true }); g.lastMsg = '🌿 Leave Notice · Just now'; });
        saveGroups(); showToast('✅ Leave applied & all groups notified!');
    } else showToast('✅ Leave application submitted!');
    if (document.getElementById('leaveReason')) document.getElementById('leaveReason').value = '';
    if (document.getElementById('leaveGroupMsg')) document.getElementById('leaveGroupMsg').value = '';
}

/* ─────────────────────────────────────────
   TABS / UTILS
───────────────────────────────────────── */
function switchTab(group, name, el) {
    const pageId = group === 'att' ? 'attendance' : group;
    document.querySelectorAll(`#page-${pageId} .tab`).forEach(t => t.classList.remove('active'));
    document.querySelectorAll(`#page-${pageId} .tab-pane`).forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    const pane = document.getElementById(group + '-' + name); if (pane) pane.classList.add('active');
    if (name === 'class' || name === 'lab') buildAttTable();
}
function openModal(id) { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
function showToast(msg) {
    const t = document.getElementById('toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3200);
}
function refreshPage() { buildDashboardClassRadios(); refreshDashboardActivity(); showToast('🔄 Refreshed!'); }
function toggleNotif() { showToast('🔔 Notifications checked!'); }
function sendAlert() { showToast('📨 Attendance alert sent!'); }
function saveAttendance() { showToast('✅ Attendance saved!'); }
function scrollToUpdate(id) { document.getElementById('updatesContainer')?.scrollTo({ top: 0, behavior: 'smooth' }); }

document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', function (e) { if (e.target === this) this.classList.remove('open'); }));

/* ─────────────────────────────────────────
   PATCH HTML
───────────────────────────────────────── */
function patchHTML() {
    document.querySelectorAll('#page-result .card').forEach(card => {
        card.querySelectorAll('.form-group').forEach(fg => {
            const lbl = fg.querySelector('.form-label')?.textContent.trim(), sel = fg.querySelector('select'); if (!sel) return;
            if (lbl === 'Select Class') sel.dataset.role = 'class-select';
            if (lbl === 'Subject') sel.dataset.role = 'subject-select';
        });
    });
    document.querySelectorAll('#att-class .form-group').forEach(fg => {
        const lbl = fg.querySelector('.form-label')?.textContent.trim(), sel = fg.querySelector('select'); if (!sel) return;
        if (lbl === 'Class') sel.dataset.role = 'class-select';
        if (lbl === 'Subject') sel.dataset.role = 'subject-select';
    });
    document.querySelectorAll('#att-lab .form-group').forEach(fg => {
        const lbl = fg.querySelector('.form-label')?.textContent.trim(), sel = fg.querySelector('select'); if (!sel) return;
        if (lbl === 'Lab Group') sel.dataset.role = 'group-select';
    });
    if (!document.getElementById('page-classes')) {
        const pg = document.createElement('div'); pg.className = 'page'; pg.id = 'page-classes';
        document.querySelector('.content')?.appendChild(pg);
    }
    if (!document.querySelector('.nav-item[onclick*="classes"]')) {
        const nav = document.querySelector('.nav-section:first-of-type');
        if (nav) {
            const item = document.createElement('div'); item.className = 'nav-item';
            item.setAttribute('onclick', "navigate('classes',this)");
            item.innerHTML = '<span class="icon">🏫</span> Classes';
            const dash = nav.querySelector('.nav-item');
            if (dash?.nextSibling) nav.insertBefore(item, dash.nextSibling); else nav.appendChild(item);
        }
    }
    injectMediaPage();
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
    syncResultPage();
    syncAttendanceDropdowns();
    syncMessageContacts();
    buildConvList();
    buildAttTable();
    refreshDashboardActivity();
};