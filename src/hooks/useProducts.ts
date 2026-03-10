import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, deleteProduct, createProduct, updateProduct } from '@/lib/api';
import { toast } from 'sonner';

export function useProducts(page: number, limit: number, search?: string, active?: string) {
  return useQuery({
    queryKey: ['products', { page, limit, search, active }],
    queryFn: () => fetchProducts(page, limit, search, active),
    staleTime: 5000,
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success('Producto eliminado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      toast.error(`Error al eliminar: ${error.message || 'Error desconocido'}`);
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success('Producto creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      toast.error(`Error al crear: ${error.message || 'Error desconocido'}`);
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      toast.success('Producto actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      toast.error(`Error al actualizar: ${error.message || 'Error desconocido'}`);
    },
  });
}
