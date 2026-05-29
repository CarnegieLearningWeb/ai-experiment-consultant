// Lightweight transient-notification helper. Toasts stack at the top of the
// viewport (see #toast-container in index.html), auto-dismiss after a few
// seconds, and can be dismissed early via the × button. Intended for things
// that need user attention but don't have a natural inline UI anchor — e.g.
// upload-limit warnings, network errors, future global error states.

const KIND_CLASSES = {
  info: '',
  warning: 'toast--warning',
  error: 'toast--error',
};

const DEFAULT_DURATION_MS = 4000;

let containerEl = null;
let nextId = 0;
const active = new Map(); // id -> { el, timeoutId }

function getContainer() {
  if (containerEl) return containerEl;
  containerEl = document.getElementById('toast-container');
  return containerEl;
}

function dismiss(id) {
  const entry = active.get(id);
  if (!entry) return;
  active.delete(id);
  if (entry.timeoutId) clearTimeout(entry.timeoutId);
  entry.el.classList.add('toast--leaving');
  // Remove from DOM once the leaving animation finishes; fall back to a
  // timer in case animationend doesn't fire (e.g. element already detached).
  let removed = false;
  const cleanup = () => {
    if (removed) return;
    removed = true;
    entry.el.remove();
  };
  entry.el.addEventListener('animationend', cleanup, { once: true });
  setTimeout(cleanup, 400);
}

export function showToast(message, { kind = 'info', duration = DEFAULT_DURATION_MS } = {}) {
  const container = getContainer();
  if (!container) return null;

  const id = ++nextId;
  const el = document.createElement('div');
  el.className = ['toast', KIND_CLASSES[kind] || ''].filter(Boolean).join(' ');
  // role="alert" is assertive (interrupts a screen reader); use it for errors
  // only. The container already has aria-live="polite" for the rest.
  if (kind === 'error') el.setAttribute('role', 'alert');

  const msg = document.createElement('span');
  msg.className = 'toast__message';
  msg.textContent = message;
  el.appendChild(msg);

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'toast__close';
  close.setAttribute('aria-label', 'Dismiss');
  close.textContent = '×';
  close.addEventListener('click', () => dismiss(id));
  el.appendChild(close);

  container.appendChild(el);
  const timeoutId = duration > 0 ? setTimeout(() => dismiss(id), duration) : null;
  active.set(id, { el, timeoutId });
  return id;
}

export function dismissToast(id) {
  dismiss(id);
}
