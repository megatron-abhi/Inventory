
import type { Product } from './types';

const products: Product[] = [
  {
    id: 'prod_001',
    name: 'Classic White Tee',
    sku: 'SKU-CW-TEE-M',
    wixStock: 48,
    warehouseStock: 50,
    image: 'https://picsum.photos/seed/swp1/100/100',
  },
  {
    id: 'prod_002',
    name: 'Denim Blue Jeans',
    sku: 'SKU-DB-JEA-32',
    wixStock: 25,
    warehouseStock: 25,
    image: 'https://picsum.photos/seed/swp2/100/100',
  },
  {
    id: 'prod_003',
    name: 'Stealth Black Hoodie',
    sku: 'SKU-SB-HOO-L',
    wixStock: 15,
    warehouseStock: 20,
    image: 'https://picsum.photos/seed/swp3/100/100',
  },
  {
    id: 'prod_004',
    name: 'Crimson Baseball Cap',
    sku: 'SKU-CB-CAP-OS',
    wixStock: 30,
    warehouseStock: 30,
    image: 'https://picsum.photos/seed/swp4/100/100',
  },
   {
    id: 'prod_005',
    name: 'Leather Belt',
    sku: 'SKU-LE-BELT-34',
    wixStock: 39,
    warehouseStock: 45,
    image: 'https://picsum.photos/seed/swp5/100/100',
  },
];

export async function getProducts(): Promise<Product[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return products;
}
