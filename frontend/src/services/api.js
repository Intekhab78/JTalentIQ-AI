import axios from 'axios';

// Base URL configuration:
// - Explicit environment variable VITE_API_URL takes highest priority if defined.
// - In local development (`npm run dev`), default to local backend: http://localhost:5000/api
// - In production build, default to online backend: https://jtalentiqapi.jtsonline.shop/api
let rawBase = import.meta.env.VITE_API_URL;

if (!rawBase) {
  if (import.meta.env.DEV) {
    rawBase = 'http://localhost:5000/api';
  } else {
    rawBase = 'https://jtalentiqapi.jtsonline.shop/api';
  }
}

const API_BASE = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT Token to outgoing requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
