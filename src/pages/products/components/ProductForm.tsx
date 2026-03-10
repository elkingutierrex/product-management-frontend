import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Product } from '@/types/product';
import { productSchema } from '@/types/product';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productToEdit?: Product | null;
}

export function ProductForm({ open, onOpenChange, productToEdit }: ProductFormProps) {
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const isEditing = !!productToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      price: 0 as any,
      stock: 0 as any,
      sku: '',
      active: true,
    },
  });

  useEffect(() => {
    if (productToEdit && open) {
      reset({
        name: productToEdit.name,
        description: productToEdit.description || '',
        price: productToEdit.price,
        stock: productToEdit.stock,
        sku: productToEdit.sku,
        active: productToEdit.active,
      });
    } else if (!open) {
      reset({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        sku: '',
        active: true,
      });
    }
  }, [productToEdit, open, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (isEditing && productToEdit) {
        await updateMutation.mutateAsync({ id: productToEdit.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
    } catch (error) {
      // Error is handled by global query mutation hooks with Sonner toasts
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Actualiza los detalles del producto en el inventario.' 
              : 'Completa los campos para añadir un nuevo producto al inventario.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>Nombre del producto</Label>
              <Input
                id="name"
                placeholder="Ej. MacBook Pro 16"
                {...register('name')}
                className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="sku" className={errors.sku ? "text-destructive" : ""}>SKU</Label>
              <Input
                id="sku"
                placeholder="MAC-PRO-16"
                {...register('sku')}
                className={errors.sku ? "border-destructive focus-visible:ring-destructive" : "uppercase"}
              />
              {errors.sku && <p className="text-xs text-destructive">{errors.sku.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className={errors.price ? "text-destructive" : ""}>Precio ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register('price')}
                className={errors.price ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock" className={errors.stock ? "text-destructive" : ""}>Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                placeholder="0"
                {...register('stock')}
                className={errors.stock ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="description" className={errors.description ? "text-destructive" : ""}>Descripción (Opcional)</Label>
              <Input
                id="description"
                placeholder="Añade detalles sobre el producto..."
                {...register('description')}
                className={errors.description ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>
            
            <div className="space-y-2 col-span-2 flex flex-row items-center space-x-2">
               <input
                 type="checkbox"
                 id="active"
                 {...register('active')}
                 className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
               />
               <Label htmlFor="active" className="cursor-pointer mb-0">
                 Producto Activo
               </Label>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending || isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid || isPending || isSubmitting}>
              {isPending || isSubmitting ? 'Guardando...' : 'Guardar Producto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
