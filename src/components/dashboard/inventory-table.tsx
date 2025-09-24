
'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pencil, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { DiscrepancyPopover } from './discrepancy-popover';
import { formatCurrency } from '@/lib/utils';

export function InventoryTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [stockInputValue, setStockInputValue] = useState<number>(0);
  const { toast } = useToast();

  const handleEditClick = (product: Product) => {
    setEditingProductId(product.id);
    setStockInputValue(product.warehouseStock);
  };

  const handleCancelClick = () => {
    setEditingProductId(null);
  };

  const handleSaveClick = async (productId: string) => {
    // Here you would typically call a server action to save the data
    // For this mock, we just update the client-side state
    setProducts(
      products.map((p) => (p.id === productId ? { ...p, warehouseStock: stockInputValue } : p))
    );
    setEditingProductId(null);
    toast({
      title: 'Success',
      description: 'Warehouse stock updated successfully.',
    });
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Wix Stock</TableHead>
            <TableHead className="text-right">Warehouse Stock</TableHead>
            <TableHead className="text-right">Difference</TableHead>
            <TableHead className="text-center w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const isEditing = editingProductId === product.id;
            const difference = product.warehouseStock - product.wixStock;
            return (
              <TableRow key={product.id} className={difference !== 0 ? 'bg-accent/10' : ''}>
                <TableCell>
                  <Image
                    alt={product.name}
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={product.image}
                    width="64"
                    data-ai-hint="product image"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="font-bold">{product.name}</div>
                  <div className="text-sm text-muted-foreground">{product.sku}</div>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                <TableCell className="text-right">{product.wixStock}</TableCell>
                <TableCell className="text-right">
                  {isEditing ? (
                    <div className="flex items-center justify-end gap-2">
                      <Input
                        type="number"
                        className="w-24 h-9 text-right"
                        value={stockInputValue}
                        onChange={(e) => setStockInputValue(parseInt(e.target.value, 10) || 0)}
                        autoFocus
                      />
                    </div>
                  ) : (
                    product.warehouseStock
                  )}
                </TableCell>
                <TableCell className="text-right">
                    <Badge variant={difference === 0 ? 'secondary' : 'destructive'}>
                        {difference}
                    </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {isEditing ? (
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleSaveClick(product.id)}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleCancelClick}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <DiscrepancyPopover product={product} />
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
