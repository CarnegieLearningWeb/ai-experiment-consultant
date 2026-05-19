const API_BASE = '/api/v1/ai-consultant';

async function request(path, { method = 'GET', body, headers } = {}) {
  const opts = { method, headers: { ...(headers || {}) } };
  if (body !== undefined) {
    if (body instanceof FormData) {
      opts.body = body;
    } else {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
  }
  const res = await fetch(`${API_BASE}${path}`, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error?.message || `Request failed (${res.status})`);
    err.code = data?.error?.code;
    err.status = res.status;
    throw err;
  }
  return data;
}

function tryParseLine(line, onEvent) {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    onEvent?.(JSON.parse(trimmed));
  } catch {
    console.warn('[streamChat] non-JSON line:', trimmed);
  }
}

function drainBuffer(buffer, onEvent) {
  let rest = buffer;
  let nl;
  while ((nl = rest.indexOf('\n')) !== -1) {
    tryParseLine(rest.slice(0, nl), onEvent);
    rest = rest.slice(nl + 1);
  }
  return rest;
}

async function readChatErrorBody(res) {
  let payload = {};
  try {
    payload = await res.json();
  } catch {
    /* non-JSON error body */
  }
  const err = new Error(payload?.error?.message || `Chat request failed (${res.status})`);
  err.code = payload?.error?.code;
  err.status = res.status;
  return err;
}

// Stream a chat response. Server returns NDJSON; each line is one event:
//   { type: "delta", text: "..." }
//   { type: "done",  stopReason, usage }
//   { type: "error", code, message }
// `onEvent(evt)` is called for each parsed event in order.
export async function streamChat(messages, { onEvent, signal } = {}) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal,
  });

  if (!res.ok || !res.body) throw await readChatErrorBody(res);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      buffer = drainBuffer(buffer, onEvent);
    }
    tryParseLine(buffer, onEvent);
  } finally {
    reader.releaseLock?.();
  }
}

async function uploadFile(file) {
  const fd = new FormData();
  fd.append('file', file);
  return request('/uploads', { method: 'POST', body: fd });
}

export const api = {
  health: () => request('/health'),
  upload: uploadFile,
  simulation: (design, cohortSize) =>
    request('/simulation', { method: 'POST', body: { design, cohortSize } }),
  report: (state) => request('/report', { method: 'POST', body: { state } }),
  streamChat,
};
