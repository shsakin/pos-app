import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await apiClient.get('/products');
      return response.data;
    },
  });
};

export const useProduct = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post('/products', data);
      return response.data;
    },
    onSuccess: (createdProduct) => {
      // Insert the new product at the beginning of the cached list
      queryClient.setQueryData(['products'], (old = []) => {
        if (!old.find((p) => p.id === createdProduct.id)) {
          return [createdProduct, ...old];
        }
        return old.map((p) => (p.id === createdProduct.id ? createdProduct : p));
      });
      // Ensure single-product cache is set
      queryClient.setQueryData(['product', createdProduct.id], createdProduct);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await apiClient.put(`/products/${id}`, data);
      return response.data;
    },
    onSuccess: (updatedProduct) => {
      // Update the list cache
      queryClient.setQueryData(['products'], (old = []) =>
        old.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      // Update single-product cache
      queryClient.setQueryData(['product', updatedProduct.id], updatedProduct);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/products/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(['products'], (old = []) => old.filter((p) => p.id !== deletedId));
      queryClient.removeQueries({ queryKey: ['product', deletedId] });
    },
  });
};
