"use strict";
// Same-origin by default. If you host the admin panel separately from the
// API, change this to the full API URL, e.g. 'https://your-api.onrender.com/api'
const API_BASE = '/api';
let TOKEN = localStorage.getItem('admin_token');
// ---------- Field configs for every list-based resource ----------
const RESOURCES = {
    education: {
        endpoint: 'education',
        title: 'Education',
        subtitle: 'Degrees, schools, and the certificates that back them up.',
        fields: [
            { name: 'degree', label: 'Degree / qualification', type: 'text', required: true },
            { name: 'institution', label: 'Institution', type: 'text', required: true },
            { name: 'duration', label: 'Duration (e.g. 2016 — 2020)', type: 'text' },
            { name: 'cgpaOrMarks', label: 'CGPA or Marks (e.g. 9.8 CGPA, 95%)', type: 'text' },
            { name: 'detail', label: 'Detail (grade, coursework, etc.)', type: 'textarea', full: true },
            { name: 'certificateUrl', label: 'Certificate', type: 'file', accept: '.pdf,image/*' },
            { name: 'icon', label: 'Icon (emoji)', type: 'text' },
            { name: 'order', label: 'Display order', type: 'number' }
        ],
        card: (item) => ({
            title: `${item.icon || ''} ${item.degree}`.trim(),
            body: `${item.institution}${item.duration ? ' · ' + item.duration : ''}${item.cgpaOrMarks ? ' · ' + item.cgpaOrMarks : ''}${item.detail ? '\n' + item.detail : ''}`,
            meta: item.certificateUrl ? `Certificate: ${item.certificateUrl}` : ''
        })
    },
    skills: {
        endpoint: 'skills',
        title: 'Skills',
        subtitle: 'Grouped skill chips shown in the Skills section.',
        fields: [
            { name: 'category', label: 'Category (e.g. Languages)', type: 'text', required: true },
            { name: 'items', label: 'Skills (comma-separated)', type: 'tags', full: true },
            { name: 'order', label: 'Display order', type: 'number' }
        ],
        card: (item) => ({
            title: item.category,
            body: (item.items || []).join(', '),
            meta: ''
        })
    },
    experience: {
        endpoint: 'experience',
        title: 'Experience',
        subtitle: 'Your work timeline, most recent first.',
        fields: [
            { name: 'role', label: 'Role / title', type: 'text', required: true },
            { name: 'company', label: 'Company', type: 'text', required: true },
            { name: 'duration', label: 'Duration (e.g. 2023 — Present)', type: 'text' },
            { name: 'description', label: 'Description', type: 'textarea', full: true },
            { name: 'order', label: 'Display order', type: 'number' }
        ],
        card: (item) => ({
            title: `${item.role} — ${item.company}`,
            body: `${item.duration ? item.duration + '\n' : ''}${item.description || ''}`,
            meta: ''
        })
    },
    projects: {
        endpoint: 'projects',
        title: 'Projects',
        subtitle: 'Selected work shown with code and live links.',
        fields: [
            { name: 'name', label: 'Project name', type: 'text', required: true },
            { name: 'category', label: 'Category', type: 'select', options: ['Professional', 'Open Source', 'Personal', 'Freelance', 'College'], required: true },
            { name: 'description', label: 'Description', type: 'textarea', full: true },
            { name: 'tags', label: 'Tags (comma-separated)', type: 'tags' },
            { name: 'icon', label: 'Icon (glyph, used if no image)', type: 'text' },
            { name: 'imageUrl', label: 'Project image / screenshot', type: 'file', accept: 'image/*' },
            { name: 'codeUrl', label: 'Code (GitHub) URL', type: 'text' },
            { name: 'liveUrl', label: 'Live demo URL', type: 'text' },
            { name: 'order', label: 'Display order', type: 'number' }
        ],
        card: (item) => ({
            title: `${item.icon || ''} ${item.name}`.trim(),
            body: item.description || '',
            meta: [item.category && `Category: ${item.category}`, item.imageUrl && `Image: ${item.imageUrl}`, item.codeUrl && `Code: ${item.codeUrl}`, item.liveUrl && `Live: ${item.liveUrl}`].filter(Boolean).join(' · ')
        })
    },
    certifications: {
        endpoint: 'certifications',
        title: 'Certifications',
        subtitle: 'Professional certifications with proof links.',
        fields: [
            { name: 'title', label: 'Certification title', type: 'text', required: true },
            { name: 'org', label: 'Issuing organization', type: 'text' },
            { name: 'year', label: 'Year', type: 'text' },
            { name: 'certificateUrl', label: 'Certificate', type: 'file', accept: '.pdf,image/*' },
            { name: 'icon', label: 'Icon (glyph)', type: 'text' },
            { name: 'order', label: 'Display order', type: 'number' }
        ],
        card: (item) => ({
            title: `${item.icon || ''} ${item.title}`.trim(),
            body: `${item.org || ''}${item.year ? ' · ' + item.year : ''}`,
            meta: item.certificateUrl ? `Certificate: ${item.certificateUrl}` : ''
        })
    },
    achievements: {
        endpoint: 'achievements',
        title: 'Achievements',
        subtitle: 'Milestones worth mentioning.',
        fields: [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea', full: true },
            { name: 'icon', label: 'Icon (glyph)', type: 'text' },
            { name: 'order', label: 'Display order', type: 'number' }
        ],
        card: (item) => ({
            title: `${item.icon || ''} ${item.title}`.trim(),
            body: item.description || '',
            meta: ''
        })
    }
};
// ---------- API helper ----------
async function api(path, options = {}) {
    const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers);
    if (TOKEN)
        headers.Authorization = `Bearer ${TOKEN}`;
    const res = await fetch(`${API_BASE}${path}`, Object.assign(Object.assign({}, options), { headers }));
    const data = await res.json().catch(() => ({}));
    if (!res.ok)
        throw new Error((data && data.error) || `Request failed (${res.status})`);
    return data;
}
// ---------- Toast ----------
function toast(message, isError = false) {
    const el = document.getElementById('toast');
    el.textContent = message;
    el.className = 'toast show' + (isError ? ' error' : '');
    setTimeout(() => { el.className = 'toast'; }, 2600);
}
// ---------- Login ----------
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    errorEl.textContent = '';
    try {
        const data = await api('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        TOKEN = data.token;
        localStorage.setItem('admin_token', TOKEN);
        enterDashboard();
    }
    catch (err) {
        errorEl.textContent = err.message;
    }
});
document.getElementById('logoutBtn').addEventListener('click', () => {
    TOKEN = null;
    localStorage.removeItem('admin_token');
    dashboard.classList.add('hidden');
    loginScreen.classList.remove('hidden');
});
function enterDashboard() {
    loginScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
    loadProfilePanel();
    Object.keys(RESOURCES).forEach(key => loadResourcePanel(key));
    loadInsightsPanel();
}
// ---------- Tabs ----------
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
        document.getElementById(`panel-${btn.dataset.tab}`).classList.remove('hidden');
    });
});
async function loadProfilePanel() {
    const panel = document.getElementById('panel-profile');
    panel.innerHTML = `
    <div class="panel-head">
      <div><h2>Profile</h2><p>Hero text, bio, and contact links.</p></div>
    </div>
    <div id="profileFormWrap"></div>
  `;
    let profile;
    try {
        profile = await api('/profile');
    }
    catch (err) {
        panel.innerHTML += `<p class="login-error">${err.message}</p>`;
        return;
    }
    const wrap = document.getElementById('profileFormWrap');
    wrap.innerHTML = `
    <form id="profileForm" class="field-form glass">
      <label class="full">
        Photo
        <div class="file-row">
          <input type="text" name="photoUrl" value="${escapeAttr(profile.photoUrl)}" placeholder="Paste a URL, or upload a file →">
          <button type="button" class="btn btn-ghost btn-small file-upload-btn" data-field="photoUrl">Upload</button>
        </div>
        <input type="file" class="file-input-hidden" data-field="photoUrl" accept="image/*">
        <span class="file-status" data-field-status="photoUrl"></span>
      </label>
      <label>Name<input name="name" value="${escapeAttr(profile.name)}"></label>
      <label>Role / title<input name="role" value="${escapeAttr(profile.role)}"></label>
      <label class="full">Tagline<textarea name="tagline" rows="2">${escapeHtml(profile.tagline)}</textarea></label>
      <label class="full">Bio paragraphs (one per line)<textarea name="bioParagraphs" rows="5">${escapeHtml((profile.bioParagraphs || []).join('\n'))}</textarea></label>
      <label>Location<input name="location" value="${escapeAttr(profile.location)}"></label>
      <label>Experience label<input name="experienceLabel" value="${escapeAttr(profile.experienceLabel)}"></label>
      <label>Focus<input name="focus" value="${escapeAttr(profile.focus)}"></label>
      <label>Availability<input name="availability" value="${escapeAttr(profile.availability)}"></label>
      <label>Email<input name="email" value="${escapeAttr(profile.email)}"></label>
      <label>GitHub URL<input name="github" value="${escapeAttr(profile.github)}"></label>
      <label>LinkedIn URL<input name="linkedin" value="${escapeAttr(profile.linkedin)}"></label>
      <label>Twitter / X URL<input name="twitter" value="${escapeAttr(profile.twitter)}"></label>
      <label>Résumé URL<input name="resumeUrl" value="${escapeAttr(profile.resumeUrl)}"></label>
      <label>Design (Color Theme)
        <select name="design">
          <option value="lavender" ${(profile.design || 'lavender') === 'lavender' ? 'selected' : ''}>Lavender Mist</option>
          <option value="sage" ${profile.design === 'sage' ? 'selected' : ''}>Sage Meadow</option>
          <option value="sand" ${profile.design === 'sand' ? 'selected' : ''}>Warm Sand</option>
          <option value="rose" ${profile.design === 'rose' ? 'selected' : ''}>Blush Rose</option>
          <option value="sky" ${profile.design === 'sky' ? 'selected' : ''}>Sky Mist</option>
        </select>
      </label>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary" style="width:auto;">Save profile</button>
      </div>
    </form>
  `;
    bindFileFields(document.getElementById('profileForm'));
    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const payload = {
            name: form.elements.namedItem('name').value,
            role: form.elements.namedItem('role').value,
            tagline: form.elements.namedItem('tagline').value,
            bioParagraphs: form.elements.namedItem('bioParagraphs').value
                .split('\n').map(s => s.trim()).filter(Boolean),
            location: form.elements.namedItem('location').value,
            experienceLabel: form.elements.namedItem('experienceLabel').value,
            focus: form.elements.namedItem('focus').value,
            availability: form.elements.namedItem('availability').value,
            email: form.elements.namedItem('email').value,
            github: form.elements.namedItem('github').value,
            linkedin: form.elements.namedItem('linkedin').value,
            twitter: form.elements.namedItem('twitter').value,
            resumeUrl: form.elements.namedItem('resumeUrl').value,
            photoUrl: form.elements.namedItem('photoUrl').value,
            design: form.elements.namedItem('design').value
        };
        try {
            await api('/profile', { method: 'PUT', body: JSON.stringify(payload) });
            toast('Profile saved');
        }
        catch (err) {
            toast(err.message, true);
        }
    });
}
// ---------- Generic resource panels (education, skills, projects, etc.) ----------
async function loadResourcePanel(key, editingId = null) {
    const config = RESOURCES[key];
    const panel = document.getElementById(`panel-${key}`);
    let items = [];
    let loadError = null;
    try {
        items = await api(`/${config.endpoint}`);
    }
    catch (err) {
        loadError = err.message;
    }
    const editingItem = editingId ? items.find(i => i._id === editingId) || null : null;
    panel.innerHTML = `
    <div class="panel-head">
      <div><h2>${config.title}</h2><p>${config.subtitle}</p></div>
    </div>
    ${renderForm(key, config, editingItem)}
    <div id="list-${key}" class="item-list"></div>
  `;
    bindForm(key, config, editingId);
    const listEl = document.getElementById(`list-${key}`);
    if (loadError) {
        listEl.innerHTML = `<p class="login-error">${loadError}</p>`;
        return;
    }
    if (items.length === 0) {
        listEl.innerHTML = `<div class="glass empty-state">No ${config.title.toLowerCase()} yet — add your first one above.</div>`;
        return;
    }
    listEl.innerHTML = items.map(item => {
        const c = config.card(item);
        return `
      <div class="glass item-card">
        <div class="item-main">
          <h3>${escapeHtml(c.title)}</h3>
          <p>${escapeHtml(c.body).replace(/\n/g, '<br>')}</p>
          ${c.meta ? `<div class="item-meta">${escapeHtml(c.meta)}</div>` : ''}
        </div>
        <div class="item-actions">
          <button class="btn btn-ghost btn-small" data-edit="${item._id}" data-key="${key}">Edit</button>
          <button class="btn btn-danger btn-small" data-delete="${item._id}" data-key="${key}">Delete</button>
        </div>
      </div>
    `;
    }).join('');
    listEl.querySelectorAll('[data-edit]').forEach(btn => {
        btn.addEventListener('click', () => loadResourcePanel(btn.dataset.key, btn.dataset.edit));
    });
    listEl.querySelectorAll('[data-delete]').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm('Delete this entry? This cannot be undone.'))
                return;
            try {
                await api(`/${config.endpoint}/${btn.dataset.delete}`, { method: 'DELETE' });
                toast('Deleted');
                loadResourcePanel(btn.dataset.key);
            }
            catch (err) {
                toast(err.message, true);
            }
        });
    });
}
function renderForm(key, config, editingItem) {
    const fieldsHtml = config.fields.map(f => {
        const value = editingItem ? editingItem[f.name] : '';
        const displayValue = f.type === 'tags' ? (Array.isArray(value) ? value.join(', ') : '') : (value !== null && value !== void 0 ? value : '');
        if (f.type === 'file') {
            return `
        <label class="${f.full ? 'full' : ''}">
          ${f.label}
          <div class="file-row">
            <input type="text" name="${f.name}" value="${escapeAttr(displayValue)}" placeholder="Paste a URL, or upload a file →">
            <button type="button" class="btn btn-ghost btn-small file-upload-btn" data-field="${f.name}">Upload</button>
          </div>
          <input type="file" class="file-input-hidden" data-field="${f.name}" accept="${f.accept || ''}">
          <span class="file-status" data-field-status="${f.name}"></span>
        </label>
      `;
        }
        const inputEl = f.type === 'textarea'
            ? `<textarea name="${f.name}" rows="3">${escapeHtml(displayValue)}</textarea>`
            : f.type === 'select'
                ? `<select name="${f.name}" ${f.required ? 'required' : ''}>
          ${(f.options || []).map(opt => `<option value="${escapeAttr(opt)}" ${opt === displayValue ? 'selected' : ''}>${escapeHtml(opt)}</option>`).join('')}
        </select>`
                : `<input name="${f.name}" type="${f.type === 'number' ? 'number' : 'text'}" value="${escapeAttr(displayValue)}" ${f.required ? 'required' : ''}>`;
        return `<label class="${f.full ? 'full' : ''}">${f.label}${inputEl}</label>`;
    }).join('');
    return `
    <form id="form-${key}" class="field-form glass" data-editing-id="${editingItem ? editingItem._id : ''}">
      ${fieldsHtml}
      <div class="form-actions">
        <button type="submit" class="btn btn-primary" style="width:auto;">${editingItem ? 'Update' : 'Add'} ${config.title.replace(/s$/, '')}</button>
        ${editingItem ? `<button type="button" class="btn btn-ghost" id="cancelEdit-${key}">Cancel</button>` : ''}
      </div>
    </form>
  `;
}
// Uploads a single file to the backend, which forwards it to Cloudinary,
// and returns the hosted URL.
async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const headers = {};
    if (TOKEN)
        headers.Authorization = `Bearer ${TOKEN}`;
    const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers, // no Content-Type — the browser sets the multipart boundary itself
        body: formData
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok)
        throw new Error(data.error || `Upload failed (${res.status})`);
    return data.url;
}
function bindFileFields(form) {
    form.querySelectorAll('.file-upload-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const fieldName = btn.dataset.field;
            const fileInput = form.querySelector(`.file-input-hidden[data-field="${fieldName}"]`);
            fileInput === null || fileInput === void 0 ? void 0 : fileInput.click();
        });
    });
    form.querySelectorAll('.file-input-hidden').forEach(fileInput => {
        fileInput.addEventListener('change', async () => {
            var _a;
            const fieldName = fileInput.dataset.field;
            const statusEl = form.querySelector(`.file-status[data-field-status="${fieldName}"]`);
            const textInput = form.elements.namedItem(fieldName);
            const file = (_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0];
            if (!file || !textInput)
                return;
            if (statusEl) {
                statusEl.textContent = 'Uploading…';
                statusEl.className = 'file-status';
            }
            try {
                const url = await uploadFile(file);
                textInput.value = url;
                if (statusEl) {
                    statusEl.textContent = '✓ Uploaded';
                    statusEl.className = 'file-status success';
                }
            }
            catch (err) {
                if (statusEl) {
                    statusEl.textContent = err.message;
                    statusEl.className = 'file-status error';
                }
            }
        });
    });
}
function bindForm(key, config, editingId) {
    const form = document.getElementById(`form-${key}`);
    bindFileFields(form);
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {};
        config.fields.forEach(f => {
            const raw = form.elements.namedItem(f.name).value;
            if (f.type === 'tags') {
                payload[f.name] = raw.split(',').map(s => s.trim()).filter(Boolean);
            }
            else if (f.type === 'number') {
                payload[f.name] = raw === '' ? 0 : Number(raw);
            }
            else {
                payload[f.name] = raw;
            }
        });
        try {
            if (editingId) {
                await api(`/${config.endpoint}/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
                toast('Updated');
            }
            else {
                await api(`/${config.endpoint}`, { method: 'POST', body: JSON.stringify(payload) });
                toast('Added');
            }
            loadResourcePanel(key);
        }
        catch (err) {
            toast(err.message, true);
        }
    });
    const cancelBtn = document.getElementById(`cancelEdit-${key}`);
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => loadResourcePanel(key));
    }
}
async function loadInsightsPanel() {
    const panel = document.getElementById('panel-insights');
    panel.innerHTML = `
    <div class="panel-head">
      <div><h2>Insights</h2><p>Traffic, geography, and engagement on your portfolio. Company names are best-effort, resolved from visitor IP addresses — reliable for corporate/VPN traffic, generic ISP names for home connections.</p></div>
      <button class="btn btn-ghost btn-small" id="refreshInsights">Refresh</button>
    </div>
    <div id="insightsBody">Loading…</div>
  `;
    document.getElementById('refreshInsights').addEventListener('click', loadInsightsPanel);
    const body = document.getElementById('insightsBody');
    let summary, pages, companies, locations, clicks;
    try {
        [summary, pages, companies, locations, clicks] = await Promise.all([
            api('/insights/summary'),
            api('/insights/pages'),
            api('/insights/companies'),
            api('/insights/locations'),
            api('/insights/clicks')
        ]);
    }
    catch (err) {
        body.innerHTML = `<p class="login-error">${err.message}</p>`;
        return;
    }
    const statCard = (label, value) => `
    <div class="glass stat-card">
      <div class="stat-value">${value.toLocaleString()}</div>
      <div class="stat-label">${label}</div>
    </div>
  `;
    const rankedList = (rows) => rows.length
        ? `<div class="glass insight-list">${rows.join('')}</div>`
        : `<div class="glass empty-state">No data yet — insights fill in as visitors browse your live site.</div>`;
    body.innerHTML = `
    <div class="stat-grid">
      ${statCard('Unique visitors', summary.uniqueVisitors)}
      ${statCard('Page views', summary.totalPageViews)}
      ${statCard('Clicks', summary.totalClicks)}
      ${statCard('Active now', summary.activeNow)}
    </div>

    <h3 class="insight-heading">Most-viewed pages</h3>
    <p class="insight-sub">Which section of your site gets the most attention — including from recruiters.</p>
    ${rankedList(pages.map(p => `
      <div class="insight-row">
        <span class="insight-row-label">#${escapeHtml(p.path)}</span>
        <span class="insight-row-count">${p.count.toLocaleString()} views</span>
      </div>
    `))}

    <h3 class="insight-heading">Visitor companies (A → Z)</h3>
    <p class="insight-sub">Best-effort, resolved from IP address. Corporate/VPN traffic often shows a real company name; home connections show an ISP.</p>
    ${rankedList(companies.map(c => `
      <div class="insight-row">
        <span class="insight-row-label">${escapeHtml(c.company)}</span>
        <span class="insight-row-count">${c.count.toLocaleString()} visit${c.count === 1 ? '' : 's'} · last seen ${new Date(c.lastSeen).toLocaleDateString()}${c.country ? ' · ' + escapeHtml(c.country) : ''}</span>
      </div>
    `))}

    <h3 class="insight-heading">Locations</h3>
    <p class="insight-sub">Where your visitors are browsing from.</p>
    ${rankedList(locations.map(l => `
      <div class="insight-row">
        <span class="insight-row-label">${escapeHtml(l.city ? `${l.city}, ${l.country}` : l.country)}</span>
        <span class="insight-row-count">${l.count.toLocaleString()} views</span>
      </div>
    `))}

    <h3 class="insight-heading">Most-clicked links</h3>
    <p class="insight-sub">Résumé downloads, project links, contact clicks, and more.</p>
    ${rankedList(clicks.map(c => `
      <div class="insight-row">
        <span class="insight-row-label">${escapeHtml(c.label)}</span>
        <span class="insight-row-count">${c.count.toLocaleString()} click${c.count === 1 ? '' : 's'}</span>
      </div>
    `))}
  `;
}
// ---------- Small helpers ----------
function escapeHtml(str) {
    return String(str !== null && str !== void 0 ? str : '').replace(/[&<>"']/g, (m) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
}
function escapeAttr(str) { return escapeHtml(str); }
// ---------- Boot ----------
if (TOKEN) {
    enterDashboard();
}
else {
    loginScreen.classList.remove('hidden');
}
