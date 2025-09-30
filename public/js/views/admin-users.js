import { api } from '../api.js';
import { el, toast } from '../utils.js';

export function AdminUsersView(root) {
  const card = el('section', { class: 'card grid' }, [ el('h2', {}, 'Users'), el('div', { id: 'users-box' }, 'Loading...') ]);
  root.append(card);

  async function load() {
    try {
      const { users = [] } = await api.users();
      const box = document.getElementById('users-box');
      if (!users.length) { box.textContent = 'No users'; return; }
      const table = el('table', { class: 'table' });
      table.append(
        el('thead', {}, el('tr', {}, [ el('th', {}, 'Username'), el('th', {}, 'Email'), el('th', {}, 'Role') ])),
        el('tbody', {}, users.map(u => el('tr', {}, [ el('td', {}, u.username), el('td', {}, u.email), el('td', {}, u.role) ])))
      );
      box.innerHTML = '';
      box.append(table);
    } catch (e) { document.getElementById('users-box').textContent = e.message; toast('Failed to load users', 'error'); }
  }

  load();
}
