import { api } from '../api.js';
import { el, toast } from '../utils.js';

export function CreateBlogView(root) {
  const form = el('form', { class: 'card form', id: 'create-blog-form' }, [
    el('h2', {}, 'Create Blog'),
    el('label', {}, ['Title', el('input', { id: 'title', required: true, maxlength: 200 })]),
    el('label', {}, ['Tags (comma separated)', el('input', { id: 'tags', placeholder: 'tech, node, js' })]),
    el('label', {}, ['Content (HTML allowed)', el('textarea', { id: 'content', required: true, rows: 10 })]),
    el('button', { class: 'btn', type: 'submit' }, 'Publish')
  ]);
  root.append(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const tagsInput = document.getElementById('tags').value.trim();
    const tags = tagsInput ? tagsInput.split(',').map(s => s.trim()).filter(Boolean) : undefined;
    try {
      const res = await api.createBlog({ title, content, tags });
      if (!res?.blog?.slug) throw new Error(res?.message || 'Failed to create blog');
      toast('Blog created');
      window.location.hash = `#/blogs/${res.blog.slug}`;
    } catch (err) {
      toast(err.message, 'error');
    }
  });
}
