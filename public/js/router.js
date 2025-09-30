import { HomeView } from './views/home.js';
import { BlogsListView } from './views/blogs-list.js';
import { BlogDetailView } from './views/blog-detail.js';
import { LoginView } from './views/login.js';
import { RegisterView } from './views/register.js';
import { MeView } from './views/me.js';
import { AdminUsersView } from './views/admin-users.js';
import { CreateBlogView } from './views/blog-create.js';
import { BlogEditView } from './views/blog-edit.js';

const routes = [
  { path: /^#\/$|^$/, view: HomeView },
  { path: /^#\/blogs$/, view: BlogsListView },
  { path: /^#\/blogs\/new$/, view: CreateBlogView },
  { path: /^#\/blogs\/([^/]+)\/edit$/, view: BlogEditView },
  { path: /^#\/blogs\/([^/]+)$/, view: BlogDetailView },
  { path: /^#\/login$/, view: LoginView },
  { path: /^#\/register$/, view: RegisterView },
  { path: /^#\/me$/, view: MeView },
  { path: /^#\/admin\/users$/, view: AdminUsersView },
];

export function route() {
  const hash = window.location.hash || '#/';
  for (const r of routes) {
    const match = hash.match(r.path);
    if (match) {
      const root = document.getElementById('view-root');
      root.innerHTML = '';
      const params = match.slice(1);
      r.view(root, ...params);
      return;
    }
  }
  window.location.hash = '#/';
}
