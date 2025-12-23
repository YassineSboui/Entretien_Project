import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Set auth token for all requests
export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Auth API
export const authAPI = {
  login: (username: string, password: string) =>
    api.post("/auth/login", null, { params: { username, password } }),
  signup: (data: {
    username: string;
    password: string;
    email?: string;
    full_name?: string;
  }) => api.post("/auth/signup", data),
  verify: () => api.get("/auth/verify"),
};

// Franchise API
export const franchiseAPI = {
  getAll: (params?: {
    search?: string;
    is_active?: boolean;
    skip?: number;
    limit?: number;
  }) => api.get("/franchises", { params }),
  getStats: () => api.get("/franchises/stats"),
  getById: (id: number) => api.get(`/franchises/${id}`),
  create: (data: any) => api.post("/franchises", data),
  update: (id: number, data: any) => api.put(`/franchises/${id}`, data),
  delete: (id: number) => api.delete(`/franchises/${id}`),
  // Alias path matching the case study requirement
  getBranches: (id: number, params?: { skip?: number; limit?: number }) =>
    api.get(`/franchises/${id}/branches`, { params }),
};

// Branch API
export const branchAPI = {
  getAll: (franchiseId?: number) =>
    api.get("/branches", { params: { franchise_id: franchiseId } }),
  getById: (id: number) => api.get(`/branches/${id}`),
  create: (data: any) => api.post("/branches", data),
  delete: (id: number) => api.delete(`/branches/${id}`),
};

// Budget API
export const budgetAPI = {
  getAll: (params?: {
    franchise_id?: number;
    branch_id?: number;
    period?: string;
    skip?: number;
    limit?: number;
  }) => api.get("/budgets", { params }),
  getById: (id: number) => api.get(`/budgets/${id}`),
  getSummary: (id: number) => api.get(`/budgets/${id}/summary`),
  create: (data: any) => api.post("/budgets", data),
  update: (id: number, data: any) => api.put(`/budgets/${id}`, data),
  delete: (id: number) => api.delete(`/budgets/${id}`),
  approve: (id: number) => api.post(`/budgets/${id}/approve`),
  reject: (id: number) => api.post(`/budgets/${id}/reject`),
};

// Expense API
export const expenseAPI = {
  getAll: (params?: {
    franchise_id?: number;
    branch_id?: number;
    budget_id?: number;
    skip?: number;
    limit?: number;
  }) => api.get("/expenses", { params }),
  getById: (id: number) => api.get(`/expenses/${id}`),
  create: (data: any) => api.post("/expenses", data),
  delete: (id: number) => api.delete(`/expenses/${id}`),
};
