import { api } from '../api.js';
import { el, toast } from '../utils.js';

export function RegisterView(root) {
  const form = el('form', { class: 'card form', id: 'reg-form' }, [
    el('h2', {}, 'Register'),
    el('label', {}, ['Email', el('input', { id: 'email', type: 'email', required: true })]),
    el('label', {}, ['Password', el('input', { id: 'password', type: 'password', required: true })]),
    el('label', {}, ['Username (optional)', el('input', { id: 'username', type: 'text' })]),
    el('button', { class: 'btn', type: 'submit' }, 'Create Account'),
  ]);
  root.append(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const username = document.getElementById('username').value.trim();
      const payload = { email, password };
      if (username) payload.username = username;
      const j = await api.register(payload);
      if (!j?.user) throw new Error(j.message || 'Register failed');
      toast('Registered! You can login now.');
      window.location.hash = '#/login';
    } catch (e) { toast(e.message, 'error'); }
  });
}
