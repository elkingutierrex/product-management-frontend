import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductTable } from './components/ProductTable';
import { ProductForm } from './components/ProductForm';
import type { Product } from '@/types/product';

export default function ProductsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const handleAddProduct = () => {
    setProductToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsFormOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gestiona tu catálogo de productos, precios e inventario.
          </p>
        </div>
        
        <Button onClick={handleAddProduct} className="gap-2">
          <Plus className="h-4 w-4" />
          Añadir Producto
        </Button>
      </div>
      
      <ProductTable onEdit={handleEditProduct} />

      <ProductForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        productToEdit={productToEdit} 
      />
    </div>
  );
}
