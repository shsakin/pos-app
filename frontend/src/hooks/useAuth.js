import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials) => {
      const response = await apiClient.post('/auth/login', credentials);
      // Store token
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post('/auth/register', data);
      // Store token
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await apiClient.get('/auth/me');
      return response.data;
    },
    enabled: !!localStorage.getItem('access_token'),
  });
};

export const useLogout = () => {
  return () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  };
};
