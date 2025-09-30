const $ = (sel) => document.querySelector(sel);
const show = (id) => {
  ['#home', '#blogs', '#login'].forEach(s => $(s).classList.add('hidden'));
  $(id).classList.remove('hidden');
};

$('#nav-home').addEventListener('click', () => show('#home'));
$('#nav-blogs').addEventListener('click', () => { show('#blogs'); loadBlogs(); });
$('#nav-login').addEventListener('click', () => show('#login'));

$('#year').textContent = new Date().getFullYear();

// Health check
$('#check-health').addEventListener('click', async () => {
  const out = $('#health-output');
  out.textContent = 'Checking...';
  try {
    const res = await fetch('/api/v1');
    const j = await res.json();
    out.textContent = JSON.stringify(j, null, 2);
  } catch (e) {
    out.textContent = e.message;
  }
});

// Load blogs
async function loadBlogs() {
  const list = $('#blog-list');
  list.innerHTML = 'Loading...';
  try {
    const res = await fetch('/api/v1/blogs');
    const j = await res.json();
    if (!Array.isArray(j.blogs)) {
      list.textContent = 'No blogs yet.';
      return;
    }
    list.innerHTML = '';
    j.blogs.forEach(b => {
      const el = document.createElement('div');
      el.className = 'item';
      el.innerHTML = `<h3>${b.title}</h3><p>by ${b.author?.username || 'Unknown'}</p>`;
      list.appendChild(el);
    });
  } catch (e) {
    list.textContent = e.message;
  }
}

$('#reload-blogs').addEventListener('click', loadBlogs);

// Simple login
let accessToken = null;
$('#login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = $('#email').value.trim();
  const password = $('#password').value;
  const out = $('#login-output');
  out.textContent = 'Logging in...';
  try {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const j = await res.json();
    if (!res.ok) throw new Error(j.message || 'Login failed');
    accessToken = j.accessToken;
    out.textContent = `Logged in as ${j.user?.email}`;
  } catch (err) {
    out.textContent = err.message;
  }
});
