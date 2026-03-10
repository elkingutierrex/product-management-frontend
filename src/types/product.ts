import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(100, "El nombre no puede superar los 100 caracteres"),
  description: z.string().max(1000, "La descripción no puede superar los 1000 caracteres").optional().nullable(),
  price: z.coerce.number().positive("El precio debe ser mayor a 0"),
  stock: z.coerce.number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),
  sku: z.string()
    .min(1, "El SKU es requerido")
    .regex(/^[A-Z0-9]+(-[A-Z0-9]+)*$/, "El SKU solo puede contener letras mayúsculas, números y guiones"),
  active: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;

export interface Product extends ProductInput {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    total_pages: number;
    total_count: number;
  };
}
