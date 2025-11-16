import axios from 'axios';
import { Task, AiSuggestion, Analytics, AuthForm, User } from '../types'; // Added User

const API_BASE = 'http://localhost:9000/api';

const api = axios.create({ baseURL: API_BASE });

// Interceptor: Replace {userId} with actual ID; guard if missing
api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId');
  if (config.url?.includes('{userId}')) {
    if (!userId) {
      console.error('Missing userId in localStorage—redirecting to login');
      window.location.href = '/';
      return Promise.reject(new Error('Not authenticated'));
    }
    if (config.url) {
      (config.url as string) = config.url.replace('{userId}', userId);
    }
  }
  return config;
});

// Auth (Fixed: Return res.data directly—no nested "data")
export const authAPI = {
  signup: (data: AuthForm & { name: string }) =>
    api.post<User>('/users/signup', data).then((res) => res.data),

  signin: (data: AuthForm) =>
    api.post<User>('/users/signin', data).then((res) => res.data),

  forgotPassword: (data: { email: string }) =>
    api.post('/users/forgot-password', data),

  resetPassword: (email: string, data: { otp: string; newPassword: string }) =>
    api.post(`/users/${email}/reset-password`, data),
};

// Tasks
export const taskAPI = {
  create: (data: Omit<Task, 'id' | 'createdAt'>) =>
    api.post<Task>('/tasks/{userId}', data),

  list: () => api.get<Task[]>('/tasks/{userId}'),

  get: (id: number) => api.get<Task>(`/tasks/{userId}/${id}`),

  update: (id: number, data: Partial<Task>) =>
    api.put<Task>(`/tasks/{userId}/${id}`, data),

  delete: (id: number) => api.delete(`/tasks/{userId}/${id}`),
};

// AI
export const aiAPI = {
  suggestions: (data: { tasks: Task[] }) =>
    api.post<AiSuggestion>('/ai/suggestions/{userId}', data),
};

// Analytics
export const analyticsAPI = {
  tasks: () => api.get<Analytics>('/analytics/tasks/{userId}'),
};
