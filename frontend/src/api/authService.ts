import axiosInstance from './axios';
import type { AuthResponse, User } from '../types';

export const authService = {
  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<User> => {
    const response = await axiosInstance.post<User>('/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },
};
