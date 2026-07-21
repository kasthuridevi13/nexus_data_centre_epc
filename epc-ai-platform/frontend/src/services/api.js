import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

console.log("Frontend API is attempting to connect to:", import.meta.env.VITE_API_URL || "http://localhost:5000/api");

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nexus_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthAPI = {
  login: (credentials) => api.post("/auth/login", credentials).then((r) => r.data),
};

export const DashboardAPI = {
  summary: () => api.get("/dashboard/summary").then((r) => r.data),
};

export const DocumentAPI = {
  list: (params) => api.get("/documents", { params }).then((r) => r.data),
  upload: (formData) =>
    api.post("/documents/upload", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  createText: (payload) => api.post("/documents/text", payload).then((r) => r.data),
};

export const ComplianceAPI = {
  list: (params) => api.get("/compliance", { params }).then((r) => r.data),
  run: (payload) => api.post("/compliance/run", payload).then((r) => r.data),
};

export const ScheduleRiskAPI = {
  list: () => api.get("/schedule-risk").then((r) => r.data),
  recompute: () => api.post("/schedule-risk/recompute").then((r) => r.data),
  mitigations: (id) => api.post(`/schedule-risk/${id}/mitigations`).then((r) => r.data),
};

export const SupplyChainAPI = {
  list: () => api.get("/supply-chain").then((r) => r.data),
  recompute: () => api.post("/supply-chain/recompute").then((r) => r.data),
};

export const CommissioningAPI = {
  list: () => api.get("/commissioning").then((r) => r.data),
  updateItem: (checklistId, testId, payload) =>
    api.patch(`/commissioning/${checklistId}/items/${testId}`, payload).then((r) => r.data),
};

export const RFIAPI = {
  list: () => api.get("/rfi").then((r) => r.data),
  ask: (question) => api.post("/rfi/ask", { question }).then((r) => r.data),
};

export const AuditAPI = {
  list: (params) => api.get("/audit", { params }).then((r) => r.data),
};

export default api;
