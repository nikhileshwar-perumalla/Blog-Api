export function setYear() { const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear(); }

export function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v; else if (k === 'html') e.innerHTML = v; else e.setAttribute(k, v);
  }
  if (!Array.isArray(children)) children = [children];
  children.filter(Boolean).forEach(c => e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
  return e;
}

export function toast(message, kind = 'success') {
  const c = document.getElementById('toast-container');
  const t = el('div', { class: `toast ${kind}` }, message);
  c.appendChild(t);
  setTimeout(() => { t.remove(); }, 3000);
}
