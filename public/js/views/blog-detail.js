import { api, getToken } from '../api.js';
import { el, toast } from '../utils.js';

export function BlogDetailView(root, slug) {
  const card = el('section', { class: 'card grid' });
  root.append(card);

  async function load() {
    card.innerHTML = 'Loading...';
    try {
      const { blog } = await api.getBlog(slug);
      if (!blog) { card.textContent = 'Blog not found'; return; }
      const head = el('div', {}, [ el('h2', {}, blog.title), el('p', { class: 'muted' }, `by ${blog.author?.username || 'Unknown'}`) ]);
      const body = el('div', {}, [ el('div', { class: 'code', html: blog.content }) ]);

      const row = el('div', { class: 'row' }, []);
      if (getToken()) {
        const likeBtn = el('button', { class: 'btn', id: 'btn-like' }, `Like (${blog.likeCount || 0})`);
        const unlikeBtn = el('button', { class: 'btn', id: 'btn-unlike' }, 'Unlike');
        row.append(likeBtn, unlikeBtn);
      }
      // Author actions (server enforces auth; UI shown when logged-in)
      const actions = el('div', { class: 'row' }, []);
      if (getToken()) {
        actions.append(
          el('a', { class: 'btn', href: `#/blogs/${slug}/edit` }, 'Edit'),
          el('button', { class: 'btn', id: 'btn-delete' }, 'Delete')
        );
      }
      card.innerHTML = '';
      card.append(head, body, row, actions, el('h3', {}, 'Comments'), el('div', { id: 'comments' }));

      if (getToken()) {
        const likeBtn = document.getElementById('btn-like');
        const unlikeBtn = document.getElementById('btn-unlike');
        if (likeBtn) likeBtn.addEventListener('click', async () => {
          try { const r = await api.like(slug); likeBtn.textContent = `Like (${(r.blog?.likeCount) ?? (blog.likeCount + 1)})`; toast('Liked'); }
          catch { toast('Failed', 'error'); }
        });
        if (unlikeBtn) unlikeBtn.addEventListener('click', async () => {
          try { const r = await api.unlike(slug); likeBtn.textContent = `Like (${(r.blog?.likeCount) ?? (blog.likeCount - 1)})`; toast('Unliked'); }
          catch { toast('Failed', 'error'); }
        });
        const del = document.getElementById('btn-delete');
        if (del) del.addEventListener('click', async () => {
          if (!confirm('Delete this blog?')) return;
          try { await api.deleteBlog(slug); toast('Blog deleted'); window.location.hash = '#/blogs'; }
          catch { toast('Delete failed', 'error'); }
        });
      }

      loadComments();
    } catch (e) {
      card.textContent = e.message; toast('Failed to load', 'error');
    }
  }

  async function loadComments() {
    const box = document.getElementById('comments');
    box.innerHTML = 'Loading comments...';
    try {
      const { comments = [] } = await api.listComments(slug);
      const frag = document.createDocumentFragment();
      const form = getToken() ? commentForm() : null;
      if (form) frag.append(form);
      comments.forEach(c => {
        const row = el('div', { class: 'item row', style: 'justify-content: space-between;' }, [
          el('div', {}, [ el('b', {}, c.author?.username || 'User'), el('p', { class: 'muted' }, c.content) ]),
        ]);
        frag.append(row);
      });
      box.innerHTML = '';
      box.append(frag);
    } catch (e) {
      box.textContent = e.message; toast('Failed to load comments', 'error');
    }
  }

  function commentForm() {
    const form = el('form', { class: 'row' }, [
      el('input', { placeholder: 'Write a comment...', id: 'comment-input' }),
      el('button', { class: 'btn', type: 'submit' }, 'Comment')
    ]);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('comment-input');
      const content = input.value.trim(); if (!content) return;
      try { await api.createComment(slug, content); toast('Comment added'); input.value=''; loadComments(); }
      catch { toast('Failed to comment', 'error'); }
    });
    return form;
  }

  load();
}
