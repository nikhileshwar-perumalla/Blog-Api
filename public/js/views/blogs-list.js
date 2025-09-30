import { api, getToken } from '../api.js';
import { el, toast } from '../utils.js';

export function BlogsListView(root) {
  const title = el('h2', {}, 'Latest Blogs');
  const actions = el('div', { class: 'row' }, [
    ...(getToken() ? [el('a', { href: '#/blogs/new', class: 'btn' }, 'Create Blog')] : []),
    el('button', { class: 'btn', id: 'reload' }, 'Reload'),
  ]);

  const list = el('div', { class: 'list', id: 'list' });
  const card = el('section', { class: 'card' }, [title, actions, list]);
  root.append(card);

  async function load() {
    list.innerHTML = 'Loading...';
    try {
      const { blogs = [] } = await api.listBlogs();
      list.innerHTML = '';
      blogs.forEach(b => {
        const item = el('div', { class: 'item' }, [
          el('h3', {}, b.title),
          el('p', { class: 'muted' }, `by ${b.author?.username || 'Unknown'}`),
          el('div', { class: 'row' }, [
            el('a', { href: `#/blogs/${b.slug}`, class: 'btn' }, 'Open')
          ])
        ]);
        list.append(item);
      });
    } catch (e) {
      list.textContent = e.message; toast('Failed to load blogs', 'error');
    }
  }

  document.getElementById('reload').addEventListener('click', load);
  load();
}
