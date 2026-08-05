const API_BASE = import.meta.env.VITE_API_BASE || '/api/v1';

let getToken = () => null;

export function setTokenProvider(fn) {
  getToken = fn;
}

export class ApiError extends Error {
  constructor(status, message, code = 'API_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function request(path, { method = 'GET', body, headers = {}, formData } = {}) {
  const token = getToken();
  const opts = { method, headers: { ...headers } };
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  if (formData) {
    opts.body = formData;
  } else if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, opts);

  if (res.status === 204) return null;

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message = data?.error?.message || `Request failed (${res.status})`;
    throw new ApiError(res.status, message, data?.error?.code);
  }
  return data;
}

export const apiClient = {
  get: (path, headers) => request(path, { headers }),
  post: (path, body, headers) => request(path, { method: 'POST', body, headers }),
  patch: (path, body, headers) => request(path, { method: 'PATCH', body, headers }),
  delete: (path, headers) => request(path, { method: 'DELETE', headers }),
  postForm: (path, formData) => request(path, { method: 'POST', formData }),
};

export default apiClient;