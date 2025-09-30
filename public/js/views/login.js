import { api, setToken } from '../api.js';
import { el, toast } from '../utils.js';
import { renderNav } from '../nav.js';

export function LoginView(root) {
  const form = el('form', { class: 'card form', id: 'login-form' }, [
    el('h2', {}, 'Login'),
    el('label', {}, ['Email', el('input', { id: 'email', type: 'email', required: true })]),
    el('label', {}, ['Password', el('input', { id: 'password', type: 'password', required: true })]),
    el('button', { class: 'btn', type: 'submit' }, 'Login'),
    el('p', { class: 'muted' }, 'No account? '),
  ]);
  root.append(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const j = await api.login(email, password);
      if (!j.accessToken) throw new Error(j.message || 'Login failed');
      setToken(j.accessToken);
      toast(`Welcome ${j.user?.username || j.user?.email}`);
      renderNav();
      window.location.hash = '#/blogs';
    } catch (e) {
      toast(e.message, 'error');
    }
  });
}
