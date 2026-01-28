import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';

export const useSales = () => {
  return useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const response = await apiClient.get('/sales');
      return response.data;
    },
  });
};

export const useSale = (id) => {
  return useQuery({
    queryKey: ['sale', id],
    queryFn: async () => {
      const response = await apiClient.get(`/sales/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post('/sales', data);
      return response.data;
    },
    onSuccess: (createdSale) => {
      // Add the new sale at the beginning of the cached list
      queryClient.setQueryData(['sales'], (old = []) => {
        if (!old.find((s) => s.id === createdSale.id)) {
          return [createdSale, ...old];
        }
        return old.map((s) => (s.id === createdSale.id ? createdSale : s));
      });
      // Invalidate products to refresh stock counts
      queryClient.invalidateQueries({ queryKey: ['products'] });
      // Set individual sale cache
      queryClient.setQueryData(['sale', createdSale.id], createdSale);
    },
  });
};
