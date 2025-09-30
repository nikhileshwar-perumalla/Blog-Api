import { api } from '../api.js';
import { el, toast } from '../utils.js';

export function HomeView(root) {
  const card = el('section', { class: 'card grid' }, [
    el('div', {}, [ el('h1', {}, 'Welcome to Blog API'), el('p', { class: 'muted' }, 'A sleek black UI for your API') ]),
    el('div', {}, [
      el('button', { class: 'btn', id: 'btn-health' }, 'Check API'),
      el('pre', { class: 'pre', id: 'health-pre' }, '')
    ])
  ]);
  root.append(card);
  document.getElementById('btn-health').addEventListener('click', async () => {
    const pre = document.getElementById('health-pre');
    pre.textContent = '...';
    try { const j = await api.health(); pre.textContent = JSON.stringify(j, null, 2); }
    catch (e) { pre.textContent = e.message; toast('Health check failed', 'error'); }
  });
}
