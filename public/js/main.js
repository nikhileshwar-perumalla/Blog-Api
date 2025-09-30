import { renderNav } from './nav.js';
import { route } from './router.js';
import { setYear } from './utils.js';

renderNav();
setYear();

// Initial route
route();

// Re-route on hash change
window.addEventListener('hashchange', route);
