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

export const api = {
  health: () => request('/health'),
  chat: (messages, attachments = []) =>
    request('/chat', { method: 'POST', body: { messages, attachments } }),
  upload: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return request('/uploads', { method: 'POST', body: fd });
  },
  simulation: (design, cohortSize) =>
    request('/simulation', { method: 'POST', body: { design, cohortSize } }),
  report: (state) => request('/report', { method: 'POST', body: { state } }),
};
