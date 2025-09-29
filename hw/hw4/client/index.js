const API_BASE = 'http://localhost:3049';

const el = id => document.getElementById(id);
const msg = m => { el('messages').textContent = m; setTimeout(()=> el('messages').textContent='', 4000); };

let courses = []; // fetched from server

async function fetchCourses() {
  try {
    const res = await fetch(`${API_BASE}/courses`);
    if (!res.ok) throw new Error(`Fetch courses failed: ${res.status}`);
    courses = await res.json();
    renderCourses();
  } catch (err) {
    el('coursesList').textContent = 'Failed to load courses. Check backend route /courses and CORS.';
    console.error(err);
  }
}

function renderCourses(selectedIds = []) {
  const container = el('coursesList');
  container.innerHTML = '';
  if (!Array.isArray(courses) || courses.length === 0) {
    container.textContent = 'No courses found';
    return;
  }
  courses.forEach(c => {
    const id = c._id || c.id || c.courseId || c.name; // best-effort id
    const label = document.createElement('label');
    label.style.display = 'block';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.value = id;
    cb.checked = selectedIds.includes(id);
    label.appendChild(cb);
    label.appendChild(document.createTextNode(' ' + (c.name || c.title || c.courseName || JSON.stringify(c))));
    container.appendChild(label);
  });
}

function getSelectedCourseIds() {
  return Array.from(el('coursesList').querySelectorAll('input[type=checkbox]:checked')).map(i => i.value);
}

function getFormData() {
  return {
    firstName: el('firstName').value.trim(),
    lastName: el('lastName').value.trim(),
    email: el('email').value.trim(),
    courses: getSelectedCourseIds()
  };
}

async function createProfile() {
  const body = getFormData();
  try {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`Create failed: ${res.status}`);
    const data = await res.json();
    const id = data._id || data.id;
    if (id) localStorage.setItem('studentId', id);
    el('studentIdInput').value = id || '';
    showProfileData(data);
    msg('Profile created');
  } catch (err) {
    console.error(err);
    msg('Create failed: see console');
  }
}

async function loadProfile() {
  const id = el('studentIdInput').value.trim() || localStorage.getItem('studentId');
  if (!id) { msg('no student id provided'); return; }
  try {
    const res = await fetch(`${API_BASE}/students/${id}`);
    if (!res.ok) throw new Error(`Load failed: ${res.status}`);
    const data = await res.json();
    populateForm(data);
    showProfileData(data);
    localStorage.setItem('studentId', id);
    msg('Profile loaded');
  } catch (err) {
    console.error(err);
    msg('Load failed: see console');
  }
}

function populateForm(data) {
  el('firstName').value = data.firstName || '';
  el('lastName').value = data.lastName || '';
  el('email').value = data.email || '';
  const selected = (data.courses || []).map(c => (c._id || c.id || c));
  renderCourses(selected);
}

function showProfileData(data) {
  el('profileJson').textContent = JSON.stringify(data, null, 2);
}

async function updateProfile() {
  const id = el('studentIdInput').value.trim() || localStorage.getItem('studentId');
  if (!id) { msg('no student id provided'); return; }
  const body = getFormData();
  try {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'PUT', // or PATCH depending on your backend
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`Update failed: ${res.status}`);
    const data = await res.json();
    showProfileData(data);
    msg('Profile updated');
  } catch (err) {
    console.error(err);
    msg('Update failed: see console');
  }
}

async function softDeleteProfile() {
  const id = el('studentIdInput').value.trim() || localStorage.getItem('studentId');
  if (!id) { msg('no student id provided'); return; }
  const body = { isDeleted: new Date().toISOString() };
  try {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'PATCH', // backend must accept PATCH; if not, use PUT with full object
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`Soft-delete failed: ${res.status}`);
    const data = await res.json();
    showProfileData(data);
    msg('Profile soft-deleted (isDeleted set)');
  } catch (err) {
    console.error(err);
    msg('Soft-delete failed: see console');
  }
}

document.getElementById('createBtn').addEventListener('click', createProfile);
document.getElementById('loadBtn').addEventListener('click', loadProfile);
document.getElementById('updateBtn').addEventListener('click', updateProfile);
document.getElementById('softDeleteBtn').addEventListener('click', softDeleteProfile);

window.addEventListener('load', fetchCourses);