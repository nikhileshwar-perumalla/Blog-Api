import { api } from '../api.js';
import { el, toast } from '../utils.js';

export function BlogEditView(root, slug) {
  const card = el('section', { class: 'card grid' }, [ el('h2', {}, 'Edit Blog'), el('div', { id: 'edit-box' }, 'Loading...') ]);
  root.append(card);

  async function load() {
    const box = document.getElementById('edit-box');
    try {
      const { blog } = await api.getBlog(slug);
      if (!blog) { box.textContent = 'Blog not found'; return; }
      const form = el('form', { class: 'form', id: 'edit-form' }, [
        el('label', {}, ['Title', el('input', { id: 'title', required: true, maxlength: 200, value: blog.title })]),
        el('label', {}, ['Tags (comma separated)', el('input', { id: 'tags', value: (blog.tags || []).join(', ') })]),
        el('label', {}, ['Content (HTML allowed)', el('textarea', { id: 'content', required: true, rows: 12 }, blog.content )]),
        el('div', { class: 'row' }, [
          el('button', { class: 'btn', type: 'submit' }, 'Save Changes'),
          el('a', { class: 'btn', href: `#/blogs/${slug}` }, 'Cancel')
        ])
      ]);
      box.innerHTML = '';
      box.append(form);

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value.trim();
        const content = document.getElementById('content').value.trim();
        const tagsInput = document.getElementById('tags').value.trim();
        const tags = tagsInput ? tagsInput.split(',').map(s => s.trim()).filter(Boolean) : [];
        try {
          const res = await api.updateBlog(slug, { title, content, tags });
          if (!res?.blog?.slug) throw new Error(res?.message || 'Failed to update');
          toast('Blog updated');
          window.location.hash = `#/blogs/${res.blog.slug}`; // navigate to new slug if changed
        } catch (err) { toast(err.message, 'error'); }
      });
    } catch (e) { box.textContent = e.message; }
  }

  load();
}
