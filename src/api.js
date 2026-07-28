const API_BASE = "http://127.0.0.1:8000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
}

export const api = {
  getStudent: (rollNo) => request(`/student/${encodeURIComponent(rollNo)}/`),
  listStudents: (search = "") =>
    request(`/students/${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  submitRegistration: (payload) =>
    request(`/submit/`, { method: "POST", body: JSON.stringify(payload) }),
  dashboard: () => request(`/dashboard/`),
  listRegistrations: () => request(`/registrations/`),
  downloadUrl: (which) => `${API_BASE}/download/${which}/`,
};
