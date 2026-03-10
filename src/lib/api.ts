import type { Product, PaginatedResponse } from '@/types/product';

const API_BASE_URL = '/api/v1';

export async function fetchProducts(
  page: number = 1,
  limit: number = 10,
  search?: string,
  active?: string
): Promise<PaginatedResponse<Product>> {
  const url = new URL(`${API_BASE_URL}/products`, window.location.origin);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('limit', limit.toString());
  
  if (search) {
    url.searchParams.append('search', search);
  }
  if (active !== undefined && active !== 'all') {
    url.searchParams.append('active', active);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return response.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
}

export async function createProduct(data: Partial<Product>): Promise<{ data: Product }> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create product');
  }
  return response.json();
}

export async function updateProduct({ id, data }: { id: string, data: Partial<Product> }): Promise<{ data: Product }> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update product');
  }
  return response.json();
}
