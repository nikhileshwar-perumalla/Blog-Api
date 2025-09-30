import { getToken, setToken, api } from './api.js';

export function renderNav() {
  const links = document.getElementById('nav-links');
  const token = getToken();
  links.innerHTML = '';
  const a = (href, text) => Object.assign(document.createElement('a'), { href, textContent: text });

  links.append(
    a('#/', 'Home'),
    a('#/blogs', 'Blogs')
  );

  if (token) {
    links.append(
      a('#/me', 'Me'),
      a('#/admin/users', 'Users'),
    );
    const logout = a('#', 'Logout');
    logout.addEventListener('click', async (e) => {
      e.preventDefault();
      await api.logout();
      setToken(null);
      renderNav();
      window.location.hash = '#/';
    });
    links.append(logout);
  } else {
    links.append(a('#/login', 'Login'), a('#/register', 'Register'));
  }
}
