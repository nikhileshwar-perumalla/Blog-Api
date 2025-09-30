import { api } from '../api.js';
import { el, toast } from '../utils.js';

export function MeView(root) {
  const card = el('section', { class: 'card grid' }, [ el('h2', {}, 'My Profile'), el('div', { id: 'me-box' }, 'Loading...') ]);
  root.append(card);

  async function load() {
    try {
      const { user } = await api.me();
      const box = document.getElementById('me-box');
      if (!user) { box.textContent = 'Not found'; return; }
      const form = el('form', { class: 'grid', id: 'me-form' }, [
        el('label', {}, ['Username', el('input', { id: 'username', value: user.username || '' })]),
        el('label', {}, ['First name', el('input', { id: 'firstname', value: user.firstname || '' })]),
        el('label', {}, ['Last name', el('input', { id: 'lastname', value: user.lastname || '' })]),
        el('button', { class: 'btn', type: 'submit' }, 'Save'),
      ]);
      box.innerHTML='';
      box.append(form);

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
          const data = {
            username: document.getElementById('username').value.trim(),
            firstname: document.getElementById('firstname').value.trim(),
            lastname: document.getElementById('lastname').value.trim(),
          };
          const r = await api.updateMe(data);
          toast('Profile updated');
        } catch { toast('Update failed', 'error'); }
      });
    } catch (e) { document.getElementById('me-box').textContent = e.message; }
  }

  load();
}
