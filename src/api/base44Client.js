/**
 * Local API client — replaces the Base44 SDK for offline/localhost usage.
 * Mirrors the same interface used across all pages:
 *   base44.entities.Resume.list / create / delete
 *   base44.entities.Feedback.list / create / delete
 *   base44.integrations.Core.UploadFile
 *   base44.integrations.Core.InvokeLLM
 */

const API_BASE = '/api';

// ─── Generic fetch helper ──────────────────────────────────────────────────────
async function apiFetch(url, options = {}) {
  const res = await fetch(API_BASE + url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ─── Entity factory ────────────────────────────────────────────────────────────
function makeEntity(name) {
  const endpoint = `/${name}s`; // e.g. /resumes, /feedbacks

  return {
    list: (orderBy = '-created_date', limit = 100) => {
      const params = new URLSearchParams({ order: orderBy, limit });
      return apiFetch(`${endpoint}?${params}`);
    },
    get: (id) => apiFetch(`${endpoint}/${id}`),
    create: (data) => apiFetch(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiFetch(`${endpoint}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiFetch(`${endpoint}/${id}`, { method: 'DELETE' }),
  };
}

// ─── File Upload ───────────────────────────────────────────────────────────────
async function UploadFile({ file }) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'File upload failed');
  }
  return res.json(); // { file_url, original_name }
}

// ─── LLM Invocation ───────────────────────────────────────────────────────────
async function InvokeLLM({ prompt, file_urls, response_json_schema }) {
  return apiFetch('/llm', {
    method: 'POST',
    body: JSON.stringify({ prompt, file_urls, response_json_schema }),
  });
}

// ─── Auth stub (no-op for local) ───────────────────────────────────────────────
const auth = {
  me: async () => ({ id: 'local-user', email: 'local@localhost', name: 'Local User' }),
  logout: () => {},
  redirectToLogin: () => {},
};

// ─── Export the same shape as the Base44 SDK ──────────────────────────────────
export const base44 = {
  entities: {
    Resume: makeEntity('resume'),
    Feedback: makeEntity('feedback'),
  },
  integrations: {
    Core: {
      UploadFile,
      InvokeLLM,
    },
  },
  auth,
};
