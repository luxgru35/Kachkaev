import axios, { AxiosInstance } from 'axios';
import { tokenUtils } from '@utils/tokenUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_KEY = import.meta.env.VITE_API_KEY || 'your_api_key_here';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
});

// Добавляем токен в каждый запрос если он есть
axiosInstance.interceptors.request.use((config) => {
  const token = tokenUtils.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка ошибок ответа
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Не обрабатываем 401 здесь - пусть компоненты сами их обрабатывают
    return Promise.reject(error);
  }
);

export default axiosInstance;
