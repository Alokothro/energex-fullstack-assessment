import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const CACHE_URL = process.env.REACT_APP_CACHE_URL || 'http://localhost:3001/cache';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't redirect here, let the component handle it
      // This prevents the "Not Found" error
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) =>
    api.post('/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/login', data),
  
  logout: () => api.post('/logout'),
  
  me: () => api.get('/me'),
};

export const postsAPI = {
  getAll: () => api.get('/posts'),
  
  getById: (id: number) => api.get(`/posts/${id}`),
  
  create: (data: { title: string; content: string }) =>
    api.post('/posts', data),
  
  update: (id: number, data: { title?: string; content?: string }) =>
    api.put(`/posts/${id}`, data),
  
  delete: (id: number) => api.delete(`/posts/${id}`),
};

export const cacheAPI = {
  getPosts: () => axios.get(`${CACHE_URL}/posts`),
  
  getPost: (id: number) => axios.get(`${CACHE_URL}/posts/${id}`),
  
  flush: () => axios.delete(`${CACHE_URL}/flush`),
};

export default api;