
import type { Product } from './types';
import { getWixProducts } from './wix-service';

const mockProducts: Product[] = [
  {
    id: 'prod_001',
    name: 'Classic White Tee',
    sku: 'SKU-CW-TEE-M',
    wixStock: 48,
    warehouseStock: 50,
    image: 'https://picsum.photos/seed/swp1/100/100',
    price: 24.99,
  },
  {
    id: 'prod_002',
    name: 'Denim Blue Jeans',
    sku: 'SKU-DB-JEA-32',
    wixStock: 25,
    warehouseStock: 25,
    image: 'https://picsum.photos/seed/swp2/100/100',
    price: 89.99,
  },
  {
    id: 'prod_003',
    name: 'Stealth Black Hoodie',
    sku: 'SKU-SB-HOO-L',
    wixStock: 15,
    warehouseStock: 20,
    image: 'https://picsum.photos/seed/swp3/100/100',
    price: 59.99,
  },
  {
    id: 'prod_004',
    name: 'Crimson Baseball Cap',
    sku: 'SKU-CB-CAP-OS',
    wixStock: 30,
    warehouseStock: 30,
    image: 'https://picsum.photos/seed/swp4/100/100',
    price: 19.99,
  },
   {
    id: 'prod_005',
    name: 'Leather Belt',
    sku: 'SKU-LE-BELT-34',
    wixStock: 39,
    warehouseStock: 45,
    image: 'https://picsum.photos/seed/swp5/100/100',
    price: 34.99,
  },
];

let productsCache: Product[] | null = null;
const WAREHOUSE_STOCK_MOCK: Record<string, number> = {
    'SKU-CW-TEE-M': 50,
    'SKU-DB-JEA-32': 25,
    'SKU-SB-HOO-L': 20,
    'SKU-CB-CAP-OS': 30,
    'SKU-LE-BELT-34': 45,
};


export async function getProducts(): Promise<Product[]> {
  const appId = process.env.WIX_APP_ID;
  const appSecret = process.env.WIX_APP_SECRET;

  // Check if credentials are set and are not the placeholder values
  if (appId && appSecret && appId !== 'YOUR_APP_ID' && appSecret !== 'YOUR_APP_SECRET') {
      if (productsCache) {
          return productsCache;
      }
      try {
          const wixProducts = await getWixProducts();
          
          productsCache = wixProducts.map(p => ({
              ...p,
              // Since warehouse stock is not in Wix, we use a mock value for demonstration
              // In a real app, this would come from a database or another system
              warehouseStock: WAREHOUSE_STOCK_MOCK[p.sku] ?? p.wixStock 
          }));

          return productsCache;
      } catch (error) {
          console.error("Failed to fetch from Wix, falling back to mock data.", error);
          // Fallback to mock data on API error
          return mockProducts;
      }
  } else {
    // Use mock data if credentials are not configured
    return mockProducts;
  }
}
