
import type { Product } from './types';
import { getWixProducts } from './wix-service';

let productsCache: Product[] | null = null;

// This function simulates fetching warehouse stock for a given SKU.
// In a real-world application, this data would come from a separate inventory management system or database.
const getWarehouseStockForSku = (sku: string): number => {
  const mockWarehouseStock: Record<string, number> = {
    'SKU-CW-TEE-M': 50,
    'SKU-DB-JEA-32': 25,
    'SKU-SB-HOO-L': 20,
    'SKU-CB-CAP-OS': 30,
    'SKU-LE-BELT-34': 45,
  };
  // Default to a value (e.g., the SKU's hash) if not in the mock list to provide some data
  return mockWarehouseStock[sku] ?? sku.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 50;
};


export async function getProducts(): Promise<Product[]> {
  const appId = process.env.WIX_APP_ID;
  const appSecret = process.env.WIX_APP_SECRET;

  // If credentials are not set, return an empty array
  if (!appId || !appSecret || appId === 'YOUR_APP_ID' || appSecret === 'YOUR_APP_SECRET') {
    console.warn("Wix credentials are not configured. Returning empty product list.");
    return [];
  }

  // Use cache if available
  if (productsCache) {
      return productsCache;
  }
  
  try {
      const wixProducts = await getWixProducts();
      
      productsCache = wixProducts.map(p => ({
          ...p,
          // Since warehouse stock is not in Wix, we simulate it.
          warehouseStock: getWarehouseStockForSku(p.sku),
      }));

      return productsCache;
  } catch (error) {
      console.error("Failed to fetch products from Wix. Returning empty array.", error);
      // On API error, return an empty array instead of mock data.
      return [];
  }
}
