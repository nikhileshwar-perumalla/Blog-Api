let accessToken = null;

export function setToken(token) { accessToken = token; }
export function getToken() { return accessToken; }

async function request(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  const res = await fetch(path, { ...opts, headers, credentials: 'include' });
  if (res.status === 401 && path !== '/api/v1/auth/refresh_token') {
    // try refresh and retry once
    try {
      const r = await fetch('/api/v1/auth/refresh_token', { method: 'POST', credentials: 'include' });
      if (r.ok) {
        const { accessToken: newToken } = await r.json();
        if (newToken) setToken(newToken);
        const res2 = await fetch(path, { ...opts, headers: { ...headers, Authorization: `Bearer ${newToken}` }, credentials: 'include' });
        return res2;
      }
    } catch {}
  }
  return res;
}

export const api = {
  health: () => request('/api/v1').then(r => r.json()),
  login: (email, password) => request('/api/v1/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }).then(r => r.json()),
  register: (payload) => request('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(payload) }).then(r => r.json()),
  logout: () => request('/api/v1/auth/logout', { method: 'POST' }),

  // users
  me: () => request('/api/v1/users/me').then(r => r.json()),
  updateMe: (data) => request('/api/v1/users/me', { method: 'PATCH', body: JSON.stringify(data) }).then(r => r.json()),
  users: () => request('/api/v1/users').then(r => r.json()),

  // blogs
  listBlogs: (q = '') => request('/api/v1/blogs' + q).then(r => r.json()),
  getBlog: (slug) => request(`/api/v1/blogs/${slug}`).then(r => r.json()),
  createBlog: (data) => request('/api/v1/blogs', { method: 'POST', body: JSON.stringify(data) }).then(r => r.json()),
  updateBlog: (slug, data) => request(`/api/v1/blogs/${slug}`, { method: 'PATCH', body: JSON.stringify(data) }).then(r => r.json()),
  deleteBlog: (slug) => request(`/api/v1/blogs/${slug}`, { method: 'DELETE' }),
  like: (slug) => request(`/api/v1/blogs/${slug}/like`, { method: 'POST' }).then(r => r.json()),
  unlike: (slug) => request(`/api/v1/blogs/${slug}/unlike`, { method: 'POST' }).then(r => r.json()),

  // comments
  listComments: (slug) => request(`/api/v1/blogs/${slug}/comments`).then(r => r.json()),
  createComment: (slug, content) => request(`/api/v1/blogs/${slug}/comments`, { method: 'POST', body: JSON.stringify({ content }) }).then(r => r.json()),
  deleteComment: (slug, id) => request(`/api/v1/blogs/${slug}/comments/${id}`, { method: 'DELETE' }),
};
