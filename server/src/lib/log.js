import { config } from '../config.js';

// Debug logging is on by default in development and off in production.
// Override either way with DEBUG_LOGGING=true|false in .env.
function parseFlag(v) {
  if (v == null) return null;
  const s = String(v).toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(s)) return true;
  if (['0', 'false', 'no', 'off'].includes(s)) return false;
  return null;
}

const override = parseFlag(process.env.DEBUG_LOGGING);
const ENABLED = override == null ? config.isDev : override;

const COLORS = {
  tool: '\x1b[36m', // cyan
  upgrade: '\x1b[35m', // magenta
  sim: '\x1b[33m', // yellow
  chat: '\x1b[34m', // blue
  warn: '\x1b[31m', // red
};
const RESET = '\x1b[0m';

function fmt(category, msg, fields) {
  const color = COLORS[category] || '';
  const tag = `${color}[${category}]${RESET}`;
  if (!fields || Object.keys(fields).length === 0) return `${tag} ${msg}`;
  const fieldStr = Object.entries(fields)
    .map(([k, v]) => `${k}=${v == null ? 'null' : typeof v === 'object' ? JSON.stringify(v) : v}`)
    .join(' ');
  return `${tag} ${msg} ${fieldStr}`;
}

function make(category, level = 'log') {
  return (msg, fields) => {
    if (!ENABLED && level === 'log') return;
    const out = fmt(category, msg, fields);
    if (level === 'warn') console.warn(out);
    else console.log(out);
  };
}

export const log = {
  enabled: ENABLED,
  tool: make('tool'),
  upgrade: make('upgrade'),
  sim: make('sim'),
  chat: make('chat'),
  // Warnings always print regardless of DEBUG_LOGGING — they signal real problems.
  warn: make('warn', 'warn'),
};
