import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const verifyToken = () => api.get('/auth/verify');
export const forgotPassword = (data) => api.post('/auth/forgot-password', data);
export const resetPassword = (data) => api.post('/auth/reset-password', data);
export const updateProfile = (data) => api.put('/auth/update-profile', data);
export const changePassword = (data) => api.put('/auth/change-password', data);

// Income APIs
export const createIncome = (data) => api.post('/income/', data);
export const getIncomes = () => api.get('/income/');
export const updateIncome = (id, data) => api.put(`/income/${id}`, data);
export const deleteIncome = (id) => api.delete(`/income/${id}`);

// Expense APIs
export const createExpense = (data) => api.post('/expense/', data);
export const getExpenses = () => api.get('/expense/');
export const updateExpense = (id, data) => api.put(`/expense/${id}`, data);
export const deleteExpense = (id) => api.delete(`/expense/${id}`);

// Dashboard APIs
export const getDashboardSummary = () => api.get('/dashboard/summary');

export default api;
